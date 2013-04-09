goog.provide 'gremlin.conf.Configuration'
goog.require 'gremlin.util.ElementData.ElementData'

class gremlin.conf.Configuration
  data = new gremlin.util.ElementData.ElementData document.body

  options =
    gremlinClassname : data.get('gremlinClassname') ? 'gremlin'
#
#  constructor: ->
#    console.dir options

  @gremlinClassname: options.gremlinClassname