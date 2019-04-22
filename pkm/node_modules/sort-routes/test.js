var expect = require('chai').expect;
var routesSort = require('.');
var routes = [
    /.+/,
    '/users/:id',
    '/characters/:foo',
    '/characters',
    '/characters/edit/:id/meta',
    '/characters/edit',
    '/test',
    '/characters/edit/:id',
    '/characters[(\\d+)]',
    '/characters/:id(\\d{2})',
    '/characters/:id(\\d+)',
    '/characters/(.*)',
    '/users',
    '/',
    '/:id',
    '/(.*)',
    '/([A-Z]+)',
    /[A-F]/,
    /[G-Z]/,
    '/(.*)/whatever',
    '/hello'
];

it('should correctly sort routes', () => {
    expect(routes.sort(routesSort)).to.eql([
        '/',
        '/characters',
        '/characters/edit',
        '/characters/edit/:id',
        '/characters/edit/:id/meta',
        '/characters/:id(\\d+)',
        '/characters/:id(\\d{2})',
        '/characters/:foo',
        '/characters/(.*)',
        '/hello',
        '/test',
        '/users',
        '/users/:id',
        '/characters[(\\d+)]',
        '/([A-Z]+)',
        '/:id',
        '/(.*)/whatever',
        '/(.*)',
        /[G-Z]/,
        /[A-F]/,
        /.+/
    ]);
});
