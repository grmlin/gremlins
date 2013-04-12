goog.provide 'gremlin.conf.Configuration'
goog.require 'gremlin.event.Event'

class gremlin.conf.Configuration
  instance = null
  options =
    autoload: yes

  class Configuration
    constructor : (@_options) ->

    set         : (key, value) ->
      @_options[key] = value

  @options:
    AUTOLOAD: 'autoload'
  
  @get : () ->
    instance ?= new Configuration(options)