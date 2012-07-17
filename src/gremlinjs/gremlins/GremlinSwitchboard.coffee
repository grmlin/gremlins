#
# #GremlinJS - `gremlinjs/gremlins/GremlinSwitchboard`
#
# Switchboard singleton, handling the inter-gremlin notifications

# defininge the GremlinSwitchboard module for requirejs
define ['cs!../core/helper'], (helper) ->
  # ## Private module members

  # interests cache
  cache = {}

  # ## Public module members

  # The switchboard
  exports =
    # Register a gremlin
    register: (gremlin) ->
      gremlin.bind gremlin.NOTIFICATION, @_broadcast, @
      @_addInterest gremlin, interest for interest in gremlin.interests

    _broadcast: (eventType, eventData) ->
      interest = eventData.interest
      notificationData = eventData.notificationData
      unless helper.isUndefined cache[interest]
        @__notify gremlin, interest, notificationData for gremlin in cache[interest]

    _addInterest: (gremlin, interest) ->
      cache[interest] = [] if helper.isUndefined cache[interest]
      cache[interest].push gremlin

    __notify: (gremlin, interest, data) ->
      gremlin.inform interest, data
