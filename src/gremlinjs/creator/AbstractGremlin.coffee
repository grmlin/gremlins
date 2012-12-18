helper          = require "./../helper.coffee"

# add all jquery elements to the instance
_addElements = (elements) ->
  unless @elements is null
    for own selector, propertyName of @elements
      throw new TypeError "Element member #{propertyName} already defined!" unless (helper.isUndefined(@[propertyName]))
      throw new TypeError "Element selector have to be referenced by strings!" unless (helper.isString(selector))
      @[propertyName] = @view.querySelectorAll(selector)

# add all event listeners to the instance
#
# to do so, iterate over all given events, get the event type and the jquery selector and bind the event handler
# with the context still set to the gremlins instance
_addEvents = (events) ->
  unless @events is null
    for own handlerName, event of @events
      do (handlerName, event) =>
        throw new TypeError "Event selectors have to be referenced by strings!" unless (helper.isString(event))

        if helper.isFunction @[handlerName]
          handler = @[handlerName]
        else
          throw new TypeError "Event '#{event}' can't be bound to '#{@name}.#{handlerName}', as the type is " + typeof @[handlerName]

        firstWhitespace = event.indexOf(" ")
        isDelegated = firstWhitespace isnt -1
        eventType = if isDelegated then event.substr(0, firstWhitespace) else event
        target = if isDelegated then event.substr(firstWhitespace + 1) else null

        @view.on eventType, target, =>
          handler.apply(@, arguments)
          true
    true
    
class AbstractGremlin

# ### static class members

# Gremlin chatter event
  @NOTIFICATION: "GREMLIN_NOTIFICATION"

  # Gremlin HTML changed event. This is the only build in Notification for gremlins. It's used with @triggerChange
  @CONTENT_CHANGED: "gremlinjs_gremlin_content_changed"

  # ### instance members

  # Name of the gremlin, initially unknown
  name: "anonymous"

  # #### constructor

  # The constructor function of each gremlin will get three parameters passed in:
  #
  # * `view` - The dom element of the gremlin
  # * `data` - all custom data attributes (`data-...`) of the gremlin's dom element wrapped in an object
  # * `id` - a unique id assigned to this gremlin instance
  #
  # than
  #
  # * jQuery elements and events are bound
  # * interests list is prepared
  # * the gremlin is registered in the Switchboard
  # * the pseudo constructor is called
  constructor: (@view, @data, @id) ->
    _addElements.call @, @elements
    #_addEvents.call @, @events
    @interests = [] if @interests is null
    #Switchboard.register @
    @initialize()

  # #### public members

  # The pseudo constructor that will be called, when the instance is created. This method has to be overwritten by the
  # Gremlin class created in the lair below
  initialize: ->

    # an object to store all the jquery objects the gremlin uses. The key/value pairs have to be *instance property/selector*
    # e.g.:
    # `elements: { "listLink":"ul li a" }`
  elements: null

  # an object to store all the event handler the gremlin uses. The key/value pairs have to be *instance method/<eventType selector>*
  # e.g.:
  # `events: { "handleLinkClick":"click ul li a"}`
  events: null

  # every gremlin can provide an Array of interests he want's to be informed of when happening in the page.
  # e.g.:
  # `interests: ["FOO","BAR"]`
  interests: null,

  # and if any other gremlin on the site sends a notification your interested in, @inform will be called
  inform: (interest, notificationData) ->

    # Publish a gremlin event/interest/notification
    # e.g.:
    # @chatter("FOO",{})
  chatter: (interest, notificationData = {}) ->
    @dispatch @NOTIFICATION, {interest: interest, notificationData: notificationData}

  # Trigger the content change event of a gremlin
  triggerChange: ->
    @chatter @CONTENT_CHANGED

module.exports = AbstractGremlin