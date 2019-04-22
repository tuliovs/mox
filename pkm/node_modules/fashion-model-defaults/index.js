module.exports = {
  id: 'apply-defaults',

  initType: function(Type) {
    Type.prototype.applyDefaults = function() {
      var self = this;

      Type.forEachProperty(function(property) {
        var name = property.getName();
        var value = self.get(name);

        if (value === undefined) {
          var defaultValue = property.default;

          if ((defaultValue != null) && (defaultValue.constructor === Function)) {
            defaultValue = defaultValue.call(self);
          }
          self.set(name, defaultValue);
        }
      });
    };
  }
};
