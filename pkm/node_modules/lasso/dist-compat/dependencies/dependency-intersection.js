function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dependencyWalker = require('../dependency-walker');
var DependencyList = require('../DependencyList');

var thresholdRegex = /^(\d+)([%]*)$/;

function onDependency(tracking, strictIntersection, firstSet, i) {
    return function (dependency, context) {
        if (dependency.isPackageDependency()) {
            return;
        }

        var key = dependency.getKey();

        var info = tracking[key];
        if (info === undefined) {
            tracking[key] = {
                dependency: dependency,
                count: 1
            };
        } else {
            info.count++;
        }

        if (i === 0 && strictIntersection) {
            // strict intersection so only need to keep track
            // dependencies from first set (which is a little
            // arbitrary but will work)
            firstSet.push(dependency);
        }
    };
}

module.exports = {
    properties: {
        dependencies: 'array',
        threshold: 'object'
    },

    init(lassoContext) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (!_this.dependencies) {
                throw new Error('"dependencies" property is required');
            }

            if (!Array.isArray(_this.dependencies)) {
                throw new Error('"dependencies" property is required');
            }

            _this.dependencies = new DependencyList(_this.dependencies, lassoContext.dependencyRegistry, _this.getParentManifestDir(), _this.getParentManifestPath());

            if (_this.threshold) {
                if (typeof _this.threshold === 'string') {
                    var match = thresholdRegex.exec(_this.threshold);
                    var units;

                    if (!match || (units = match[2]) && units !== '%') {
                        throw new Error('Invalid threshold: ' + _this.threshold);
                    }

                    _this.threshold = {
                        value: parseInt(match[1], 10),
                        units: units
                    };
                } else {
                    _this.threshold = {
                        value: _this.threshold
                    };
                }
            }
        })();
    },

    getDir: function () {
        return null;
    },

    getDependencies(lassoContext) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            var tracking = {};
            var flags = lassoContext.flags;
            var firstSet = [];

            let dependencies = yield _this2.dependencies.normalize();

            var numDependencies = dependencies.length;
            var thresholdValue;
            if (_this2.threshold) {
                thresholdValue = _this2.threshold.value;
                if (_this2.threshold.units === '%') {
                    // A dependency will become part of the intersection if it is in at X percent of the enumerated list of dependencies
                    thresholdValue = thresholdValue / 100 * numDependencies;
                } else {
                    // A dependency will become part of the intersection if it is in at least X of the enumerated list of dependencies
                    thresholdValue = _this2.threshold.value;
                }
            } else {
                // strict intersection -- only include the dependencies that are in the enumerated list of dependencies
                thresholdValue = numDependencies;
            }

            var strictIntersection = thresholdValue >= numDependencies;

            for (const [i, dependency] of dependencies.entries()) {
                // HACK: The built-in `dep-require` dependency type
                // uses its `Deduper` instance to ignore dependencies
                // within the same "phase" of a lasso operation.
                //
                // However, for the purposes of calculating intersection
                // we should not de-duplicate across each "walk" of
                // starting dependency.
                //
                // The `Deduper` stores a cache of "visited" dependencies in
                // `lassoContext.phaseData['dependency-require']`.
                //
                // We reset the `phaseData` property to remove this
                // cache before we walk each starting dependency.
                let oldPhaseData = lassoContext.phaseData;
                lassoContext.phaseData = {};

                yield dependencyWalker.walk({
                    lassoContext: lassoContext,
                    dependency: dependency,
                    flags: flags,
                    on: {
                        dependency: onDependency(tracking, strictIntersection, firstSet, i)
                    }
                });

                lassoContext.phaseData = oldPhaseData;
            }

            var intersection = [];

            function checkDependency(info) {
                if (info.count >= thresholdValue) {
                    intersection.push(info.dependency);
                }
            }

            if (strictIntersection) {
                // strict intersection
                for (var i = 0, len = firstSet.length; i < len; i++) {
                    var dependency = firstSet[i];
                    checkDependency(tracking[dependency.getKey()]);
                }
            } else {
                // not a strict intersection so we need to check counts for all dependencies
                for (var key in tracking) {
                    if (tracking.hasOwnProperty(key)) {
                        checkDependency(tracking[key]);
                    }
                }
            }

            return intersection;
        })();
    },

    calculateKey() {
        return null; // A just use a unique ID for this dependency
    }
};