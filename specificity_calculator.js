var fs = require('fs');
var specificity = require('specificity');

fs.readFile('input.css', 'utf-8', function (err, data) {
    if (err) throw err;

    // clean css input from properties and linebreaks
    var reRemoveComments = /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/+/g;  // according http://blog.ostermiller.org/find-comment
    var reRemoveCharset = /(@charset[\w\s\"\-]*;)/g;
    var reRemoveFontFace = /(@font-face[^}]*)}/g
    var reRemoveKeyframe = /(@-webkit-keyframes[\w\s\-:.,;{}]*)(?=})(})/g
    var reRemoveMediaQuery = /(@media[\w\s\(\)\-\:\,]*\{)|\}(?=\s\})/g;
    var reRemoveProperties = /({[\w\s\-\(\)\/\\#.,:;!%'"=\uf000-\uf300]*})/g;
    var reRemoveLineBreaks = /\r?\n|\r/g;

    var dataTemp = data.replace(reRemoveComments, '').replace(reRemoveCharset, '').replace(reRemoveFontFace, '').replace(reRemoveKeyframe, '').replace(reRemoveMediaQuery, '').replace(reRemoveProperties, ',').replace(reRemoveLineBreaks, '');

    // remove duplicates
    var selectors = dataTemp.split(",");
    var uniqueSelectors = [];
    for (var key in selectors) {
       if ( uniqueSelectors.indexOf(selectors[key].trim()) === -1 ) uniqueSelectors.push(selectors[key].trim());
    }

    var spec = specificity.calculate(uniqueSelectors.toString());
    for (var key in spec) {
        console.log(spec[key].selector + ", " + spec[key].specificity   );
        fs.appendFileSync("./output.csv", spec[key].selector + ", " + spec[key].specificity + "\n");
    }

    console.log("total selectors: " + selectors.length);
    console.log("uniqueSelectors: " + uniqueSelectors.length);

});
