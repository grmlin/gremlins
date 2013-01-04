module.exports =
  addEvents : () ->
    unless @events is null
      for own event, handlerName of @events
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
    
          @$view.on eventType, target, =>
            handler.apply(@, arguments)
            true
      true

  addElements : () ->
    unless @elements is null
      for own selector, propertyName of @elements
        throw new TypeError "Element selector have to be referenced by strings!" unless (typeof selector is "string")
        @["$" + propertyName] = @$view.find(selector)