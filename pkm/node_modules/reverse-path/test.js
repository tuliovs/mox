var util = require('util');
var assert = require('assert');
var reversePath = require('./');

var TESTS = [
    // simple paths
    ['/test', {},'/test', {}],
    ['/test/bla', {},'/test/bla', {}],
    ['/test/bla/', {},'/test/bla', {}, false],
    ['/test/bla/', {},'/test/bla/', {}],

    // named parameters
    ['/:foo', {foo: 'bar'}, '/bar', {}],
    ['/:foo/:bar', {foo: 'bar', bar: 'foo'}, '/bar/foo', {}],
    ['/:foo/:bar', {foo: 'bar', bar: 'foo'}, '/bar', {}, false],

    // optional named parameters
    ['/:foo?', {}, '/'],
    ['/:foo?', {foo: 'bar'}, '/bar'],

    // custom named parameters.
    ['/:foo(\\d+)', {foo: 123}, '/123', {}],
    ['/:foo(\\d+)?', {}, '/', {}],
    ['/:foo(\\d+)?', {foo: 456}, '/456', {}],
    ['/:foo(.*)', {foo: 'abc/def/ghi'}, '/abc/def/ghi', {}],
    ['/:foo(.*)/:bar', {foo: 'abc/def/ghi', bar: 'jkl'}, '/abc/def/ghi/jkl', {}],
    ['/:foo(.*)/:bar?', {foo: 'abc/def/ghi'}, '/abc/def/ghi/', {}],
    ['/:foo(.*)/:bar?', {foo: 'abc/def/ghi', bar: 'jkl'}, '/abc/def/ghi/jkl', {}],

    // without prefix slash
    ['test', {}, 'test', {}],
    [':test', {test: 'foo'}, 'foo', {}],
    [':test', {test: 'foo'}, 'test', {}, false],

    // formats
    ['/test.json', {}, '/test.json', {}],
    ['/:test.json', {test: 'foo'}, '/foo.json', {}],
    ['/:test.:format', {test: 'foo', format: 'bar'}, '/foo.bar', {}],
    ['/:test.:format?', {test: 'foo', format: 'bar'}, '/foo.bar', {}],
    ['/:test.:format?', {test: 'foo'}, '/foo.bar', {}, false],
    ['/:test.:format?', {test: 'foo'}, '/foo.', {}],

    // unnamed
    ['/(\\d+)', {'0': 123}, '/123', {}],
    ['/(\\d+)?', {}, '/123', {}, false]

    // regexp
    /* not supportet right now
    [/^\/route\/([^\/]+)$/, {'0': 'foo'}, '/route/foo', {}],
    [/^\/([^\/]+)$/, {'0': 'foo'}, '/foo', {}],
    [/^\/([^\/]+)\/([^\/]+)$/, {'0': 'foo', '1': 'bar'}, '/foo/bar', {}],
    */
];

describe('reverse-path', function() {
    it('should throw an exception when required keys aren\'t provided', function() {
        assert.throws(function() {
            reversePath('/:foo/:bar', { foo: 'test' });
        }, Error);
    });

    TESTS.forEach(function(test) {
        var options = test[3] || {};

        var desc = 'should ' + (test[4] !== false ? '' : 'not ') + 'reverse "' + test[0] + '" ' + util.inspect(test[1]);
        desc += ' to "' + test[2] + '"';

        it(desc, function() {
            var url = reversePath(test[0], test[1]);
            test[4] !== false
                ? assert.equal(url, test[2])
                : assert.notEqual(url, test[2])
        });
    });
});
