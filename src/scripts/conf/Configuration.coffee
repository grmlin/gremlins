goog.provide 'conf.Configuration'

goog.require 'util.Helper'
goog.require 'event.Event'

class conf.Configuration

  instance = null
  defaultOptions =
    debug: no
    #autoload: yes

  constructor : (customOptions) ->

    @_options = util.Helper.extend {}, defaultOptions, customOptions

  get         : (key) ->
    @_options[key] ? null

  @options:
    DEBUG: 'debug'
    AUTOLOAD: 'autoload'