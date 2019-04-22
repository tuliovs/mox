let globNormalizer = (() => {
    var _ref = _asyncToGenerator(function* (dependency, context) {
        if (typeof dependency === 'string' && globRegExp.test(dependency)) {
            const typeSeparator = dependency.indexOf(':');
            const basedir = context.dirname;

            let pattern = dependency;
            let type = null;
            let matches = [];

            if (typeSeparator) {
                type = dependency.substring(0, typeSeparator).trim();
                pattern = dependency.substring(typeSeparator + 1);
            }

            pattern = pattern.trim();

            const patterns = pattern.split(/\s+/);

            for (const pattern of patterns) {
                const files = yield glob(pattern, { cwd: basedir });
                matches = matches.concat(files);
            }

            matches = matches.map(function (match) {
                match = nodePath.join(basedir, match);
                return type ? type + ':' + match : match;
            });

            return matches;
        }
    });

    return function globNormalizer(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const nodePath = require('path');
const promisify = require('pify');
const glob = promisify(require('glob'));

const globRegExp = /[*?+{}]/;

exports.normalizer = globNormalizer;