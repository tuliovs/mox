"use strict";

function byKey(key, compare) {
    if(compare == null) compare = asc;

    if(typeof compare === 'string') {
        if(compare === 'asc') compare = asc;
        else if(compare === 'desc') compare = desc;
        else throw new Error('The 2nd parameter to by-key should be "asc", "desc" or a comparison function')
    }

    if(typeof compare !== 'function') {
        throw new Error('The 2nd parameter to by-key should be "asc", "desc" or a comparison function')
    }

    let keys = key.split('.')

    return function(a, b) {
        keys.forEach(function(key) {
            if(a != null) a = a[key]
            if(b != null) b = b[key]
        })
        return compare(a, b)
    }
}

function asc(a, b) {
    if(a < b) return -1;
    if(b < a) return 1;
    return 0;
}
function desc(a, b) {
    if(a < b) return 1;
    if(b < a) return -1;
    return 0;
}

module.exports = byKey;