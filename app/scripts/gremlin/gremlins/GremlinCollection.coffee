goog.provide 'gremlin.gremlins.GremlinCollection'
goog.require 'gremlin.gremlins.NameProvider'
goog.require 'gremlin.gremlins.GremlinDomElement'
goog.require 'gremlin.gremlins.GremlinFactory'

class gremlin.gremlins.GremlinCollection
  _elements     : null
  _queue        : null
  _lazyElements : null

  constructor : ->
    @_queue = []
    @_elements = []
    @_lazyElements = []

  #@_bindScroll()

  _bindScroll : ->
    if window.addEventListener
      window.addEventListener('scroll', @_scrollHandler, false)
    else if window.attachEvent
      window.attachEvent('onscroll', @_scrollHandler)

  add : (elArray) ->
    @_addGremlinElements el for el in elArray
    #@_queue = (new gremlin.gremlins.GremlinDomElement(el, cssClass) for el in elArray)
    @_processQueue()

  _addGremlinElements : (el) ->
    names = gremlin.gremlins.NameProvider.getNames el
    gremlin.gremlins.NameProvider.flagProcessedElement el
    @_queue.push new gremlin.gremlins.GremlinDomElement(el, name) for name in names

  _processQueue : ->
    remaining = []
    for element in @_queue
      if element.isInViewport()
        # trying to instantiate the gremlin
        #load element@_checkElement(element, remaining)
      else
        remaining.push element

    @_queue = remaining


  _processElement : (element) ->
    @_elements.push(new GremlinDomElement(element, @_cssClass))
    current = @_elements[@_elements.length - 1]

    if current.isLazy()
      @_lazyElements.push current
    else
      current.load()


  _scrollHandler : () =>
    if @_lazyElements.length > 0
      remaining = []
      @_checkLazyElement(element, remaining) for element in @_lazyElements
      @_lazyElements = remaining

  _checkElement : (element, remaining) ->
    if element.isInViewport()
      element.load()
    else
      remaining.push element
