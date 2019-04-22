

/**
 * Helper method to walk all dependencies recursively
 *
 * @param options
 */
let walk = (() => {
    var _ref = _asyncToGenerator(function* (options) {
        let walkDependencies = (() => {
            var _ref2 = _asyncToGenerator(function* (dependencies, parentDependency, jsSlot, cssSlot, dependencyChain) {
                logger.debug('walkDependencies', dependencies);

                for (const dependency of dependencies) {
                    yield walkDependency(dependency, parentDependency, jsSlot, cssSlot, dependencyChain);
                }
            });

            return function walkDependencies(_x2, _x3, _x4, _x5, _x6) {
                return _ref2.apply(this, arguments);
            };
        })();

        let walkManifest = (() => {
            var _ref3 = _asyncToGenerator(function* (manifest, parentDependency, jsSlot, cssSlot, dependencyChain) {
                delete walkContext.dependency;
                walkContext.package = manifest;
                walkContext.dependencyChain = dependencyChain;
                emitter.emit('manifest', manifest, walkContext, parentDependency);

                logger.debug('walkManifest', manifest);

                const dependencies = yield manifest.getDependencies({
                    flags: flags,
                    lassoContext: options.lassoContext
                });

                logger.debug('walkManifest - dependencies', dependencies);
                yield walkDependencies(dependencies, parentDependency, jsSlot, cssSlot, dependencyChain);
            });

            return function walkManifest(_x7, _x8, _x9, _x10, _x11) {
                return _ref3.apply(this, arguments);
            };
        })();

        let walkDependency = (() => {
            var _ref4 = _asyncToGenerator(function* (dependency, parentDependency, jsSlot, cssSlot, dependencyChain) {
                dependencyChain = dependencyChain.concat(dependency);

                yield dependency.init(lassoContext);

                logger.debug('dependency init', dependency);

                if (dependency._condition && !dependency._condition(flags)) {
                    return;
                }

                const key = yield dependency.calculateKey(lassoContext);

                if (foundDependencies[key]) {
                    return;
                }

                foundDependencies[key] = true;

                var slot;

                if (!dependency.isPackageDependency()) {
                    slot = dependency.getSlot();
                    if (!slot) {
                        if (dependency.isJavaScript()) {
                            slot = jsSlot || 'body';
                        } else {
                            slot = cssSlot || 'head';
                        }
                    }
                }

                walkContext.slot = slot;
                delete walkContext.package;
                walkContext.dependency = dependency;
                walkContext.parentDependency = parentDependency;
                walkContext.dependencyChain = dependencyChain;

                if (shouldSkipDependencyFunc && shouldSkipDependencyFunc(dependency, walkContext)) {
                    return;
                }

                emitter.emit('dependency', dependency, walkContext);

                if (dependency.isPackageDependency()) {
                    try {
                        const dependencyManifest = yield dependency.getPackageManifest(lassoContext);

                        if (!dependencyManifest) {
                            return;
                        }

                        yield walkManifest(dependencyManifest, dependency, dependency.getJavaScriptSlot() || jsSlot, dependency.getStyleSheetSlot() || cssSlot, dependencyChain);
                    } catch (err) {
                        const message = 'Failed to walk dependency ' + dependency + '. Dependency chain: ' + dependencyChain.join(' → ') + '. Cause: ' + err;
                        throw createError(message, err);
                    }
                }
            });

            return function walkDependency(_x12, _x13, _x14, _x15, _x16) {
                return _ref4.apply(this, arguments);
            };
        })();

        var startTime = Date.now();
        var emitter = new EventEmitter();
        var lassoContext = options.lassoContext || {};
        var flags = lassoContext.flags;
        var shouldSkipDependencyFunc = options.shouldSkipDependency;

        var walkContext = {
            lassoContext: lassoContext
        };

        var on = options.on;
        if (!on) {
            throw new Error('"on" property is required');
        }

        forEachEntry(on, function (event, listener) {
            emitter.on(event, listener);
        });

        var foundDependencies = {};

        function done() {
            perfLogger.debug('Completed walk in ' + (Date.now() - startTime) + 'ms');
            emitter.emit('end');
        }

        var dependencyChain = [];

        if (options.lassoManifest) {
            yield walkManifest(options.lassoManifest, null, // parent package
            null, // jsSlot
            null, dependencyChain);
            done();
        } else if (options.dependency) {
            yield walkDependency(options.dependency, null, // parent package
            null, // jsSlot
            null, dependencyChain);
            done();
        } else if (options.dependencies) {
            const dependencies = yield options.dependencies.normalize();
            yield walkDependencies(dependencies, null, null, null, dependencyChain);
            done();
        } else {
            throw new Error('"lassoManifest", "dependency", "dependencies" is required');
        }
    });

    return function walk(_x) {
        return _ref.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var EventEmitter = require('events').EventEmitter;
var forEachEntry = require('raptor-util/forEachEntry');
var perfLogger = require('raptor-logging').logger('lasso/perf');
var logger = require('raptor-logging').logger(module);
var createError = require('raptor-util/createError');

exports.walk = walk;