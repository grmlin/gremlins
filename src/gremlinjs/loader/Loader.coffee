Walker            = require "./DomWalker.coffee"
GremlinDomElement = require "./../gremlins/GremlinDomElement.coffee"
helper            = require "./../helper.coffee"

getScrollTop = ->
  doc  = document.documentElement
  body = document.body
  (doc && doc.scrollTop  || body && body.scrollTop  || 0)


class Loader


  _walker          : null
  _namespace       : null
  _gremlinCssClass : null
  _elements        : null
  _lazyElements    : null

  constructor : (namespace = "", gremlinCssClass = "gremlin") ->
    @_namespace = namespace
    @_gremlinCssClass = gremlinCssClass
    @_walker = new Walker @_gremlinCssClass
    @_elements = []
    @_lazyElements = []

    if window.addEventListener
      window.addEventListener('scroll', @_scrollHandler, false);
    else if window.attachEvent
      window.attachEvent('onscroll', @_scrollHandler);

  _processElement : (element) ->
    @_elements.push(new GremlinDomElement element, @_gremlinCssClass, @_namespace)
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

  _checkLazyElement : (element, remaining) ->
    if element.isInViewport(getScrollTop())
      element.load()
    else
      remaining.push element

  load : () ->
    @_processElement element for element in @_walker.getGremlinCollection().toArray()
    @_scrollHandler()

module.exports = Loader
    