let initWriter = (() => {
    var _ref = _asyncToGenerator(function* (writer, lassoContext) {
        if (!writer._initialized && writer.impl.init) {
            yield writer.impl.init(lassoContext);
            writer._initialized = true;
        }
    });

    return function initWriter(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('raptor-polyfill/string/startsWith');

var nodePath = require('path');
var fileSep = nodePath.sep;
var logger = require('raptor-logging').logger(module);
var EventEmitter = require('events').EventEmitter;
var extend = require('raptor-util').extend;
var createError = require('raptor-util/createError');
var reader = require('../reader');
var ok = require('assert').ok;
var equal = require('assert').equal;

function Writer(impl) {
    Writer.$super.call(this);
    this.impl = impl || {};

    // Lasso writer `init` function should only be called once. We call it the
    // first time that either writing a resource or bundle is attempted.
    this._initialized = false;
}

Writer.prototype = {
    __LassoWriter: true,

    setLasso: function (lasso) {
        this.lasso = lasso;
    },

    getLasso: function () {
        return this.lasso;
    },

    getInPlaceUrlForFile: function (path, lassoContext) {
        ok(lassoContext, 'lassoContext is required');

        if (typeof path !== 'string') {
            throw new Error('Path for in-place file should be a string. Actual: ' + path);
        }

        var config = lassoContext.config;

        if (typeof config.getInPlaceUrlPrefix() === 'string') {
            var projectRoot = config.getProjectRoot();
            if (projectRoot && path.startsWith(projectRoot + fileSep)) {
                var suffix = path.substring(projectRoot.length);
                return config.getInPlaceUrlPrefix() + suffix;
            }
        }

        return null;
    },

    getInPlaceUrlForBundle: function (bundle, lassoContext) {
        ok(lassoContext, 'lassoContext is required');

        var dependency = bundle.dependency;
        if (!dependency) {
            throw new Error('"dependency" expected for in-place bundle');
        }

        if (!dependency.getSourceFile) {
            throw new Error('"getSourceFile" expected for in-place dependency');
        }

        if (!bundle.inPlaceDeployment) {
            throw new Error('inPlaceDeployment should be true');
        }

        var sourceFile = dependency.getSourceFile();
        return this.getInPlaceUrlForFile(sourceFile, lassoContext);
    },

    writeBundle(bundle, onBundleWrittenCallback, lassoContext) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (!bundle.hasContent()) return;

            ok(lassoContext, 'lassoContext is required');

            let done = function (err) {
                if (err) {
                    throw createError('Error while writing bundle "' + bundle + '" Error: ' + err, err);
                }

                bundle.setWritten(true);

                if (onBundleWrittenCallback) {
                    onBundleWrittenCallback(bundle);
                }

                const data = { bundle };

                _this.emit('bundleWritten', data);
                lassoContext.emit('bundleWritten', data);

                logger.info('Bundle ' + bundle + ' written.');

                return bundle;
            };

            if (bundle.isWritten() || bundle.url) {
                if (logger.isInfoEnabled()) {
                    logger.info('Bundle (' + bundle.getKey() + ') already written. Skipping writing...');
                }

                return done();
            } else if (bundle.inPlaceDeployment === true && !bundle.isInline()) {
                var inPlaceUrl = _this.getInPlaceUrlForBundle(bundle, lassoContext);
                if (inPlaceUrl) {
                    if (logger.isInfoEnabled()) {
                        logger.info('In-place deployment enabled for (' + bundle.getKey() + '). Skipping writing...');
                    }
                    bundle.setUrl(inPlaceUrl);
                    return done();
                }
            }

            lassoContext = Object.create(lassoContext);
            lassoContext.bundle = bundle;
            lassoContext.dependencies = bundle.dependencies;

            var bundleReader = reader.createBundleReader(bundle, lassoContext);

            logger.info('Writing bundle ' + bundle + '...');

            let checkBundleUpToDate = (() => {
                var _ref2 = _asyncToGenerator(function* () {
                    if (bundle.isInline()) return;
                    // We make the assumption that the bundle was populated with its URL
                    // and marked as written if it was indeed up-to-date
                    return _this.checkBundleUpToDate(bundle, lassoContext);
                });

                return function checkBundleUpToDate() {
                    return _ref2.apply(this, arguments);
                };
            })();

            let writeBundle = (() => {
                var _ref3 = _asyncToGenerator(function* () {
                    // If the bundle is written then there is nothing to do
                    if (bundle.isWritten()) return;

                    var completed = false;

                    function handleError(e) {
                        if (!completed) {
                            completed = true;
                            throw e;
                        }
                    }

                    if (bundle.isInline()) {
                        try {
                            const code = yield bundleReader.readBundleFully();
                            logger.info('Code for inline bundle ' + bundle.getLabel() + ' generated.');
                            bundle.setCode(code);
                        } catch (err) {
                            return handleError(err);
                        }
                    } else {
                        try {
                            yield _this.impl.writeBundle(bundleReader, lassoContext);
                            logger.info('Bundle written:', bundle.getLabel());
                        } catch (err) {
                            return handleError(err);
                        }
                    }
                });

                return function writeBundle() {
                    return _ref3.apply(this, arguments);
                };
            })();

            yield checkBundleUpToDate();
            yield writeBundle();

            return done();
        })();
    },

    writeResource(path, lassoContext) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            ok(lassoContext, 'lassoContext is required');

            const done = function (writeResult) {
                ok(writeResult, 'writeResult expected');
                ok(writeResult.url, 'writeResult.url expected');

                var result = extend(writeResult || {}, {
                    sourceFile: path
                });

                _this2.emit('resourceWritten', result);
                lassoContext.emit('resourceWritten', result);

                return result;
            };

            const config = _this2.config;

            if (config.isInPlaceDeploymentEnabled()) {
                var url = _this2.getInPlaceUrlForFile(path, lassoContext);
                if (url) {
                    return done({ url });
                }
            }

            lassoContext = Object.create(lassoContext);
            lassoContext.path = path;

            const resourceReader = reader.createResourceReader(path, lassoContext);

            try {
                yield initWriter(_this2, lassoContext);
                const writeResult = yield _this2.impl.writeResource(resourceReader, lassoContext);
                return done(writeResult);
            } catch (err) {
                throw createError('Error while writing resource "' + path + '": ' + (err.stack || err), err);
            }

            // this.checkResourceUpToDate(path, lassoContext, function(err, resourceInfo) {
            //     if (err) {
            //         return callback(err);
            //     }
            //
            //     if (resourceInfo) {
            //         return callback(null, resourceInfo);
            //     }
            //
            //
            // });
        })();
    },

    writeResourceBuffer(buff, path, lassoContext) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            ok(lassoContext, 'lassoContext is required');

            const done = function (writeResult) {
                ok(writeResult, 'writeResult expected');
                ok(writeResult.url, 'writeResult.url expected');

                writeResult = writeResult || {};

                _this3.emit('resourceWritten', writeResult);
                lassoContext.emit('resourceWritten', writeResult);

                return writeResult;
            };

            lassoContext = Object.create(lassoContext);
            lassoContext.path = path;

            try {
                yield initWriter(_this3, lassoContext);
                const writeResult = yield _this3.impl.writeResourceBuffer(buff, lassoContext);
                return done(writeResult);
            } catch (err) {
                throw createError('Error while writing resource buffer: ', err);
            }
        })();
    },

    checkBundleUpToDate(bundle, lassoContext) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            ok(lassoContext, 'lassoContext is required');

            if (_this4.impl.checkBundleUpToDate) {
                let resourceInfo = yield _this4.impl.checkBundleUpToDate(bundle, lassoContext);
                return resourceInfo === false ? null : resourceInfo;
            }
        })();
    },

    checkResourceUpToDate: function (path, lassoContext, callback) {
        ok(lassoContext, 'lassoContext is required');
        equal(typeof callback, 'function', 'callback function is required');

        if (this.impl.checkResourceUpToDate) {
            this.impl.checkResourceUpToDate(path, lassoContext, function (err, resourceInfo) {
                if (err) {
                    return callback(err);
                }

                if (resourceInfo === false) {
                    resourceInfo = null;
                }

                return callback(null, resourceInfo);
            });
        } else {
            return callback();
        }
    },

    writeBundles(iteratorFunc, onBundleWrittenCallback, lassoContext) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            ok(lassoContext, 'lassoContext is required');

            yield initWriter(_this5, lassoContext);
            let promise = Promise.resolve();

            iteratorFunc(function (bundle) {
                if (bundle.hasContent()) {
                    promise = promise.then(function () {
                        return _this5.writeBundle(bundle, onBundleWrittenCallback, lassoContext);
                    });
                }
            });

            return promise;
        })();
    },

    buildResourceCacheKey(cacheKey, lassoContext) {
        if (this.impl.buildResourceCacheKey) {
            return this.impl.buildResourceCacheKey(cacheKey, lassoContext);
        } else {
            return cacheKey;
        }
    }
};

require('raptor-util').inherit(Writer, EventEmitter);

module.exports = Writer;