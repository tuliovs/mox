function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dependenciesModule = require('./dependencies');
var ok = require('assert').ok;

function DependencyList(dependencies, dependencyRegistry, dirname, filename) {
    ok(dirname && typeof dirname === 'string', '"dirname" argument should be a string');
    ok(!filename || typeof filename === 'string', '"filename" argument should be a string');
    ok(dependencyRegistry && dependenciesModule.isRegistry(dependencyRegistry), 'dependencyRegistry argument is not valid');

    if (dependencies) {
        if (dependencies.__DependencyList) {
            dependencies = dependencies._dependencies;
        } else if (!Array.isArray(dependencies)) {
            throw new Error('Invalid dependencies: ' + dependencies);
        }
    }

    this._dependencyRegistry = dependencyRegistry;
    this._dependencies = dependencies || [];
    this._normalized = null;

    this._dirname = dirname;
    this._filename = filename;
}

DependencyList.prototype = {
    __DependencyList: true,

    addDependency: function (config) {
        if (this._converted) {
            config = this.dependencyRegistry.createDependency(config, this._dirname, this._filename);
        }

        this._dependencies.push(config);
    },

    normalize() {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (!_this._normalized) {
                _this._normalized = yield _this._dependencyRegistry.normalizeDependencies(_this._dependencies, _this._dirname, _this._filename);
            }
            return _this._normalized;
        })();
    },

    toString: function () {
        return '[DependencyList: ' + this._dependencies.join(',') + ']';
    },

    inspect() {
        return this._dependencies;
    }
};

DependencyList.prototype.push = DependencyList.prototype.addDependency;

DependencyList.isDependencyList = function (o) {
    return o && o.__DependencyList;
};

module.exports = DependencyList;