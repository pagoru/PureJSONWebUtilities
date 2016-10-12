/**
 * Created by pablo on 10/10/16.
 */
function parseOSNContent(data, prev, variables){

    prev = prev == null ? "" : prev;
    var rawCss = "";

    for(var i = 0; i < data.length; i++){

        if(data[i]['tag'].startsWith("@:")){
            var d = variables[data[i]['tag'].replace('@:', '')];
            if(d instanceof Object){
                data[i] = d;
            }
        }
        var tag = data[i]['tag'];
        var attributes = data[i]['attributes'];
        var selectors = data[i]['selectors'];
        var children = data[i]['children'];

        if(attributes != null){
            rawCss += prev + tag + "{";

            var keysAttr = Object.keys(attributes);
            for (var s = 0; s < keysAttr.length; s++) {
                var kAt = keysAttr[s];
                var vAt = attributes[kAt];

                if(typeof vAt == 'number'){
                    vAt += 'px';
                }

                if(vAt.startsWith("@:")){
                    var v = variables[vAt.replace('@:', '')];
                    if(!(v instanceof Object)){
                        vAt = v;
                    }
                }

                rawCss += kAt + ": " + vAt + ";";

            }

            rawCss += "} ";
        }

        if(children != null){
            rawCss += parseOSNContent(children, prev + tag + " ", variables);
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

        if(data[i]['tag'].startsWith("@:")){
            data[i] = variables[data[i]['tag'].replace('@:', '')]
        }

        var tag = data[i]['tag'];
        var content = data[i]['content'];
        var attributes = data[i]['attributes'];

        if (attributes != null) {

            var keysAttr = Object.keys(attributes);

            for (var s = 0; s < keysAttr.length; s++) {
                var kAt = keysAttr[s];
                var vAt = attributes[kAt];
                rawAttributes += " ";

                switch (kAt) {
                    case 'style':
                        rawAttributes += "style=\"";

                        var rawStyle = "";
                        var keysStyle = Object.keys(vAt);

                        for (var s = 0; s < keysStyle.length; s++) {
                            var kSt = keysStyle[s];
                            var vSt = vAt[kSt];

                            if (typeof vSt == 'number') {
                                vSt += "px";
                            }

                            rawStyle += kSt + ": " + vSt + ";";
                        }

                        rawAttributes += rawStyle + "\"";
                        break;
                    default:
                        rawAttributes += kAt + "=\"" + vAt + "\"";
                        break;
                }

            }

        }

        if (content == null) {
            rawHtml += "<" + tag + rawAttributes + "/>";
            continue;
        }

        var rawContent = "";

        if (content instanceof Object) {
            rawContent += parseHTONContent(content, variables);
        } else {
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