goog.provide 'gremlin.util.Debug'


do () ->
  NAMES = ["debug", "error", "info", "log", "warn", "dir", "dirxml", "trace", "assert", "count", "markTimeline",
           "profile", "profileEnd", "time", "timeEnd", "timeStamp", "group", "groupCollapsed", "groupEnd", "clear"]

  #fnNames =  (fn for fn of console when typeof console[fn] is 'function')

  canBind = typeof Function.prototype.bind is 'function'
  hasConsole = typeof window.console?.log is 'function'
  isDebug = hasConsole and document.body.getAttribute('data-gremlin-debug') is "true"

  noop = ->

  class gremlin.util.Debug


  if isDebug
    for fn in NAMES
      if canBind
        gremlin.util.Debug[fn] = if console[fn] then Function.prototype.bind.call(console[fn], console) else noop
      else
        if console[fn]
          gremlin.util.Debug[fn] = ->
            Function.prototype.apply.call(console[fn], console, arguments)
        else
          gremlin.util.Debug[fn] = noop
  else
    gremlin.util.Debug[fn] = noop for fn in NAMES


