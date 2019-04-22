function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ok = require('assert').ok;
var manifestLoader = require('../manifest-loader');
var nodePath = require('path');

module.exports = {
    properties: {
        path: 'string',
        from: 'string'
    },

    init(lassoContext) {
        var _this = this;

        return _asyncToGenerator(function* () {
            _this._alias = _this.path; // Store a reference to the unresolved path

            var from = _this.from || _this.getParentManifestDir();
            delete _this.from;

            try {
                _this._packageManifest = _this.createPackageManifest(manifestLoader.load(_this.path, from));
            } catch (e) {
                if (e.fileNotFound) {
                    var inFile = _this.getParentManifestPath();
                    throw new Error('Lasso manifest not found for path "' + _this.path + '" referenced in "' + (inFile || _this.getParentManifestDir()) + '"');
                } else {
                    throw new Error('Unable to load lasso manifest for path "' + _this.path + '". Dependency: ' + _this.toString() + '. Exception: ' + (e.stack || e));
                }
            }

            _this.path = _this._packageManifest.filename; // Store the resolved path and use that as the key
            ok(_this.path, 'this.path should not be null');

            _this._dir = nodePath.dirname(_this.path);
        })();
    },

    getDir: function () {
        return this._dir;
    },

    loadPackageManifest(lassoContext) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            return _this2._packageManifest;
        })();
    },

    calculateKey() {
        return 'package|' + this.path;
    }
};