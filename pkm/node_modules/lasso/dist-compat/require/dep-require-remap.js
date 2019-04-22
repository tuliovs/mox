function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var nodePath = require('path');

function create(config, lasso) {
    return {
        properties: {
            from: 'string',
            to: 'string',
            fromDirname: 'string'
        },

        init(lassoContext) {
            var _this = this;

            return _asyncToGenerator(function* () {
                var fromPath = _this.resolvePath(_this.from);
                var toPath = _this.resolvePath(_this.to);

                _this.from = fromPath;
                _this.to = toPath;
            })();
        },

        calculateKey() {
            return this.from + '|' + this.to;
        },

        getDir: function () {
            return nodePath.dirname(this.to);
        },

        getDependencies(lassoContext) {
            var _this2 = this;

            return _asyncToGenerator(function* () {
                return [{
                    type: 'commonjs-remap',
                    from: _this2.from,
                    to: _this2.to
                }];
            })();
        }
    };
}

exports.create = create;