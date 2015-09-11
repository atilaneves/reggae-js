exports.Target = function (output) {
    this.outputs = [output]
    this.toJson = function () {
        return '{}'
    }
}
