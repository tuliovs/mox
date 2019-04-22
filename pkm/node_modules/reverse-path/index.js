module.exports = reversePath;

// regex from https://github.com/component/path-to-regexp
var PATH_REGEXP = new RegExp([
  // Match already escaped characters that would otherwise incorrectly appear
  // in future matches. This allows the user to escape special characters that
  // shouldn't be transformed.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
  '([\\/.])?(?:\\:(\\w+)(?:\\((.+)\\))?|\\((.+)\\))([?])?',
  // Match regexp special characters that should always be escaped.
  '([.+*?=^!:${}()[\\]|\\/])'
].join('|'), 'g');

function reversePath(path, params, options) {
    this.index = 0;
    this.params = params || {};
    this.options = options || {};

    return path.replace(PATH_REGEXP, replace);
}

function replace(match, escaped, prefix, key, capture, group, optional, escape) {
    if(escaped) return escaped;
    if(escape) return escape;

    prefix = prefix || '';

    var value = this.params[key || this.index++];

    if(value === undefined) {
        if(optional) {
            value = '';
        } else {
            throw new Error('Parameter "' + key + '" is required.');
        }
    }

    return prefix + value;
}
