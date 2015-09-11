var reggae = require('./reggae.js')

function formatJson(json) {
    return JSON.stringify(JSON.parse(json))
}

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
