goog.provide 'extensions.JQuery'
# @private
class extensions.JQuery
  isSupported = typeof window.jQuery is 'function' or typeof window.Zepto is 'function'

  addElements = () ->
    if typeof @klass.$elements is 'object'
      for own selector, propertyName of @klass.$elements
        throw new TypeError "Element selector have to be referenced by strings!" unless (typeof selector is "string")
        @[propertyName] = @$el.find(selector)

  addEvents = () ->
    ctx = @
    if typeof @klass.$events is 'object'
      for own event, handlerName of @klass.$events
        do (handlerName, event) =>
          throw new TypeError "Event selectors have to be referenced by strings!" unless (typeof event is "string")

          if typeof @[handlerName] is "function"
            handler = @[handlerName]
          else
            throw new TypeError "Event '#{event}' can't be bound to '#{@name}.#{handlerName}', as the type is " + typeof @[handlerName]

          firstWhitespace = event.indexOf(" ")
          isDelegated = firstWhitespace isnt -1
          eventType = if isDelegated then event.substr(0, firstWhitespace) else event
          target = if isDelegated then event.substr(firstWhitespace + 1) else null
          
            
          @$el.on eventType, target, (e) ->
            handler.call(ctx, e, @)
            true
      true

  @test: ->
    isSupported

  @extend: (AbstractGremlin) ->
    AbstractGremlin.IS_JQUERY = yes
    
  @bind: (gremlinInstance) ->
    gremlinInstance.$el = $ gremlinInstance.el
    addElements.call gremlinInstance
    addEvents.call gremlinInstance
