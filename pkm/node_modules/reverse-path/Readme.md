
# reverse-path

  Turns Express-style paths to urls by passing parameters.

## Installation

  Install with [component(1)](http://component.io):

    $ component install duncaen/reverse-path

  Install with [npm(2)](http://npmjs.org):

    $ component install duncaen/reverse-path

## Usage

```javascript
var reversePath = require('reverse-path');
// reversePath(path, params, options);
```

- **path** A express-style route path
- **params** An object with with named and/or indexed parameters
- **options** todo ;)

## Examples

```javascript
var reversePath = require('reverse-path');
reversePath('/foo/:bar', { bar: 'foo'});
// /foo/foo
```

```
$ make test
  reverse-path
    ✓ should throw an exception when required keys aren't provided 
    ✓ should reverse "/test" {} to "/test" 
    ✓ should reverse "/test/bla" {} to "/test/bla" 
    ✓ should not reverse "/test/bla/" {} to "/test/bla" 
    ✓ should reverse "/test/bla/" {} to "/test/bla/" 
    ✓ should reverse "/:foo" { foo: 'bar' } to "/bar" 
    ✓ should reverse "/:foo/:bar" { foo: 'bar', bar: 'foo' } to "/bar/foo" 
    ✓ should not reverse "/:foo/:bar" { foo: 'bar', bar: 'foo' } to "/bar" 
    ✓ should reverse "/:foo?" {} to "/" 
    ✓ should reverse "/:foo?" { foo: 'bar' } to "/bar" 
    ✓ should reverse "/:foo(\d+)" { foo: 123 } to "/123" 
    ✓ should reverse "/:foo(\d+)?" {} to "/" 
    ✓ should reverse "/:foo(\d+)?" { foo: 456 } to "/456" 
    ✓ should reverse "/:foo(.*)" { foo: 'abc/def/ghi' } to "/abc/def/ghi" 
    ✓ should reverse "/:foo(.*)/:bar" { foo: 'abc/def/ghi', bar: 'jkl' } to "/abc/def/ghi/jkl" 
    ✓ should reverse "/:foo(.*)/:bar?" { foo: 'abc/def/ghi' } to "/abc/def/ghi/" 
    ✓ should reverse "/:foo(.*)/:bar?" { foo: 'abc/def/ghi', bar: 'jkl' } to "/abc/def/ghi/jkl" 
    ✓ should reverse "test" {} to "test" 
    ✓ should reverse ":test" { test: 'foo' } to "foo" 
    ✓ should not reverse ":test" { test: 'foo' } to "test" 
    ✓ should reverse "/test.json" {} to "/test.json" 
    ✓ should reverse "/:test.json" { test: 'foo' } to "/foo.json" 
    ✓ should reverse "/:test.:format" { test: 'foo', format: 'bar' } to "/foo.bar" 
    ✓ should reverse "/:test.:format?" { test: 'foo', format: 'bar' } to "/foo.bar" 
    ✓ should not reverse "/:test.:format?" { test: 'foo' } to "/foo.bar" 
    ✓ should reverse "/:test.:format?" { test: 'foo' } to "/foo." 
    ✓ should reverse "/(\d+)" { '0': 123 } to "/123" 
    ✓ should not reverse "/(\d+)?" {} to "/123" 
  28 passing (54ms)
```

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
