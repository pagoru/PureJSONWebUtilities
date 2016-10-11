/**
 * Created by pablo on 10/10/16.
 */
module.exports = {
    hton: function(data) {

        var rawHtml = "";

        for (var i = 0; i < data.length; i++) {

            var rawAttributes = "";
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
                rawContent += this.hton(content);
            } else {
                rawContent += content;
            }

            rawHtml += "<" + tag + rawAttributes + ">" + rawContent + "</" + tag + ">";

        }
        return rawHtml;
    },

    sson: function(data, prev){

        prev = prev == null ? "" : prev;
        var rawCss = "";

        for(var i = 0; i < data.length; i++){

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

                    rawCss += kAt + ": " + vAt + ";";

                }

                rawCss += "} ";
            }

            if(children != null){
                rawCss += this.sson(children, prev + tag + " ");
            }

            if(selectors != null){
                rawCss += this.sson(selectors, prev + tag + ":");
            }

        }

        return rawCss;
    }
}