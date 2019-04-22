fashion-model-defaults
======================

[fashion-model](https://github.com/fashion-js/fashion-model) mixin that attaches
an `applyDefaults` method to the model prototype.

Using `default` as a standard value:

```js
var DefaultsMixin = require('fashion-model-defaults');

var Person = Model.extend({
  mixins: [DefaultsMixin],
  properties: {
    name: {
      type: String,
      default: 'Bob'
    },
    age: Number
  }
});

var bob = new Person({
  age: 30
});

bob.applyDefaults();
bob.getName(); // Returns 'Bob'
```

Using `default` as a function:

```js
var DefaultsMixin = require('fashion-model-defaults');

var Person = Model.extend({
  mixins: [DefaultsMixin],
  properties: {
    name: {
      type: String,
      default: function() {
        return 'Bob';
      }
    },
    age: Number
  }
});

var bob = new Person({
  age: 30
});

bob.applyDefaults();
bob.getName(); // Returns 'Bob'
```