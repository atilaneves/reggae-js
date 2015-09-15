reggae-js
=============
[![Build Status](https://travis-ci.org/atilaneves/reggae-js.png?branch=master)](https://travis-ci.org/atilaneves/reggae-js)


A javascript interface / front-end to [the reggae meta-build system](https://github.org/atilaneves/reggae).


Installation
------------

    npm install -g reggae-js

It has to be installed globally so that the `reggae_json_build.js`
executable is available. However, and because of this, `require` will
fail to find the library portion so set the `NODE_PATH` environment
variable to where `npm` installed it
(.e.g. `/usr/lib/node_modules/reggae-js/lib`).


Usage
------------

This package makes available a few classes and functions that allow
the user to write build descriptions in Javacript using node-js. It is
essentially the same API as the D version but in JavaScript syntax. A simple
C build could be written like this:

    var reggae = require('reggae-js')
    var mainObj = new reggae.Target('main.o', 'gcc -I$project/src -c $in -o $out', new reggae.Target('src/main.c'))
    var mathsObj = new regage.Target('maths.o', 'gcc -c $in -o $out', new reggae.Target('src/maths.c'))
    var app = new reggae.Target('myapp', 'gcc -o $out $in', [mainObj, mathsObj])
    exports.bld = new reggae.Build(app)

This should be contained in a file named `reggaefile.js` in the project's root directory.
Running the `reggae` D binary on that directory will produce a build with the requested backend
(ninja, make, etc.)

Most builds will probably not resort to low-level primitives as above. A better way to describe
that C build would be:

    var reggae = require('reggae-js')
    var objs =  reggae.objectFiles({flags: '-I$project/src', src_dirs: ['src']})
    var app = link({exe_name: 'app', dependencies: objs})
    exports.bld = new reggae.Build(app)


Please consult the [reggae documentation](https://github.com/atilaneves/reggae/tree/master/doc/index.md)
for more details.
