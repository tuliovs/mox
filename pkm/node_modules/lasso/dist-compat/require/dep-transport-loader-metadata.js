function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var transport = require('lasso-modules-client/transport');

exports.create = function (config, lasso) {
    return {
        properties: {},

        init(lassoContext) {
            return _asyncToGenerator(function* () {})();
        },

        read: function (lassoContext) {
            var loaderMetadata = lassoContext && lassoContext.loaderMetadata;
            if (!loaderMetadata) {
                return null;
            }

            return transport.codeGenerators.loaderMetadata(loaderMetadata, lassoContext, {
                modulesRuntimeGlobal: config.modulesRuntimeGlobal
            });
        },

        getUnbundledTargetPrefix: function (lassoContext) {
            return config.unbundledTargetPrefix;
        },

        getUnbundledTarget: function () {
            return 'lasso-modules-meta';
        },

        calculateKey() {
            return 'loader-metadata';
        },

        isPageBundleOnlyDependency: function () {
            return true;
        },

        getLastModified(lassoContext) {
            return _asyncToGenerator(function* () {
                return -1;
            })();
        }
    };
};