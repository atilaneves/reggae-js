exports.Target = Target

function Target (outputs, cmd, deps, imps) {

    cmd = cmd || ''
    deps = arrayify(deps || [])
    imps = arrayify(imps || [])

    this.type = "fixed"
    this.command = jsonifiable(cmd, ShellCommand)
    this.outputs = arrayify(outputs)
    this.dependencies = dependify(deps, FixedDependencies)
    this.implicits = dependify(imps, FixedDependencies)

    this.toJson = function () {
        return JSON.stringify(this.jsonify())
    }

    this.jsonify = function () {
        return {type: this.type,
                command: this.command.jsonify(),
                outputs: this.outputs,
                dependencies: this.dependencies.jsonify(),
                implicits: this.implicits.jsonify()
               }
    }
}

function FixedDependencies(deps) {
    this.targets = deps

    this.jsonify = function() {
        return { "type": "fixed", "targets": this.targets.map(function(t) { return t.jsonify() })}
    }
}

function ShellCommand(cmd) {
    this.type = 'shell'
    this.cmd = cmd

    this.jsonify = function () {
        return this.cmd == '' ? {} : {type: this.type, cmd: this.cmd}
    }
}

function arrayify(val) {
    return val.constructor === Array ? val : [val]
}

function dependify(arg, klass) {
    return arg.jsonify ? arg : new klass(arg)
}

function jsonifiable(arg, klass) {
    return arg.jsonify ? arg : new klass(arg)
}


exports.Build = function (target) {
    this.targets = [target]

    this.toJson = function() {
        return JSON.stringify(this.jsonify())
    }

    this.jsonify = function() {
        return this.targets.map(function(t) { return t.jsonify() })
    }
}


exports.link = function (options) {
    options.flags = options.flags || ""
    options.dependencies = options.dependencies || []
    options.implicits = options.implicits || []
    return new Target([options.exe_name],
                      new LinkCommand(options.flags),
                      options.dependencies,
                      options.implicits)
}


function LinkCommand(flags) {
    this.flags = flags

    this.jsonify = function () {
        return {type: "link", flags: this.flags}
    }
}
