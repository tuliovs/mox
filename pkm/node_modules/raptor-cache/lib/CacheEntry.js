'use strict';

var through = require('through');
var Readable = require('stream').Readable;

function createReadableFromValue (value, encoding) {
    var readableStream = new Readable({objectMode: true});
    readableStream.push(value);
    readableStream.push(null);

    return readableStream;
}

function CacheEntry (config) {
    if (!config) {
        config = {};
    }

    this.key = config.key;
    this.value = config.value;
    this.valueHolder = config.valueHolder;
    this.reader = config.reader;
    this.meta = {}; // Metadata that should be persisted with the cache entry
    this.data = {}; // A container for extra data that can be attached to (not written to disk)
    this.deserialize = config.deserialize;

    // if CacheEntry is constructed with a value then we assume that it has already been deserialized
    this.deserialized = (config.value !== undefined);
    this.encoding = config.encoding;
}

var proto = CacheEntry.prototype;

proto.createReadStream = function () {
    if (this.deserialize) {
        throw new Error('A read stream cannot be created for cache entries with a deserialize');
    }

    var value = this.value;
    if (value !== undefined) {
        return createReadableFromValue(value, this.encoding);
    } else if (this.reader) {
        return this.reader();
    } else {
        var Readable = require('stream').Readable;
        var inStream = new Readable();
        inStream.push(null);
        return inStream;
    }
};

proto.readValue = function () {
    var value = this.value;
    if (this.deserialized === true) {
        // value has already been serialized
        return Promise.resolve(value);
    }

    var reader;

    if (value === undefined) {
        reader = this.reader;
        if (reader === undefined) {
            throw new Error('Cannot read from CacheEntry with no value or reader');
        }
    } else {
        reader = () => {
            return createReadableFromValue(value, this.encoding);
        };
    }

    if (this.deserialize) {
        return this.deserialize(reader)
            .then((value) => {
                this.value = value;
                this.deserialized = true;
                return value;
            });
    }
};

proto.readRaw = function () {
    return new Promise((resolve, reject) => {
        if (this.value) {
            return resolve(this.value);
        }

        var result = [];
        var totalLength = 0;

        var inStream = this.createReadStream();
        inStream.pipe(through(
            function data (d) {
                totalLength += d.length;
                result.push(d);
            },
            function end () {
                if (result.length) {
                    if (typeof result[0] === 'string') {
                        resolve(result.join(''));
                    } else {
                        var valueBuffer = Buffer.concat(result, totalLength);
                        resolve(valueBuffer);
                    }
                } else {
                    resolve();
                }
            }));
    });
};

module.exports = CacheEntry;
