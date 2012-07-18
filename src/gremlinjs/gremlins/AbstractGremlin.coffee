#
# #GremlinJS - `gremlinjs/gremlins/AbstractGremlin`
#
# The gremlin's abstract class. It will be used to create gremlins

define ['cs!../core/helper', 'cs!../event/EventDispatcher'], (helper, EventDispatcher) ->
  # private methods


  # add all jquery elements to the instance
  addElements = (elements) ->
    unless @elements is null
      for own propertyName, selector of @elements
        throw new TypeError "Elements have to be referenced by strings!" unless (helper.isString(propertyName) and helper.isString(selector))
        @[propertyName] = @view.find(selector)

  # add all event listeners to the instance
  addEvents = (events) ->
    unless @events is null
      # iterate over all given events
      for own handlerName, event of @events
        do (handlerName, event) =>
          throw new TypeError "Event handler have to be referenced by strings!" unless (helper.isString(handlerName) and helper.isString(event))

          if helper.isFunction @[handlerName]
            handler = @[handlerName]
          else
            throw new TypeError "Event '#{event}' can't be bound to '#{@name}.#{handlerName}', as the type is " + typeof @[handlerName]

            # get the event type and the jquery selector
          firstWhitespace = event.indexOf(" ")
          isDelegated = firstWhitespace isnt -1
          eventType = if isDelegated then event.substr(0, firstWhitespace) else event
          target = if isDelegated then event.substr(firstWhitespace + 1) else null
          # bind the event
          @view.on eventType, target, =>
            handler.apply(@, arguments)
            true
      true

  # the Abstract gremlin class
  class AbstractGremlin
  # Name of the gremlin, initially unknown
    name: "anonymous"

    # Gremlin chatter event
    NOTIFICATION: "GREMLIN_NOTIFICATION"

    # Gremlin HTML changed event. This is the only build in Notification for gremlins. It's used with @triggerChange
    CONTENT_CHANGED: "gremlinjs_gremlin_content_changed"

    # The constructor function of each gremlin will get three parameters passed in:
    #
    # * `view` - The jQuery object of the gremlin's dom container
    # * `data` - the `view`'s data object obtained with `view.data()`
    # * `id` - a unique id assigned to this gremlin instance
    #
    constructor: (@view, @data, @id) ->
      addElements.call @, @elements
      addEvents.call @, @events
      @interests = [] if @interests is null
      @initialize()

    # The pseudo constructor that will be called, when the instance is created. This method has to be overwritten by the
    # Gremlin class created in the lair below
    initialize: ->
      #helper.warn("Gremlin <#{@name}> does not implement an own #initialize method.")

    # an object to store all the jquery objects the gremlin uses. The key/value pairs have to be *selector/instance property*
    # e.g.:
    # `elements: { "ul li a":"listLink" }`
    elements: null

    # an object to store all the event handler the gremlin uses. The key/value pairs have to be *<eventType selector>/instance method*
    # e.g.:
    # `events: { "click ul li a":"handleLinkClick}`
    events: null

    # every gremlin can provide an Array of interests he want's to be informed of when happening in the page.
    # e.g.:
    # `interests: ["FOO","BAR"]`
    interests: null,

    # and if any other gremlin on the site sends a notification your interested in, @handleNotification will be called
    inform: (interest, notificationData) ->

      # Publish a gremlin event/interest/notification
      # e.g.:
      # @chatter("FOO",{})
    chatter: (interest, notificationData = {}) ->
      @dispatch @NOTIFICATION, {interest: interest, notificationData: notificationData}

    # Trigger the content change event of a gremlin
    # TODO use the eventdispatcher instead
    triggerChange: ->
      @chatter @CONTENT_CHANGED

  helper.mixin AbstractGremlin, EventDispatcher

  AbstractGremlin