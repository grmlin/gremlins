helper       = require "./../helper.coffee"
Switchboard  = require "./../switchboard/GremlinSwitchboard.coffee"
defaults     = require "./../conf/gremlin.defaults.coffee"

# add all jquery elements to the instance
_addElements = (elements) ->
  unless @elements is null
    for own selector, propertyName of @elements
      throw new TypeError "Element member #{propertyName} already defined!" unless (helper.isUndefined(@[propertyName]))
      throw new TypeError "Element selector have to be referenced by strings!" unless (helper.isString(selector))
      @[propertyName] = @view.querySelectorAll(selector)
  
class AbstractGremlin

# ### static class members

  # ### instance members

  # Gremlin options
  __settings: null
 
  # Extensions used with this gremlin
  __extensions : null
  
  # #### constructor

  # The constructor function of each gremlin will get three parameters passed in:
  #
  # * `view` - The dom element of the gremlin
  # * `data` - all custom data attributes (`data-...`) of the gremlin's dom element wrapped in an object
  # * `id` - a unique id assigned to this gremlin instance
  #
  # than
  #
  # * jQuery elements and events are bound
  # * interests list is prepared
  # * the gremlin is registered in the Switchboard
  # * the pseudo constructor is called
  constructor: (@view, @data, @id) ->
    
    _addElements.call @, @elements
    @interests = [] if @interests is null
    Switchboard.register @

  # #### public members

  # The pseudo constructor that will be called, when the instance is created. This method has to be overwritten by the
  # Gremlin class created in the lair below
  initialize: ->

    # an object to store all the jquery objects the gremlin uses. The key/value pairs have to be *instance property/selector*
    # e.g.:
    # `elements: { "listLink":"ul li a" }`
  elements: null

  # an object to store all the event handler the gremlin uses. The key/value pairs have to be *instance method/<eventType selector>*
  # e.g.:
  # `events: { "handleLinkClick":"click ul li a"}`
  events: null

  # every gremlin can provide an Array of interests he want's to be informed of when happening in the page.
  # e.g.:
  # `interests: ["FOO","BAR"]`
  interests: null,

  # and if any other gremlin on the site sends a notification your interested in, @inform will be called
  inform: (interest, notificationData) ->

    # Publish a gremlin event/interest/notification
    # e.g.:
    # @chatter("FOO",{})
  chatter: (interest, notificationData = {}) ->
    Switchboard.dispatch interest, notificationData

  # Trigger the content change event of a gremlin
  triggerChange: ->
    @chatter @CONTENT_CHANGED

# the exported object
module.exports =
# create a gremlin class. Pass in the gremlins name and the mixin describing your gremlin.
# **Don't forget to provide an `initialize` method if you need a constructor.
# It will be called when the gremlin class is intantiated**
  extend : (name, gremlinMixin, options = {}) ->
    throw new TypeError "GremlinLair#create called with wrong parameters!" unless (helper.isString(name) and helper.isObject(gremlinMixin))

    opt = helper.extend {}, defaults, options

    class Gremlin extends AbstractGremlin
      name       : name
      __settings : opt

    helper.mixin(Gremlin, gremlinMixin)

    return Gremlin
    