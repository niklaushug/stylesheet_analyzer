var fs = require('fs');
var specificity = require('specificity');

fs.readFile('input.css', 'utf-8', function (err, data) {
    if (err) throw err;

    // clean css input
    var reRemoveComments = /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/+/g;  // according http://blog.ostermiller.org/find-comment
    var reRemoveFontFace = /(@font-face[^}]*)}/g
    var reClassSelectors = /\.[a-zA-Z][\w\-\_]*/g;

    var classSelectors = data.replace(reRemoveComments, '').replace(reRemoveFontFace, '').match(reClassSelectors);

    // remove duplicates
    var uniqueClassSelectors = [];
    for (var key in classSelectors) {
       if ( uniqueClassSelectors.indexOf(classSelectors[key]) === -1 ) uniqueClassSelectors.push(classSelectors[key]);
    }

    for (var key in uniqueClassSelectors) {
        console.log(uniqueClassSelectors[key]);
        fs.appendFileSync("./output.csv", uniqueClassSelectors[key] + "\n");
    }

    console.log("total class selectors: " + classSelectors.length);
    console.log("total unique class selectors: " + uniqueClassSelectors.length);
});
