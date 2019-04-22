var Model = require('fashion-model/Model');
var expect = require('chai').expect;
var DefaultsMixin = require('../');

describe('apply defaults tests', function() {
  it('should allow apply default properties', function() {
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

    expect(bob.clean()).to.deep.equal({
      name: 'Bob',
      age: 30
    });
  });

  it('should allow default function', function() {
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

    expect(bob.clean()).to.deep.equal({
      name: 'Bob',
      age: 30
    });
  });

  it('should have same context in default function as model', function() {
    const age = 30;

    var Person = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        name: {
          type: String,
          default: function() {
            expect(this.getAge()).to.equal(age);
            return 'Bob';
          }
        },
        age: Number
      }
    });

    var bob = new Person({
      age
    });

    bob.applyDefaults();

    expect(bob.clean()).to.deep.equal({
      name: 'Bob',
      age: 30
    });
  });

  it('should allow setting default to undefined', function () {
    var Person = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        name: {
          type: String,
          default: undefined
        }
      }
    });

    var bob = new Person();

    bob.applyDefaults();

    expect(bob.clean()).to.deep.equal({});
  });

  it('should allow setting default value to null', function () {
    var Person = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        name: {
          type: String,
          default: null
        }
      }
    });

    var bob = new Person();

    bob.applyDefaults();

    expect(bob.clean()).to.deep.equal({
      name: null
    });
  });

  it.skip('should apply defaults to models that have sub model properties', function () {
    var Person = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        name: {
          type: String,
          default: 'Bob'
        }
      }
    });

    var Car = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        owner: Person
      }
    });

    var car = new Car();

    car.applyDefaults();

    expect(car.clean()).to.deep.equal({
      owner: {
        name: 'Bob'
      }
    });
  });

  it('should not call a sub model that has its own default and no value', function () {
    var Person = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        name: {
          type: String,
          default: 'Bob'
        }
      }
    });

    var Car = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        owner: {
          type: Person,
          default: {
            name: 'Bob'
          }
        }
      }
    });

    var car = new Car();

    car.applyDefaults();

    expect(car.clean()).to.deep.equal({
      owner: {
        name: 'Bob'
      }
    });
  });

  it('should reset value of set object from empty object to undefined if no defaults found in sub model', function () {
    var Person = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        name: String
      }
    });

    var Car = Model.extend({
      mixins: [DefaultsMixin],
      properties: {
        owner: {
          type: Person
        }
      }
    });

    var car = new Car();

    car.applyDefaults();

    expect(car.clean()).to.deep.equal({});
  });
});
