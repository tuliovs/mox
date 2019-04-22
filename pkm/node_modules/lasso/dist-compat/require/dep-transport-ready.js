function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var transport = require('lasso-modules-client/transport');

exports.create = function (config, lasso) {
    return {
        properties: {},

        init() {
            var _this = this;

            return _asyncToGenerator(function* () {
                if (!_this.slot) {
                    delete _this.slot;
                }
            })();
        },

        getDir: function () {
            return null;
        },

        read: function (context) {
            return transport.codeGenerators.ready({
                modulesRuntimeGlobal: config.modulesRuntimeGlobal
            });
        },

        calculateKey() {
            return 'modules-ready';
        },

        getLastModified(lassoContext) {
            return _asyncToGenerator(function* () {
                return -1;
            })();
        }
    };
};