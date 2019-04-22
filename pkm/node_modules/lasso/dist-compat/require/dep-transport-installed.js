function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var transport = require('lasso-modules-client/transport');

exports.create = function (config, lasso) {
    return {
        properties: {
            'parentPath': 'string',
            'childName': 'string',
            'childVersion': 'string',
            'parentDir': 'string'
        },

        init(lassoContext) {
            return _asyncToGenerator(function* () {})();
        },

        getDir: function () {
            return this.parentDir;
        },

        read: function (context) {
            return transport.codeGenerators.installed(this.parentPath, this.childName, this.childVersion, {
                modulesRuntimeGlobal: config.modulesRuntimeGlobal
            });
        },

        getLastModified(lassoContext) {
            return _asyncToGenerator(function* () {
                return -1;
            })();
        },

        getUnbundledTargetPrefix: function (lassoContext) {
            return config.unbundledTargetPrefix;
        },

        getUnbundledTarget: function () {
            return 'lasso-modules-meta';
        },

        getSourceFile: function () {
            return this._sourceFile;
        },

        calculateKey() {
            return 'modules-installed:' + this.parentPath + '|' + this.childName + '|' + this.childVersion;
        }
    };
};