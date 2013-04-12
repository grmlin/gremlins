#https://github.com/tubalmartin/ondomready

###!
* onDomReady.js 1.2 (c) 2012 Tubal Martin - MIT license
###

goog.provide 'gremlin.util.ready'

gremlin.util.ready = do ->
  # W3C Event model

  # isReady: Is the DOM ready to be used? Set to true once it occurs.

  # Callbacks pending execution until DOM is ready

  # Handle when the DOM is ready
  ready = (fn) ->
    unless isReady

      # Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
      return defer(ready)  unless doc.body

      # Remember that the DOM is ready
      isReady = true

      # Execute all callbacks
      defer fn  while fn = callbacks.shift()

  # The document ready event handler
  DOMContentLoadedHandler = ->
    if w3c
      doc.removeEventListener DOMCONTENTLOADED, DOMContentLoadedHandler, FALSE
      ready()
    else if doc[READYSTATE] is COMPLETE

      # we're here because readyState === "complete" in oldIE
      # which is good enough for us to call the dom ready!
      doc.detachEvent ONREADYSTATECHANGE, DOMContentLoadedHandler
      ready()

  # Defers a function, scheduling it to run after the current call stack has cleared.
  defer = (fn, wait) ->

    # Allow 0 to be passed
    setTimeout fn, (if +wait >= 0 then wait else 1)

  # Attach the listeners:

  # Catch cases where onDomReady is called after the browser event has already occurred.
  # we once tried to use readyState "interactive" here, but it caused issues like the one
  # discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15

  # Handle it asynchronously to allow scripts the opportunity to delay ready

  # Standards-based browsers support DOMContentLoaded

  # Use the handy event callback

  # A fallback to window.onload, that will always work

  # If IE event model is used

  # ensure firing before onload,
  # maybe late but safe also for iframes

  # A fallback to window.onload, that will always work

  # If IE and not a frame
  # continually check to see if the document is ready

  # Use the trick by Diego Perini
  # http://javascript.nwbox.com/IEContentLoaded/

  # and execute any waiting functions
  onDomReady = (fn) ->

    # If DOM is ready, execute the function (async), otherwise wait
    (if isReady then defer(fn) else callbacks.push(fn))
  win = window
  doc = win.document
  docElem = doc.documentElement
  FALSE = false
  COMPLETE = "complete"
  READYSTATE = "readyState"
  ATTACHEVENT = "attachEvent"
  ADDEVENTLISTENER = "addEventListener"
  DOMCONTENTLOADED = "DOMContentLoaded"
  ONREADYSTATECHANGE = "onreadystatechange"
  w3c = ADDEVENTLISTENER of doc
  top = FALSE
  isReady = FALSE
  callbacks = []
  if doc[READYSTATE] is COMPLETE
    defer ready
  else if w3c
    doc[ADDEVENTLISTENER] DOMCONTENTLOADED, DOMContentLoadedHandler, FALSE
    win[ADDEVENTLISTENER] "load", ready, FALSE
  else
    doc[ATTACHEVENT] ONREADYSTATECHANGE, DOMContentLoadedHandler
    win[ATTACHEVENT] "onload", ready
    try
      top = not win.frameElement? and docElem
    if top and top.doScroll
      (doScrollCheck = ->
        unless isReady
          try
            top.doScroll "left"
          catch e
            return defer(doScrollCheck, 50)
          ready()
      )()

  # Add version
  onDomReady.version = "1.2"

  onDomReady