/**
 * Created by pablo on 10/10/16.
 */
function parseOSNContent(data, prev, variables){

    prev = prev == null ? "" : prev;
    var rawCss = "";

    for(var i = 0; i < data.length; i++){

        if(data[i]['tag'].match("^@\{(.*?)\}$")) {
            var d = data[i]['tag'].substring(2, data[i]['tag'].length - 1);
            if(variables[d] instanceof Object){
                data[i] = variables[d];
            }
        }

        var tag = data[i]['tag'];
        var attributes = data[i]['attributes'];
        var selectors = data[i]['selectors'];
        var children = data[i]['children'];
        var heritage = data[i]['heritage'];

        if(attributes != null){
            rawCss += prev + tag + "{";

            var keysAttr = Object.keys(attributes);
            for (var s = 0; s < keysAttr.length; s++) {
                var kAt = keysAttr[s];
                var vAt = attributes[kAt];

                var defaultUnit = attributes['default-unit'];

                if(kAt == 'default-unit'){
                    continue;
                }

                if(defaultUnit == null){
                    defaultUnit = "px";
                }

                if(typeof vAt == 'number'){
                    vAt += defaultUnit;
                }

                var regex = new RegExp("#\{(.*?)\}", "gi");

                if(regex.exec(vAt)){
                    var arrRegex = vAt.match(regex);
                    arrRegex.forEach(function(arr){  
                        var vName = arr.substring(2, arr.length - 1);
                        var v = variables[vName];
                        if(!(v instanceof Object)){
                            vAt = vAt.replace("#{" + vName + "}", v);
                        }
                    });

                }

                rawCss += kAt + ": " + vAt + ";";

            }

            rawCss += "} ";
        }

        if(heritage != null){
            rawCss += parseOSNContent(heritage, prev + tag + " ", variables);
        }

        if(children != null){
            rawCss += parseOSNContent(children, prev + tag + " > ", variables);
        }

        if(selectors != null){
            rawCss += parseOSNContent(selectors, prev + tag + ":", variables);
        }

    }

    return rawCss;

}
function parseHTONContent(data, variables){

    var rawHtml = "";

    for (var i = 0; i < data.length; i++) {

        var rawAttributes = "";

        if(data[i]['tag'].match("^@\{(.*?)\}$")){

            var varName = data[i]['tag'].substring(2, data[i]['tag'].length -1);
            data[i]['tag'] = variables[varName]['tag'];

            if(variables[varName] != null){

                var keysVars = Object.keys(variables[varName]);
                for(var v = 0; v < keysVars.length; v++){
                    var keyV = keysVars[v];
                    var valueV = variables[varName][keyV];

                    if(keyV == "attributes" && data[i]["attributes"] != null){

                        var keysAttrs = Object.keys(valueV);
                        for(var at = 0; at < keysAttrs.length; at++){
                            var keyAt = keysAttrs[at];
                            var valueAt = valueV[keyAt];

                            if(data[i][keyV][keyAt] == null){
                                data[i][keyV][keyAt] = valueAt;
                            }
                        }
                        continue;
                    }
                    if(data[i][keyV] == null){
                        data[i][keyV] = valueV;
                    }
                }
            }
        }

        var tag = data[i]['tag'];
        var content = data[i]['content'];
        var attributes = data[i]['attributes'];

        if (attributes != null) {

            var keysAttr = Object.keys(attributes);

            var defaultUnit = attributes['default-unit'];

            if(defaultUnit == null){
                defaultUnit = "px";
            }

            for (var s = 0; s < keysAttr.length; s++) {
                var kAt = keysAttr[s];
                var vAt = attributes[kAt];

                if(kAt == 'default-unit'){
                    continue;
                }
                rawAttributes += " " + kAt + "=\"";

                var rawInside = "";

                switch (kAt) {
                    case 'style':
                        var keysStyle = Object.keys(vAt);

                        for (var v = 0; v < keysStyle.length; v++) {
                            var kSt = keysStyle[v];
                            var vSt = vAt[kSt];

                            if (typeof vSt == 'number') {
                                vSt += defaultUnit;
                            }
                            rawInside += kSt + ": " + vSt + ";";
                        }
                        break;
                    default:
                        rawAttributes += vAt;
                        break;
                }

                rawAttributes += rawInside + "\"";

            }

        }

        var voidElements = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];

        if(voidElements.indexOf(tag) != -1){
            rawHtml += "<" + tag + rawAttributes + " />";
            continue;
        }

        if (content == null) {
            rawHtml += "<" + tag + rawAttributes + "></" + tag + ">";
            continue;
        }

        var rawContent = "";

        if (content instanceof Object) {
            rawContent += parseHTONContent(content, variables);
        } else {

            var regex = new RegExp("#\{(.*?)\}", "gi");

            if(regex.exec(content)){
                var arrRegex = content.match(regex);
                arrRegex.forEach(function(arr){
                    var vName = arr.substring(2, arr.length - 1);
                    var v = variables[vName];
                    if(!(v instanceof Object)){
                        content = content.replace("#{" + vName + "}", v);
                    }
                });

            }

            rawContent += content;
        }

        rawHtml += "<" + tag + rawAttributes + ">" + rawContent + "</" + tag + ">";

    }
    return rawHtml;
}

function getVariables(variables){
    var vars = [];

    if(variables != null){
        var keysVariables = Object.keys(variables);

        for (var i = 0; i < keysVariables.length; i++) {
            var keyVariable = keysVariables[i];
            var valueVariable = variables[keyVariable];

            vars[keyVariable] = valueVariable;
        }
    }
    return vars;
}

module.exports = {
    html: function(data) {
        return (data == null) ? null : parseHTONContent(data.content, getVariables(data.variables));
    },
    css: function(data){
        return (data == null) ? null : parseOSNContent(data.content, "", getVariables(data.variables));

    },
    header: function(data){
        return (data == null) ? null : data['content-type'];
    },
    parse: function(data){
        var d = new Object();
        d.header = this.header(data.header);
        d.html = this.html(data.hton);
        d.css = this.css(data.osn);
        return d;
    }
}