goog.provide 'gremlin.conf.Configuration'
goog.require 'gremlin.event.Event'
goog.require 'gremlin.util.ElementData.ElementData'

class gremlin.conf.Configuration
  instance = null
  data = new gremlin.util.ElementData.ElementData document.body
  options =
    cssClassName : data.get('gremlinCssClassName') ? 'gremlin'

  class Configuration
    constructor : (@_options) ->

    set         : (key, value) ->
      @_options[key] = value

    getCssClassName : ->
      @_options.cssClassName

  @options:
    CSS_CLASS_NAME: 'cssClassName'
  
  @get : () ->
    instance ?= new Configuration(options)