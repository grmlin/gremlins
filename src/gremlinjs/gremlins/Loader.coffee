#
# #GremlinJS - `gremlinjs/gremlins/Loader`
#
# This module returns the Loader class, that loads the javascript gremlins in your page.
#
# **There is a loader cache module build into GremlinJS:** `gremlinjs/gremlins/LoaderPool`
# **You should always use this cache to get Loader instances, as the cache takes care not to instantiate two Loaders for the same set of gremlins in the site.**
#

#including jquery, helper, GremlinFactory and gremlinEvents
define(['jquery', "cs!../core/helper", "cs!./GremlinFactory"], ($, helper, GremlinFactory) ->
  # ##Private module members

  # a unique id for every loader instance
  loaderId = 0
  # caching the `window
  $window = $(window)
  # caching the document's `body`
  $body = $('body')
  # separator used, if there are multiple gremlins associated with a dom element
  GREMLIN_NAME_SEPARATOR = ","
  # attribute used for the gremlin's name on a dom element
  DATA_GREMLIN_NAME_ATTRIBUTE = "data-gremlin-name"
  # attribute used to set lazy loading
  DATA_GREMLIN_LAZY_LOAD_ATTRIBUTE = 'data-lazy-load'
  # The css class used for gremlins by default
  DEFAULT_GREMLIN_CSS_CLASS = "gremlin"
  # The namespace used for gremlins by default
  DEFAULT_GREMLIN_NAMESPACE = ""
  # css class added to every gremlin while it's loaded with requirejs
  GREMLIN_LOADING_CLASS = "gremlin-loading"
  # css class added to every gremlin when it's created and instantiated
  GREMLIN_READY_CLASS = "gremlin-ready"
  # array holding all gremlins in the site. These are all gremlins, independent of the loader instance
  allGremlins = []
  # ##The loader class
  class Loader
  # ### Loader constructor

  # Constructor function used for the Loader. It's conststructed with an optional namespace and optional css class
    constructor: (@_namespace = DEFAULT_GREMLIN_NAMESPACE, @_gremlinCssClass = DEFAULT_GREMLIN_CSS_CLASS) ->
      throw new Error("gremlinjs.gremlins.Loader#Loader Missing new. The Loader is a constructor function.") unless @ instanceof Loader
      @_lazyLoadQueue = []
      this._bindLazyLoading()

    # ### **Public** Loader instance methods

    # Load all gremlins in the dom below an optional parent element (jQuery object)
    load: ($parent) ->
      this._cleanUp()
      if (helper.isJquery($parent))
        $moduleContainer = $parent.find(".#{@_gremlinCssClass}")
      else
        $moduleContainer = $(".#{@_gremlinCssClass}")

      $moduleContainer.each((index, element) =>
        names = element.getAttribute(DATA_GREMLIN_NAME_ATTRIBUTE)
        if (!helper.isString(names) or helper.isEmptyString(names))
          throw new Error("Can't create a gremlin without a classname defined for it.")

        for name in names.split(GREMLIN_NAME_SEPARATOR)
          name = @_namespace + name
          if (helper.isString(name) and not helper.isEmptyString(name))
            @_addGremlin(name, element)
          else
            throw new Error("Can't create a gremlin without a classname defined for it.")
      )
      @_handleScrollEvent()

    # Recalculate the positions of the lazy loaded gremlins
    resetLazyGremlins: ->
      for lazyLoadObject in @_lazyLoadQueue
        lazyLoadObject.top = lazyLoadObject.$element.offset().top
        lazyLoadObject.height = lazyLoadObject.$element.outerHeight()

    # ### **Private** instance methods

    # listen to browser scrolling and load gremlins
    _bindLazyLoading: ->
      scrollDelay = null
      scrollEvent = "scroll.Loader" + (loaderId += 1)
      @_lazyLoadQueue = []
      $window.unbind(scrollEvent).bind(scrollEvent, =>
        clearTimeout(scrollDelay) if scrollDelay
        scrollDelay = setTimeout =>
          @_handleScrollEvent()
        , 250
      )

    # Add a gremlin to the loader queue
    _addGremlin: (name, element) ->
      $element = $(element)
      lazyLoad = element.getAttribute(DATA_GREMLIN_LAZY_LOAD_ATTRIBUTE) is "true"
      $element.addClass(GREMLIN_LOADING_CLASS).removeClass(@_gremlinCssClass)
      if (lazyLoad)
        @_lazyLoadQueue.push
          name: name
          $element: $element
          top: $element.offset().top
          height: $element.outerHeight()
      else
        @_createGremlin(name, $element)

    # Create a gremlin with the factory
    _createGremlin: (name, $element) ->
      # Call the factory and request a new gremlin
      GremlinFactory.createGremlin name, $element, (gremlin) =>
        # - Add the gremlin to the stack
        # - listen to the content change event of each gremlin and rescan the gremlins view for gremlins when it fires
        # - gremlin is loaded now, remove the loading css class
        allGremlins.push(gremlin)
        gremlin.bind gremlin.NOTIFICATION, (type, data) =>
          @load(gremlin.view) if data.interest is gremlin.CONTENT_CHANGED
        $element.removeClass(GREMLIN_LOADING_CLASS).addClass(GREMLIN_READY_CLASS)

        true

    # Handle window scrolling for the lazy loaded gremlins
    _handleScrollEvent: ->
      scrollTop = $window.scrollTop()
      # adding some puffer to the lazy loaded gremlins
      @_checkLazyGremlins(scrollTop - 100, scrollTop + 100 + $window.height())

    # Check, which gremlins should be loaded at the current scroll position
    _checkLazyGremlins: (scrollTop, viewportBottom) ->
      if (@_lazyLoadQueue.length > 0)
        newLazyLoaded = []
        for lazyLoadObject in @_lazyLoadQueue
          if (lazyLoadObject.top + lazyLoadObject.height > scrollTop and lazyLoadObject.top < viewportBottom)
            @_createGremlin(lazyLoadObject.name, lazyLoadObject.$element)
          else
            newLazyLoaded.push(lazyLoadObject)

          @_lazyLoadQueue = newLazyLoaded

    # Delete unused (removed from the dom) gremlins
    _cleanUp: ->
      activeGremlins = []
      for gremlin in allGremlins
        if (gremlin.view?.closest('html').length is 0)
          gremlin = null
        else
          activeGremlins.push(gremlin)
      allGremlins = activeGremlins

  return Loader
)