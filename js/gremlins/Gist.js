/*global define, window*/
define(["gremlinjs", "jquery"], function (gremlinjs, $) {
    'use strict';
    /**
     * @class A gremlin. <strong>gremlins/Gist</strong>
     * <br>
     * see http://www.bennadel.com/blog/2316-Using-An-IFrame-To-Override-document-write-Inside-A-DOM-Document-Object-Model-Sandbox.htm for the original
     * idea. Thanks Ben!
     */
    var Gist = gremlinjs.create("Gist", {
        elements : {
        },
        events : {
        },
        initialize : function () {
            var _this = this,
                $frame = $('<iframe style="display: none;visibility: hidden;with:0;height: 0;"/>'),
                src = this.data.gistSrc,
                iframeDocument,
                s;
            this._$frame = $frame;
            this._content = "";
            $frame.appendTo(this.view);
            iframeDocument = $frame.contents()[0];
            iframeDocument.proxyWrite = function (printed) {
                _this._proxyWrite(printed);
            };
            iframeDocument.write("<script type='text/javascript'>",
                "document.write = function( value ){",
                "document.proxyWrite( value );",
                "};",
                "</script>");
            s = iframeDocument.createElement("script");
            s.type = "text/javascript";
            iframeDocument.getElementsByTagName("head")[0].appendChild(s);
            s.src = src;
        },
        _proxyWrite : function (printed) {
            var isFirst = this._content === "";
            this._content += printed;
            if (!isFirst) {
                this._$frame.remove();
                this.view.append(this._content);
                $(window).resize();
            }
        }
    });
    return Gist;
});