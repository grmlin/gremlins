methods = require "./shared/frameworks.coffee"

module.exports =
  _extendGremlin : ($) ->
    @$ = $
    @_gremlin.$view = $ @_gremlin.view
    methods.addEvents.call @_gremlin
    methods.addElements.call @_gremlin
  initialize     : ->
    window.require ["jquery"], ($) =>
      @_extendGremlin $
      @onReady()

  