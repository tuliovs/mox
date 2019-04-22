function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var nodePath = require('path');
var ok = require('assert').ok;
var equal = require('assert').equal;
const VAR_REQUIRE_PROCESS = 'process=require("process")';
const VAR_REQUIRE_BUFFER = 'Buffer=require("buffer").Buffer';

var inspectCache = require('./inspect-cache');
var Deduper = require('./util/Deduper');
var normalizeMain = require('lasso-modules-client/transport').normalizeMain;
var lassoCachingFS = require('lasso-caching-fs');
var lassoPackageRoot = require('lasso-package-root');
var normalizeFSPath = require('./util/normalizeFSPath');
var crypto = require('crypto');

function buildAsyncInfo(path, asyncBlocks, lassoContext) {
    if (asyncBlocks.length === 0) {
        return null;
    }

    var key = 'require-async|' + normalizeFSPath(path);
    var asyncInfo = lassoContext.data[key];

    if (!asyncInfo) {
        asyncInfo = lassoContext.data[key] = {
            asyncMeta: {},
            asyncBlocks: asyncBlocks
        };

        asyncBlocks.forEach(function (asyncBlock, i) {
            if (!asyncBlock.hasInlineDependencies && !asyncBlock.hasFunctionBody) {
                // only generate a unique package name if the async
                // function call was provided a `function` as the
                // last argument or if an array of dependencies were
                // inlined.
                return;
            }

            var hash = '_' + crypto.createHash('sha1').update(key).update(String(i)).digest('hex').substring(0, 6);

            var name = asyncBlock.name = hash;
            asyncInfo.asyncMeta[name] = asyncBlock.dependencies;
        });
    }

    return asyncInfo;
}

function create(config, lasso) {
    config = config || {};
    var globals = config.globals;
    var getClientPath = config.getClientPath;

    var readyDependency = lasso.dependencies.createDependency({
        type: 'commonjs-ready',
        inline: 'end',
        slot: config.lastSlot
    }, __dirname);

    var runtimeDependency = lasso.dependencies.createDependency({
        type: 'commonjs-runtime'
    }, __dirname);

    function handleMetaRemap(metaEntry, deduper) {
        var from = metaEntry.from;
        var to = metaEntry.to;

        var remapKey = deduper.remapKey(from, to);
        if (!deduper.hasRemap(remapKey)) {
            var fromPath = getClientPath(from);
            var toPath;

            if (to === false) {
                toPath = false;
            } else {
                toPath = getClientPath(to);
            }

            deduper.addDependency(remapKey, {
                type: 'commonjs-remap',
                from: fromPath,
                to: toPath,
                fromFile: from
            });
        }
    }

    function handleMetaInstalled(metaEntry, deduper) {
        var packageName = metaEntry.packageName;
        var searchPath = metaEntry.searchPath;
        var fromDir = metaEntry.fromDir;
        var basename = nodePath.basename(searchPath);

        if (basename === 'node_modules') {
            var childName = packageName;
            var parentPath = lassoPackageRoot.getRootDir(fromDir);
            var pkg = lassoCachingFS.readPackageSync(nodePath.join(searchPath, packageName, 'package.json'));
            var childVersion = pkg && pkg.version || '0';

            let key = deduper.installedKey(parentPath, childName, childVersion);

            if (!deduper.hasInstalled(key)) {
                var clientParentPath = getClientPath(parentPath);

                deduper.addDependency(key, {
                    type: 'commonjs-installed',
                    parentPath: clientParentPath,
                    childName: childName,
                    childVersion: childVersion,
                    parentDir: parentPath
                });
            }
        } else {
            let key = deduper.searchPathKey(searchPath);
            if (!deduper.hasSearchPath(key)) {
                var clientSearchPath = getClientPath(searchPath);
                if (!clientSearchPath.endsWith('/')) {
                    // Search paths should always end with a forward slash
                    clientSearchPath += '/';
                }
                // This is a non-standard standard search path entry
                deduper.addDependency(key, {
                    type: 'commonjs-search-path',
                    path: clientSearchPath
                });
            }
        }
    }

    function handleMetaMain(metaEntry, deduper) {
        var dir = metaEntry.dir;
        var main = metaEntry.main;

        var key = deduper.mainKey(dir, main);

        if (!deduper.hasMain(key)) {
            var dirClientPath = getClientPath(metaEntry.dir);
            var relativePath = normalizeMain(metaEntry.dir, metaEntry.main);

            deduper.addDependency(key, {
                type: 'commonjs-main',
                dir: dirClientPath,
                main: relativePath,
                _sourceFile: metaEntry.main
            });
        }
    }

    function handleMetaBuiltin(metaEntry, deduper) {
        var name = metaEntry.name;
        var target = metaEntry.target;

        var key = deduper.builtinKey(name, target);

        if (!deduper.hasBuiltin(key)) {
            var targetClientPath = getClientPath(metaEntry.target);

            deduper.addDependency(key, {
                type: 'commonjs-builtin',
                name: name,
                target: targetClientPath,
                _sourceFile: metaEntry.target
            });
        }
    }

    function handleMeta(meta, deduper) {
        for (var i = 0; i < meta.length; i++) {
            var metaEntry = meta[i];
            switch (metaEntry.type) {
                case 'remap':
                    handleMetaRemap(metaEntry, deduper);
                    break;
                case 'installed':
                    handleMetaInstalled(metaEntry, deduper);
                    break;
                case 'main':
                    handleMetaMain(metaEntry, deduper);
                    break;
                case 'builtin':
                    handleMetaBuiltin(metaEntry, deduper);
                    break;
                default:
                    throw new Error('Unsupported meta entry: ' + JSON.stringify(metaEntry));
            }
        }
    }
    return {
        properties: {
            path: 'string',
            from: 'string',
            run: 'boolean',
            wait: 'boolean',
            resolved: 'object',
            virtualModule: 'object',
            requireHandler: 'object'
        },

        init(lassoContext) {
            var _this = this;

            return _asyncToGenerator(function* () {
                if (!_this.path && !_this.virtualModule) {
                    let error = new Error('Invalid "require" dependency. "path" property is required');
                    console.error(module.id, error.stack, _this);
                    throw error;
                }

                if (!_this.resolved) {
                    var virtualModule = _this.virtualModule;

                    if (virtualModule) {
                        let path = virtualModule.path || _this.path;
                        ok(path, '"path" is required for a virtual module');

                        _this.path = path;
                        if (!_this.from) {
                            _this.from = nodePath.dirname(path);
                        }

                        var clientPath = virtualModule.clientPath || getClientPath(path);

                        _this.resolved = {
                            path,
                            clientPath
                        };
                    } else if (_this.path) {
                        let from = _this.from = _this.from || _this.getParentManifestDir();
                        let path = _this.path;
                        let fromFile = _this.getParentManifestPath();
                        let fromFileRelPath = fromFile ? nodePath.relative(process.cwd(), fromFile) : '(unknown)';
                        _this.resolved = lassoContext.resolveCached(path, from);

                        if (!_this.resolved) {
                            throw new Error('Module not found: ' + path + ' (from "' + from + '" and referenced in "' + fromFileRelPath + '")');
                        }

                        _this.meta = _this.resolved.meta;
                    }
                }

                if (_this.run === true) {
                    if (_this.wait == null && config.runImmediately === true) {
                        _this.wait = false;
                    }

                    _this.wait = _this.wait !== false;
                }

                ok(_this.path);
            })();
        },

        toString: function () {
            return '[require: ' + this.path + ']';
        },

        calculateKey() {
            // This is a unique key that prevents the same dependency from being
            // added to the dependency graph repeatedly
            var key = 'modules-require:' + this.path + '@' + this.from;
            if (this.run) {
                key += '|run';

                if (this.wait === false) {
                    key += '|wait';
                }
            }
            return key;
        },

        getDir: function () {
            return nodePath.dirname(this.resolved.path);
        },

        getRequireHandler: function (lassoContext) {
            var resolved = this.resolved;
            var requireHandler = this.requireHandler;

            if (!requireHandler) {
                var virtualModule = this.virtualModule;
                if (virtualModule) {
                    var virtualPath = resolved.path || virtualModule.path || '';
                    requireHandler = lassoContext.dependencyRegistry.createRequireHandler(virtualPath, lassoContext, virtualModule);
                    requireHandler.includePathArg = false;
                }
            }

            if (!requireHandler) {
                requireHandler = lassoContext.dependencyRegistry.getRequireHandler(resolved.path, lassoContext);

                if (!requireHandler) {
                    return null;
                }
            }

            var transforms = config.transforms;
            if (transforms) {
                let defaultCreateReadStream = requireHandler.createReadStream.bind(requireHandler);
                let transformedRequireHandler = Object.create(requireHandler);

                transformedRequireHandler.createReadStream = function createdTransformedReadStream() {
                    var inStream = defaultCreateReadStream();
                    return transforms.apply(resolved.path, inStream, lassoContext);
                };
                return transformedRequireHandler;
            } else {
                return requireHandler;
            }
        },

        getDependencies(lassoContext) {
            var _this2 = this;

            return _asyncToGenerator(function* () {
                ok(lassoContext, '"lassoContext" argument expected');

                var requireHandler;

                // the array of dependencies that we will be returning
                var dependencies = [];
                var deduper = new Deduper(lassoContext, dependencies);

                // Include client module system if needed and we haven't included it yet
                if (config.includeClient !== false) {
                    deduper.addRuntime(runtimeDependency);
                }

                if (_this2.meta) {
                    handleMeta(_this2.meta, deduper);
                }

                if (!lassoContext.isAsyncBundlingPhase()) {
                    // Add a dependency that will trigger all of the deferred
                    // run modules to run once all of the code has been loaded
                    // for the page
                    deduper.addReady(readyDependency);
                }

                var resolved = _this2.resolved;

                if (resolved.voidRemap) {
                    // This module has been remapped to a void/empty object
                    // because it is a server-side only module. Nothing
                    // else to do.
                    return dependencies;
                }

                var run = _this2.run === true;
                var wait = _this2.wait !== false;

                if (resolved.type) {
                    // This is not really a require dependency since a type was provided
                    dependencies.push({
                        type: resolved.type,
                        path: resolved.path
                    });
                    return dependencies;
                }

                requireHandler = _this2.getRequireHandler(lassoContext);

                if (!requireHandler) {
                    // This is not really a dependency that compiles down to a CommonJS module
                    // so just add it to the dependency graph
                    dependencies.push(resolved.path);
                    return dependencies;
                }

                var dirname = nodePath.dirname(resolved.path);

                return requireHandler.init().then(function () {
                    if (requireHandler.getDependencies) {
                        // A require extension can provide its own `getDependencies` method to provide
                        // additional dependencies beyond what will automatically be discovered using
                        // static code analysis on the CommonJS code associated with the dependency.
                        return requireHandler.getDependencies().then(function (additionalDependencies) {
                            if (additionalDependencies && additionalDependencies.length) {
                                additionalDependencies.forEach(function (dep) {
                                    dependencies.push(dep);
                                });
                            }
                        });
                    }
                }).then(function () {
                    // Fixes https://github.com/lasso-js/lasso-require/issues/21
                    // Static JavaScript objects should not need to be inspected
                    if (requireHandler.object) {
                        // Don't actually inspect the required module if it is an object.
                        // For example, this would be the case with require('./foo.json')
                        return requireHandler.getLastModified().then(function (lastModified) {
                            return {
                                createReadStream: requireHandler.createReadStream.bind(requireHandler),
                                lastModified: lastModified
                            };
                        });
                    }

                    return inspectCache.inspectCached(resolved.path, requireHandler, lassoContext, config);
                }).then(function (inspectResult) {
                    var asyncMeta;
                    var asyncBlocks;

                    if (inspectResult && inspectResult.asyncBlocks && inspectResult.asyncBlocks.length) {
                        var asyncInfo = buildAsyncInfo(resolved.path, inspectResult.asyncBlocks, lassoContext);
                        if (asyncInfo) {
                            asyncBlocks = asyncInfo.asyncBlocks;
                            asyncMeta = asyncInfo.asyncMeta;
                        }
                    }

                    // require was for a source file
                    var additionalVars;
                    ok(inspectResult, 'inspectResult should not be null');

                    // the requires that were read from inspection (may remain undefined if no inspection result)
                    var requires = inspectResult.requires;

                    if (inspectResult.foundGlobals && (inspectResult.foundGlobals.process || inspectResult.foundGlobals.Buffer)) {
                        additionalVars = [];
                        var addGlobalVar = function (path, varCode) {
                            let resolved = lassoContext.resolve(path, dirname);
                            if (resolved.meta) {
                                handleMeta(resolved.meta, deduper);
                            }

                            var requireKey = deduper.requireKey(path, dirname);

                            if (!deduper.hasRequire(requireKey)) {
                                deduper.addDependency(requireKey, {
                                    type: 'require',
                                    path: path,
                                    from: dirname
                                });
                            }

                            additionalVars.push(varCode);
                        };

                        if (inspectResult.foundGlobals.process) {
                            addGlobalVar('process', VAR_REQUIRE_PROCESS);
                        }

                        if (inspectResult.foundGlobals.Buffer) {
                            addGlobalVar('buffer', VAR_REQUIRE_BUFFER);
                        }
                    }

                    ok(inspectResult.createReadStream, 'createReadStream expected after inspectResult');
                    ok(inspectResult.lastModified, 'lastModified expected after inspectResult');
                    equal(typeof inspectResult.lastModified, 'number', 'lastModified should be a number');

                    var globalVars = globals ? globals[_this2.resolved.path] : null;

                    // Also check if the directory has an browser.json and if so we should include that as well
                    var lassoJsonPath = nodePath.join(dirname, 'browser.json');
                    if (lassoContext.cachingFs.existsSync(lassoJsonPath)) {
                        dependencies.push({
                            type: 'package',
                            path: lassoJsonPath
                        });
                    } else {
                        lassoJsonPath = nodePath.join(dirname, 'optimizer.json');
                        if (lassoContext.cachingFs.existsSync(lassoJsonPath)) {
                            // TODO Show a deprecation warning here
                            dependencies.push({
                                type: 'package',
                                path: lassoJsonPath
                            });
                        }
                    }

                    // Include all additional dependencies (these were the ones found in the source code)
                    if (requires && requires.length) {
                        requires.forEach(function (inspectResultRequire) {
                            var inspectResultResolved = inspectResultRequire.resolved;

                            var meta = inspectResultResolved.meta;
                            if (meta) {
                                handleMeta(meta, deduper);
                            }

                            var path = inspectResultRequire.path;

                            var requireKey = deduper.requireKey(path, dirname);

                            if (!deduper.hasRequire(requireKey)) {
                                deduper.addDependency(requireKey, {
                                    type: 'require',
                                    path: inspectResultRequire.path,
                                    from: dirname,
                                    resolved: inspectResultResolved
                                });
                            }
                        });
                    }

                    var defKey = deduper.defKey(resolved.clientPath);

                    if (!deduper.hasDef(defKey)) {
                        var defDependency = {
                            type: 'commonjs-def',
                            path: resolved.clientPath,
                            file: resolved.path
                        };

                        if (requireHandler.getDefaultBundleName) {
                            // A `virtualModule` object provided a
                            // `getDefaultBundleName` that we will use to
                            // create the define dependency.
                            defDependency.getDefaultBundleName = requireHandler.getDefaultBundleName.bind(requireHandler);
                        }

                        if (additionalVars) {
                            defDependency._additionalVars = additionalVars;
                        }

                        if (requireHandler.object) {
                            // If true, then the module will not be wrapped inside a factory function
                            defDependency.object = true;
                        }

                        if (globalVars) {
                            defDependency.globals = globalVars;
                        }

                        // Pass along the createReadStream and the lastModified to the def dependency
                        defDependency.requireCreateReadStream = inspectResult.createReadStream;
                        defDependency.inspected = inspectResult;
                        defDependency.asyncBlocks = asyncBlocks;
                        defDependency.requireLastModified = inspectResult.lastModified;

                        deduper.addDependency(defKey, defDependency);
                    }

                    // Do we also need to add dependency to run the dependency?
                    if (run === true) {
                        var runKey = deduper.runKey(resolved.clientPath, wait);

                        if (!deduper.hasRun(runKey)) {
                            var runDependency = {
                                type: 'commonjs-run',
                                path: resolved.clientPath,
                                wait: wait,
                                file: resolved.path
                            };

                            if (requireHandler.getDefaultBundleName) {
                                // A `virtualModule` object provided a
                                // `getDefaultBundleName` that we will use to
                                // create the run dependency.
                                runDependency.getDefaultBundleName = requireHandler.getDefaultBundleName.bind(requireHandler);
                            }

                            if (wait === false) {
                                runDependency.wait = false;
                            }

                            deduper.addDependency(runKey, runDependency);
                        }
                    }

                    if (asyncMeta) {
                        return {
                            dependencies: dependencies,
                            async: asyncMeta,
                            dirname: nodePath.dirname(resolved.path),
                            filename: resolved.path
                        };
                    } else {
                        return dependencies;
                    }
                });
            })();
        }
    };
}

exports.create = create;