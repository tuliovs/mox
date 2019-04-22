function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const promisify = require('pify');

var nodePath = require('path');

var urlReader = require('../util/url-reader');
var urlRegExp = /^(http:|https:)?\/\//;

var fs = require('fs');

const readFileAsync = promisify(fs.readFile);

function maskDefine(code) {
    return '(function(define) { /* mask define */ ' + code + '\n}()); // END: mask define wrapper';
}

module.exports = {
    properties: {
        'path': 'string',
        'dir': 'string',
        'virtualPath': 'string',
        'url': 'string',
        'code': 'string',
        'external': 'boolean',
        'mask-define': 'boolean'
    },

    init(lassoContext) {
        var _this = this;

        return _asyncToGenerator(function* () {
            var path = _this.path;

            if (!_this.path && !_this.url && !_this.code && !_this.virtualPath) {
                throw new Error('"path", "virtualPath", "url" or "code" is required for a resource dependency');
            }

            if (urlRegExp.test(path)) {
                _this.url = path;
                path = null;
                delete _this.path;
            }

            if (path) {
                _this.path = _this.resolvePath(path);
                _this._dir = nodePath.dirname(_this.path);
            }
        })();
    },

    cacheConfig: {
        cacheable: true,
        static: true
    },

    getDir: function () {
        return this._dir || this.dir;
    },

    read(context) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            if (_this2.code) {
                return _this2.code;
            }

            // if mask-define, use callback to wrap the resource
            if (_this2['mask-define'] === true) {
                const code = yield readFileAsync(_this2.path, { encoding: 'utf8' });
                return maskDefine(code);
                // otherwise return a stream
            } else {
                if (_this2.url) {
                    return urlReader.createUrlReadStream(_this2.url);
                } else {
                    return fs.createReadStream(_this2.path, { encoding: 'utf8' });
                }
            }
        })();
    },

    isExternalResource: function () {
        return this.url != null && this.external !== false;
    },

    getUrl: function () {
        if (this.external !== false) {
            return this.url;
        }
    },

    getSourceFile: function () {
        return this.path || this.virtualPath;
    },

    getLastModified(lassoContext) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            if (!_this3.path) {
                return -1;
            }

            return _this3.getFileLastModified(_this3.path);
        })();
    }
};