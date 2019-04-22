# by-key

```js
var byKey = require('by-key');
var people = [
    { name:'Peter', age:23 },
    { name:'Taylor', age:18 },
    { name:'Emma', age:29 }
];


people.sort(byKey('age'));
```

