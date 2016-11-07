/**
 * Created by emontorier on 01/11/16.
 */

var direBonjour = function () {
    console.log("Hello fellas !");
}

var direBye = function () {
    console.log("Bye Bye !");
}

exports.direBonjour = direBonjour;
exports.direBye = direBye;

var markdown = require("markdown").markdown;
console.log(markdown.toHTML("Mon paragraphe en **Markdown** ! "));
