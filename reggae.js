exports.Target = function (output) {

    this.outputs = [output]
    this.type = "fixed"
    this.command = {}
    this.dependencies = {type: "fixed", targets: []}
    this.implicits = {type: "fixed", targets: []}

    this.toJson = function () {
        return JSON.stringify(this)
    }
}
