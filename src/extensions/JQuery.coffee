helper = require "./../gremlinjs/helper.coffee"
AbstractExtension = require "./../gremlinjs/extensions/AbstractExtension.coffee"

# add all event listeners to the instance
#
# to do so, iterate over all given events, get the event type and the jquery selector and bind the event handler
# with the context still set to the gremlins instance
_addEvents = () ->
  unless @events is null
    for own event, handlerName of @events
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

        @$view.on eventType, target, =>
          handler.apply(@, arguments)
          true
    true

_addElements = () ->
  unless @elements is null
    for own selector, propertyName of @elements
      throw new TypeError "Element selector have to be referenced by strings!" unless (helper.isString(selector))
      @["$" + propertyName] = @$view.find(selector)

class JQuery extends AbstractExtension
  $ : null

  constructor    : (@_amdName, gremlin) ->
    super gremlin
  _extendGremlin : ($) ->
    @$ = $
    @_gremlin.$view = $ @_gremlin.view
    _addEvents.call @_gremlin
    _addElements.call @_gremlin
  load           : ->
    window.require ["jquery"], ($) =>
      @_extendGremlin $
      @onLoad()

module.exports = JQuery 
  