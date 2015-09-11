exports.Target = function (output, cmd, deps, imps) {

    cmd = cmd || ''
    deps = deps || []
    imps = imps || []

    this.outputs = [output]
    this.type = "fixed"
    this.command = cmd == '' ? {} : {type: 'shell', cmd: cmd}
    this.dependencies = {type: "fixed", targets: deps}
    this.implicits = {type: "fixed", targets: imps}

    this.toJson = function () {
        return JSON.stringify(this)
    }
}


exports.Build = function (target) {
    this.targets = [target]

    this.toJson = function() {
        return JSON.stringify(this.targets)
    }
}
