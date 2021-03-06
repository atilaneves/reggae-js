var reggae = require('./lib/reggae-js')


exports.testLeafFoo = function(test) {
    var tgt = new reggae.Target('foo.d')
    test.deepEqual(JSON.parse(tgt.toJson()),
                   {"type": "fixed",
                    command: {},
                    outputs: ["foo.d"],
                    dependencies: {type: "fixed", targets: []},
                    implicits: {type: "fixed", targets: []}})
    test.done()
}

exports.testLeafBar = function(test) {
    var tgt = new reggae.Target('bar.d')
    test.deepEqual(JSON.parse(tgt.toJson()),
                   {type: "fixed",
                    command: {},
                    outputs: ["bar.d"],
                    dependencies: {type: "fixed", targets: []},
                    implicits: {type: "fixed", targets: []}})
    test.done()
}


exports.testBuild = function(test) {
    var build = new reggae.Build(new reggae.Target('foo', 'dmd -offoo foo.d', [new reggae.Target('foo.d')]))
    test.deepEqual(JSON.parse(build.toJson()),
                              [{"type": "fixed",
                                "command": {"type": "shell",
                                            "cmd": "dmd -offoo foo.d"},
                                "outputs": ["foo"],
                                "dependencies": {"type": "fixed",
                                                 "targets":
                                                 [{"type": "fixed",
                                                   "command": {},
                                                   "outputs": ["foo.d"],
                                                   "dependencies": {
                                                       "type": "fixed",
                                                       "targets": []},
                                                   "implicits": {
                                                       "type": "fixed",
                                                       "targets": []}}]},
                                "implicits": {"type": "fixed", "targets": []}}])
    test.done()
}

exports.testProjectDirInclude = function(test) {
    var mainObj = new reggae.Target('main.o',
                                    'dmd -I$project/src -c $in -of$out',
                                    new reggae.Target('src/main.d'))
    var obj = JSON.parse(mainObj.toJson())
    test.deepEqual(JSON.parse(mainObj.toJson()),
                   {"type": "fixed",
                    "command": {"type": "shell",
                                "cmd": "dmd -I$project/src -c $in -of$out"},
                    "outputs": ["main.o"],
                    "dependencies": {"type": "fixed",
                                     "targets": [
                                         {"type": "fixed",
                                          "command": {}, "outputs": ["src/main.d"],
                                          "dependencies": {
                                              "type": "fixed",
                                              "targets": []},
                                          "implicits": {
                                              "type": "fixed",
                                              "targets": []}}]},
                    "implicits": {
                        "type": "fixed",
                        "targets": []}})
    test.done()
}


exports.testLinkFixed = function(test) {
    var mainObj = new reggae.Target('main.o',
                                    'dmd -I$project/src -c $in -of$out',
                                    new reggae.Target('src/main.d'))
    var mathsObj = new reggae.Target('maths.o',
                                     'dmd -c $in -of$out',
                                     new reggae.Target('src/maths.d'))
    var app = reggae.link({exe_name: 'myapp',
                           dependencies: [mainObj, mathsObj],
                           flags: '-L-M'})
    var bld = new reggae.Build(app)

    test.deepEqual(JSON.parse(bld.toJson()),
                  [{"type": "fixed",
                    "command": {"type": "link", "flags": "-L-M"},
                    "outputs": ["myapp"],
                    "dependencies": {
                        "type": "fixed",
                        "targets":
                        [{"type": "fixed",
                          "command": {"type": "shell",
                                      "cmd": "dmd -I$project/src -c $in -of$out"},
                          "outputs": ["main.o"],
                          "dependencies": {"type": "fixed",
                                           "targets": [
                                               {"type": "fixed",
                                                "command": {}, "outputs": ["src/main.d"],
                                                "dependencies": {
                                                    "type": "fixed",
                                                    "targets": []},
                                                "implicits": {
                                                    "type": "fixed",
                                                    "targets": []}}]},
                          "implicits": {
                              "type": "fixed",
                              "targets": []}},
                         {"type": "fixed",
                          "command": {"type": "shell", "cmd":
                                      "dmd -c $in -of$out"},
                          "outputs": ["maths.o"],
                          "dependencies": {
                              "type": "fixed",
                              "targets": [
                                  {"type": "fixed",
                                   "command": {}, "outputs": ["src/maths.d"],
                                   "dependencies": {
                                       "type": "fixed",
                                       "targets": []},
                                   "implicits": {
                                       "type": "fixed",
                                       "targets": []}}]},
                          "implicits": {
                              "type": "fixed",
                              "targets": []}}]},
                    "implicits": {
                        "type": "fixed",
                        "targets": []}}])

    test.done()
}


exports.testLinkDynamic = function(test) {
    var objs = reggae.objectFiles({flags: '-I$project/src',
                                   src_dirs: ['src']})
    var app = reggae.link({exe_name: 'myapp',
                           dependencies: objs,
                           flags: '-L-M'})
    var bld = new reggae.Build(app)

    test.deepEqual(JSON.parse(bld.toJson()),
                   [{"type": "fixed",
                     "command": {"type": "link", "flags": "-L-M"},
                     "outputs": ["myapp"],
                     "dependencies": {
                         "type": "dynamic",
                         "func": "objectFiles",
                         "src_dirs": ["src"],
                         "exclude_dirs": [],
                         "src_files": [],
                         "exclude_files": [],
                         "flags": "-I$project/src",
                         "includes": [],
                         "string_imports": []},
                     "implicits": {
                         "type": "fixed",
                         "targets": []}}])

    test.done()
}


exports.testStaticLib = function(test) {
    var lib = reggae.staticLibrary('libstuff.a',
                                   {flags: '-I$project/src', src_dirs: ['src']})
    var app = reggae.link({exe_name: 'myapp',
                           'dependencies': lib,
                           flags: '-L-M'})
    var bld = new reggae.Build(app)

    test.deepEqual(JSON.parse(bld.toJson()),
                   [{"type": "fixed",
                     "command": {"type": "link", "flags": "-L-M"},
                     "outputs": ["myapp"],
                     "dependencies": {
                         "type": "dynamic",
                         "func": "staticLibrary",
                         "name": "libstuff.a",
                         "src_dirs": ["src"],
                         "exclude_dirs": [],
                         "src_files": [],
                         "exclude_files": [],
                         "flags": "-I$project/src",
                         "includes": [],
                         "string_imports": []},
                     "implicits": {
                         "type": "fixed",
                         "targets": []}}])

    test.done()
}


exports.testScriptlike = function(test) {
    var app = reggae.scriptlike({src_name: 'src/main.d',
                                 exe_name: 'leapp',
                                 flags: '-g',
                                 includes: ['src']})
    var bld = new reggae.Build(app)

    test.deepEqual(JSON.parse(bld.toJson()),
                   [{"type": "dynamic",
                     "func": "scriptlike",
                     "src_name": "src/main.d",
                     "exe_name": "leapp",
                     "link_with": {"type": "fixed", "targets": []},
                     "flags": "-g",
                     "includes": ["src"],
                     "string_imports": []}])
    test.done()
}

exports.testTwoTargets = function(test) {
    objs1 = reggae.objectFiles({flags: '-I$project/src',
                                src_dirs: ['src']})
    app1 = reggae.link({exe_name: 'app1',
                        dependencies: objs1,
                        flags: '-L-M'})
    objs2 = reggae.objectFiles({flags: '-I$project/other',
                                src_dirs: ['other', 'yetanother']})
    app2 = reggae.link({exe_name: 'app2',
                        dependencies: objs2})

    bld = new reggae.Build(app1, app2)

    test.deepEqual(JSON.parse(bld.toJson()),
                   [{"type": "fixed",
          "command": {"type": "link", "flags": "-L-M"},
          "outputs": ["app1"],
          "dependencies": {
              "type": "dynamic",
              "func": "objectFiles",
              "src_dirs": ["src"],
              "exclude_dirs": [],
              "src_files": [],
              "exclude_files": [],
              "flags": "-I$project/src",
              "includes": [],
              "string_imports": []},
          "implicits": {
              "type": "fixed",
              "targets": []}},
         {"type": "fixed",
          "command": {"type": "link", "flags": ""},
          "outputs": ["app2"],
          "dependencies": {
              "type": "dynamic",
              "func": "objectFiles",
              "src_dirs": ["other", "yetanother"],
              "exclude_dirs": [],
              "src_files": [],
              "exclude_files": [],
              "flags": "-I$project/other",
              "includes": [],
              "string_imports": []},
          "implicits": {
              "type": "fixed",
              "targets": []}}]
                  )


    test.done()
}
