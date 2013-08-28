# js source by https://github.com/mrappleton/microevent.js
goog.provide "EventDispatcher"

class EventDispatcher
  constructor: ->
    @_events = new Object()

  on: (event, fct) ->
    @_events[event] = @_events[event] or []
    @_events[event].push fct

  off: (event, fct) ->
    return  if event of @_events is false
    @_events[event].splice @_events[event].indexOf(fct), 1

  emit: (event) ->
    @_events = @_events or {}
    return  if event of @_events is false
    i = 0

    while i < @_events[event].length
      @_events[event][i].apply this, Array::slice.call(arguments, 1)
      i++

