function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const promisify = require('pify');

var nodePath = require('path');
var fs = require('fs');

const readFileAsync = promisify(fs.readFile);

var lassoModulesClientMainPath = require.resolve('lasso-modules-client');
var FS_READ_OPTIONS = { encoding: 'utf8' };
var modGlobalVarRegex = /\$_mod/g;

exports.create = function (config, lasso) {
    var modulesRuntimeGlobal = config.modulesRuntimeGlobal;

    return {
        getDir: function () {
            return nodePath.dirname(lassoModulesClientMainPath);
        },

        read(lassoContext) {
            return _asyncToGenerator(function* () {
                let contents = yield readFileAsync(lassoModulesClientMainPath, FS_READ_OPTIONS);

                if (modulesRuntimeGlobal) {
                    contents = contents.replace(modGlobalVarRegex, modulesRuntimeGlobal);
                }

                return contents;
            })();
        },

        getUnbundledTargetPrefix: function (lassoContext) {
            return config.unbundledTargetPrefix;
        },

        getSourceFile: function () {
            return lassoModulesClientMainPath;
        },

        calculateKey() {
            return 'modules-runtime';
        }
    };
};