exports.Target = function (output, cmd, deps, imps) {

    cmd = cmd || ''
    deps = arrayify(deps || [])
    imps = arrayify(imps || [])

    this.type = "fixed"
    this.command = cmd == '' ? {} : {type: 'shell', cmd: cmd}
    this.outputs = [output]
    this.dependencies = {type: "fixed", targets: deps}
    this.implicits = {type: "fixed", targets: imps}

    this.toJson = function () {
        return JSON.stringify(this)
    }
}

function arrayify(val) {
    return val.constructor === Array ? val : [val]
}


exports.Build = function (target) {
    this.targets = [target]

    this.toJson = function() {
        return JSON.stringify(this.targets)
    }
}
