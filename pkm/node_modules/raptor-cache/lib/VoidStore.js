'use strict';

function VoidStore (options) {
}

VoidStore.prototype = {
    free: function () {
    },

    get (key) {
        return Promise.resolve(null);
    },

    put: function (key, cacheEntry) {
    },

    remove: function (key) {
    },

    flush () {
        return Promise.resolve();
    }
};

module.exports = VoidStore;
