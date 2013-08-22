goog.provide 'gremlin.conf.Configuration'

goog.require 'gremlin.util.Helper'
goog.require 'gremlin.event.Event'

class gremlin.conf.Configuration

  instance = null
  defaultOptions =
    debug: no
    #autoload: yes

  constructor : (customOptions) ->

    @_options = gremlin.util.Helper.extend {}, defaultOptions, customOptions

  get         : (key) ->
    @_options[key] ? null

  @options:
    DEBUG: 'debug'
    AUTOLOAD: 'autoload'