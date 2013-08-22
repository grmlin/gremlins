//@ sourceMappingURL=Debug.map
goog.provide('gremlin.util.Debug');

goog.require('gremlin.util.Helper');

gremlin.util.Debug = (function() {
  var CSS_CLASS_LOG, CSS_CLASS_LOG_ERROR, CSS_CLASS_LOG_PENDING, CSS_CLASS_LOG_READY, CSS_CLASS_LOG_WAITING, NAMES, canBind, css, hasConsole, noop, _ref;

  CSS_CLASS_LOG = 'gremlinjs-log';

  CSS_CLASS_LOG_READY = 'gremlinjs-log-ready';

  CSS_CLASS_LOG_WAITING = 'gremlinjs-log-waiting';

  CSS_CLASS_LOG_PENDING = 'gremlinjs-log-pending';

  CSS_CLASS_LOG_ERROR = 'gremlinjs-log-error';

  NAMES = ["debug", "error", "info", "log", "warn", "dir", "dirxml", "trace", "assert", "count", "markTimeline", "profile", "profileEnd", "time", "timeEnd", "timeStamp", "group", "groupCollapsed", "groupEnd", "clear"];

  canBind = typeof Function.prototype.bind === 'function';

  hasConsole = typeof ((_ref = window.console) != null ? _ref.log : void 0) === 'function';

  noop = function() {};

  css = "." + CSS_CLASS_LOG + " {\nposition: fixed;\nbottom: 0;\nleft: 0;\nbackground: #fff;\npadding: 4px 6px;\n-webkit-box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.3);\nbox-shadow: 0px 0px 4px 0px rgba(0,0,0,0.3);\nz-index: 9999;\n}\n\n." + CSS_CLASS_LOG + " p {\n  font-size: 12px;\n  color: #666666;\n  margin: 0;\n  padding: 0;\n}\n\n." + CSS_CLASS_LOG + " p span {\n  display: inline-block;\n  margin: 0 5px;\n  cursor: help;\n}\n\n." + CSS_CLASS_LOG + " p ." + CSS_CLASS_LOG_READY + "{\ncolor: #41bb19;\n}\n\n." + CSS_CLASS_LOG + " p ." + CSS_CLASS_LOG_WAITING + "{\ncolor: #8d46b0;\n}\n\n." + CSS_CLASS_LOG + " p ." + CSS_CLASS_LOG_PENDING + "{\ncolor: #fff;\nbackground: #fe781e;\npadding: 0 4px;\n}\n\n." + CSS_CLASS_LOG + " p ." + CSS_CLASS_LOG_ERROR + "{\ncolor: #fff;\nbackground: #f50f43;\npadding: 0 4px;\n}\n\n*[data-gremlin-found] {\noutline: 2px solid #41bb19;\n}\n\n*[data-gremlin-found]::before {\ncolor: #41bb19;\nfont-family: monospace;\ncontent: '[' attr(data-gremlin-found) '] ready';\nposition: absolute;\nmargin-top: -14px;\nfont-size: 11px;\nfont-weight: bold;\n}\n\n.gremlin-definition-pending {\noutline: 2px solid #fe781e;\n}\n.gremlin-definition-pending::before {\ncontent: '[' attr(data-gremlin-found) '] definition pendig...';\ncolor: #fe781e;\n}\n.gremlin-error {\noutline: 2px solid red;\n}\n\n.gremlin-error[data-gremlin-found]::before {\ncontent: 'faulty gremlin!';\ncolor: red;\n}";

  function Debug(_isDebug) {
    this._isDebug = _isDebug;
    this._gremlins = [];
    this._broken = [];
    this._logEl = null;
    this._createLog();
    this._createConsole();
  }

  Debug.prototype._createLog = function() {
    if (this._isDebug) {
      this._logEl = document.createElement('div');
      this._logEl.className = CSS_CLASS_LOG;
      return document.body.appendChild(this._logEl);
    }
  };

  Debug.prototype._createConsole = function() {
    var fn, _i, _j, _len, _len1, _results, _results1;

    this.console = {};
    if (this._isDebug) {
      gremlin.util.Helper.addStyleSheet(css);
    }
    if (hasConsole && this._isDebug) {
      _results = [];
      for (_i = 0, _len = NAMES.length; _i < _len; _i++) {
        fn = NAMES[_i];
        if (canBind) {
          _results.push(this.console[fn] = console[fn] ? Function.prototype.bind.call(console[fn], console) : noop);
        } else {
          if (console[fn]) {
            _results.push(this.console[fn] = function() {
              return Function.prototype.apply.call(console[fn], console, arguments);
            });
          } else {
            _results.push(this.console[fn] = noop);
          }
        }
      }
      return _results;
    } else {
      _results1 = [];
      for (_j = 0, _len1 = NAMES.length; _j < _len1; _j++) {
        fn = NAMES[_j];
        _results1.push(this.console[fn] = noop);
      }
      return _results1;
    }
  };

  /*gremlin.gremlins.GremlinDomElement
  */


  Debug.prototype.registerGremlin = function(gremlinDomElement) {
    return this._gremlins.push(gremlinDomElement);
  };

  Debug.prototype.reportBrokenGremlin = function(element) {
    return this._broken.push(element);
  };

  Debug.prototype.updateGremlinLog = function() {
    var _this = this;

    if (this._isDebug && this._logEl) {
      return window.setTimeout(function() {
        var faulty, gremlinDomElement, html, pending, pendingNames, ready, readyNames, waiting, waitingNames, _i, _len, _ref1;

        ready = 0;
        readyNames = {};
        waiting = 0;
        waitingNames = {};
        pending = 0;
        pendingNames = {};
        faulty = _this._broken.length;
        _ref1 = _this._gremlins;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          gremlinDomElement = _ref1[_i];
          if (gremlinDomElement.hasGremlin()) {
            ready++;
            _this._addName(readyNames, gremlinDomElement.name);
          } else if (gremlinDomElement.isLazy) {
            waiting++;
            _this._addName(waitingNames, gremlinDomElement.name);
          } else {
            pending++;
            _this._addName(pendingNames, gremlinDomElement.name);
          }
        }
        html = "<p>\n<span title=\"" + (_this._getTitle(readyNames)) + "\" class='" + CSS_CLASS_LOG_READY + "'><strong>" + ready + "</strong> ready</span>\n<span title=\"" + (_this._getTitle(waitingNames)) + "\" class='" + CSS_CLASS_LOG_WAITING + "'><strong>" + waiting + "</strong> lazy waiting</span>\n<span title=\"" + (_this._getTitle(pendingNames)) + "\" class='" + (pending > 0 ? CSS_CLASS_LOG_PENDING : "") + "'><strong>" + pending + "</strong> pending</span>\n<span class='" + (faulty > 0 ? CSS_CLASS_LOG_ERROR : "") + "'><strong>" + faulty + "</strong> error(s)</span>\n</p>";
        return _this._logEl.innerHTML = html;
      }, 50);
    }
  };

  Debug.prototype._addName = function(list, name) {
    if (list[name]) {
      return list[name]++;
    } else {
      return list[name] = 1;
    }
  };

  Debug.prototype._getTitle = function(list) {
    var key, title, value;

    title = '';
    for (key in list) {
      value = list[key];
      title += "" + value + "x " + key + " \n";
    }
    if (title === '') {
      return '';
    } else {
      return 'Gremlins: \n' + title;
    }
  };

  return Debug;

})();
