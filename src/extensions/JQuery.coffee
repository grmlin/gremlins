AbstractExtension = require "./../gremlinjs/extensions/AbstractExtension.coffee"
methods           = require "./shared/frameworks.coffee"

class JQuery extends AbstractExtension
  $ : null

  constructor    : (gremlin) ->
    super gremlin
  _extendGremlin : ($) ->
    @$ = $
    @_gremlin.$view = $ @_gremlin.view
    methods.addEvents.call @_gremlin
    methods.addElements.call @_gremlin
  load           : ->
    window.require ["jquery"], ($) =>
      @_extendGremlin $
      @onLoad()

module.exports = JQuery

  