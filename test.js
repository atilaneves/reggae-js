var reggae = require('./reggae.js')

exports.testLeaf = function(test) {
    //var tgt = new Target('foo.d')
    var tgt = new reggae.Target('foo.d')
    test.equal(tgt.toJson(),
               '{"type": "fixed",\
                 "command": {},\
                 "outputs": ["foo.d"],\
                 "dependencies": {"type": "fixed", "targets": []},\
                 "implicits": {"type": "fixed", "targets": []}}',
               "value is '" + tgt.toJson() + "'")
    test.strictEqual("bar", "bar")
    test.done()
}
