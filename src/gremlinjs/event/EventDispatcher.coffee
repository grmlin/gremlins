#
# #GremlinJS - `gremlinjs/event/EventDispatcher`
#
# An event dispatcher/observable mixin.
#

# defining the EventDispatcher module for requirejs
define ['cs!../core/helper'], (helper) ->
    # The Event Dispatcher mixin object
    EventDispatcher =
      # observers array. Null, otherwise it would be a shared array in all classes including this mixin
      _observers: null
      # Bind an event to the instance by it's type, the callback function and a context
      bind: (type, listener, context = null) ->
        @_observers or= {};
        if helper.isUndefined type
          throw new Error("Event-type undefined.")
        else if not helper.isFunction(listener)
            throw new Error("Trying to add an event listener without defining a callback function.")

        this._observers[type] or= [];
        this._observers[type].push({
            listener: listener,
            context: context
        });

      # unbind an event.
      unbind: (type, listener, context = null) ->
        @_observers or= {}
        observers = @_observers[type]
        if helper.isFunction listener
          for observer, i in observers
            existinListener = observer.listener
            existingContext = observer.context
            if listener is existinListener and context is existingContext
              observers.splice(i,1)
              break
        else
            delete @_observers[type]

      # Dispatch an event and pass in an event object passed into the listener's callbacks
      dispatch: (eventType, eventObject) ->
        @_observers or= {}
        if not helper.isString(eventType)
          throw new Error("Trying to dispatch a non-standard event.")
        observers = @_observers[eventType] or []
        todo = for observer, index in observers
          listener = observer.listener
          # use do here
          ((listener, context, eventObject = null, eventType) ->
            ->
              listener.apply(context, [eventType, eventObject])
          )(listener, observer.context, eventObject, eventType)

        callback() for callback in todo

      # test, if the class has listeners for a given event type
      hasEventListener: (type) ->
        @_observers or= {}
        helper.isArray(@_observers[type]) and @_observers[type].length > 0

    EventDispatcher