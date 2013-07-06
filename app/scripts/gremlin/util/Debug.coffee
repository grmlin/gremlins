goog.provide 'gremlin.util.Debug'
goog.require 'gremlin.util.Helper'

class gremlin.util.Debug
  CSS_CLASS_LOG = 'gremlinjs-log'
  CSS_CLASS_LOG_READY = 'gremlinjs-log-ready'
  CSS_CLASS_LOG_WAITING = 'gremlinjs-log-waiting'
  CSS_CLASS_LOG_PENDING = 'gremlinjs-log-pending'
  CSS_CLASS_LOG_ERROR = 'gremlinjs-log-error'

  NAMES = ["debug", "error", "info", "log", "warn", "dir", "dirxml", "trace", "assert", "count", "markTimeline",
           "profile", "profileEnd", "time", "timeEnd", "timeStamp", "group", "groupCollapsed", "groupEnd", "clear"]

  canBind = typeof Function.prototype.bind is 'function'
  hasConsole = typeof window.console?.log is 'function'
  noop = ->

  css = """
        .#{CSS_CLASS_LOG} {
        position: fixed;
        bottom: 0;
        left: 0;
        background: #fff;
        padding: 4px 6px;
        -webkit-box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.3);
        box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.3);
        }

        .#{CSS_CLASS_LOG} p {
          font-size: 12px;
          color: #666666;
          margin: 0;
          padding: 0;
        }

        .#{CSS_CLASS_LOG} p span {
          display: inline-block;
          margin: 0 5px;
          cursor: help;
        }

        .#{CSS_CLASS_LOG} p .#{CSS_CLASS_LOG_READY}{
        color: #41bb19;
        }

        .#{CSS_CLASS_LOG} p .#{CSS_CLASS_LOG_WAITING}{
        color: #8d46b0;
        }

        .#{CSS_CLASS_LOG} p .#{CSS_CLASS_LOG_PENDING}{
        color: #fff;
        background: #fe781e;
        padding: 0 4px;
        }

        .#{CSS_CLASS_LOG} p .#{CSS_CLASS_LOG_ERROR}{
        color: #fff;
        background: #f50f43;
        padding: 0 4px;
        }

        *[data-gremlin-found] {
        outline: 2px solid #41bb19;
        }

        *[data-gremlin-found]::before {
        color: #41bb19;
        font-family: monospace;
        content: '[' attr(data-gremlin-found) '] ready';
        position: absolute;
        margin-top: -14px;
        font-size: 11px;
        font-weight: bold;
        }

        .gremlin-definition-pending {
        outline: 2px solid #fe781e;
        }
        .gremlin-definition-pending::before {
        content: '[' attr(data-gremlin-found) '] definition pendig...';
        color: #fe781e;
        }
        .gremlin-error {
        outline: 2px solid red;
        }

        .gremlin-error[data-gremlin-found]::before {
        content: 'faulty gremlin!';
        color: red;
        }
        """
  constructor: (@_isDebug)->
    @_gremlins = []
    @_broken = []
    @_logEl = null
    @_createLog()
    @_createConsole()

  _createLog: ->
    if @_isDebug
      @_logEl = document.createElement 'div'
      @_logEl.className = CSS_CLASS_LOG
      document.body.appendChild @_logEl

  _createConsole: ->
    @console = {}
    if @_isDebug
      gremlin.util.Helper.addStyleSheet css

    if hasConsole and @_isDebug
      for fn in NAMES
        if canBind
          @console[fn] = if console[fn] then Function.prototype.bind.call(console[fn], console) else noop
        else
          if console[fn]
            @console[fn] = ->
              Function.prototype.apply.call(console[fn], console, arguments)
          else
            @console[fn] = noop
    else
      @console[fn] = noop for fn in NAMES
      
  ###gremlin.gremlins.GremlinDomElement### 
  registerGremlin: (gremlinDomElement) ->
    @_gremlins.push gremlinDomElement
    #@_updateGremlinLog()

  reportBrokenGremlin: (element) ->
    @_broken.push element
    #@_updateGremlinLog()


  updateGremlinLog: ->
    if @_isDebug and @_logEl
      window.setTimeout =>
        ready = 0
        readyNames = {}
        waiting = 0
        waitingNames = {}
        pending = 0
        pendingNames = {}
        faulty = @_broken.length

        for gremlinDomElement in @_gremlins
          if gremlinDomElement.hasGremlin()
            ready++
            @_addName readyNames, gremlinDomElement.name
          else if gremlinDomElement.isLazy
            waiting++
            @_addName waitingNames, gremlinDomElement.name
          else
            pending++
            @_addName pendingNames, gremlinDomElement.name

        html = """
               <p>
               <span title="#{@_getTitle(readyNames)}" class='#{CSS_CLASS_LOG_READY}'><strong>#{ready}</strong> ready</span>
               <span title="#{@_getTitle(waitingNames)}" class='#{CSS_CLASS_LOG_WAITING}'><strong>#{waiting}</strong> lazy waiting</span>
               <span title="#{@_getTitle(pendingNames)}" class='#{if pending > 0 then CSS_CLASS_LOG_PENDING else ""}'><strong>#{pending}</strong> pending</span>
               <span class='#{if faulty > 0 then CSS_CLASS_LOG_ERROR else ""}'><strong>#{faulty}</strong> error(s)</span>
               </p>
               """
        @_logEl.innerHTML = html
      , 50

  _addName: (list, name) ->
    if list[name] then list[name]++ else list[name] = 1

  _getTitle: (list) ->
    title = ''
    title += "#{value}x #{key} \n" for key, value of list
    return if title is '' then '' else 'Gremlins: \n' + title