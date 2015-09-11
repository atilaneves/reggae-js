var reggae = require('reggae')

function getBuild() {
    var reggaefile = require('reggaefile.js')
    var builds = []

    for(var key in reggaefile) {
        if(reggaefile[key].constructor == reggae.Build) builds.push(reggaefile[key])
    }

    if(builds.length > 1) throw "Too many Build objects"
    if(builds.length == 0) throw "Could not find Build object"

    return builds[0]
}


console.log(JSON.stringify(getBuild()))
