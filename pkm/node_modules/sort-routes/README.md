# sort-routes

```js
var bySpecificity = require('sort-routes');
var routes = [
    '/characters/:id',
    '/characters',
    '/characters/new',
];

routes.sort(bySpecificity);
```

```js
[
    '/characters',
    '/characters/new',
    '/characters/:id',
]
```