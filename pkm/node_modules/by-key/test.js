var expect = require('chai').expect;
var byKey = require('.');

it('should sort objects in ascending order by default', () => {
    var objects = [
        { foo:4, a:1 },
        { foo:2, b:2 },
        { foo:8, c:3 },
        { foo:6, d:4 },
    ];

    expect(objects.sort(byKey('foo'))).to.eql([
        { foo:2, b:2 },
        { foo:4, a:1 },
        { foo:6, d:4 },
        { foo:8, c:3 },
    ]);
});

it('should sort objects in ascending order (explicit)', () => {
    var objects = [
        { foo:4, a:1 },
        { foo:2, b:2 },
        { foo:8, c:3 },
        { foo:6, d:4 },
    ];

    expect(objects.sort(byKey('foo', 'asc'))).to.eql([
        { foo:2, b:2 },
        { foo:4, a:1 },
        { foo:6, d:4 },
        { foo:8, c:3 },
    ]);
});

it('should sort objects in descending order', () => {
    var objects = [
        { foo:4, a:1 },
        { foo:2, b:2 },
        { foo:8, c:3 },
        { foo:6, d:4 },
    ];

    expect(objects.sort(byKey('foo', 'desc'))).to.eql([
        { foo:8, c:3 },
        { foo:6, d:4 },
        { foo:4, a:1 },
        { foo:2, b:2 },
    ]);
});

it('should sort objects in with a custom ordering function', () => {
    var objects = [
        { foo:4, a:1 },
        { foo:2, b:2 },
        { foo:8, c:3 },
        { foo:6, d:4 },
    ];

    expect(objects.sort(byKey('foo', (a, b) => b - a))).to.eql([
        { foo:8, c:3 },
        { foo:6, d:4 },
        { foo:4, a:1 },
        { foo:2, b:2 },
    ]);
});

it('should sort objects in by deeply nested keys', () => {
    var objects = [
        { foo:{ bar:5 } },
        { foo:{ bar:7 } },
        { foo:{ bar:6 } },
    ];

    expect(objects.sort(byKey('foo.bar'))).to.eql([
        { foo:{ bar:5 } },
        { foo:{ bar:6 } },
        { foo:{ bar:7 } },
    ]);
});