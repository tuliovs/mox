function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var cachingFs = require('./caching-fs');

// TODO: Change in lasso-caching-fs
exports.forFile = (() => {
    var _ref = _asyncToGenerator(function* (filePath) {
        return new Promise(function (resolve, reject) {
            cachingFs.lastModified(filePath, function (err, data) {
                return err ? reject(err) : resolve(data);
            });
        });
    });

    return function (_x) {
        return _ref.apply(this, arguments);
    };
})();