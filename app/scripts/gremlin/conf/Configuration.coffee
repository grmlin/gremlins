goog.provide 'gremlin.conf.Configuration'

goog.require 'gremlin.util.Helper'
goog.require 'gremlin.event.Event'

class gremlin.conf.Configuration
  GREMLIN_CONFIG_NAME = 'gremlinConfig'
  instance = null
  options =
    debug: no
    autoload: yes

  class Configuration
    constructor : (options) ->
      userConfig = new gremlin.util.ElementData.ElementData(document.body).get(GREMLIN_CONFIG_NAME) ? {}
      @_options = gremlin.util.Helper.extend {}, options, userConfig

    get         : (key) ->
      @_options[key] ? null

  @options:
    DEBUG: 'debug'
    AUTOLOAD: 'autoload'
  
  @get : () ->
    instance ?= new Configuration(options)