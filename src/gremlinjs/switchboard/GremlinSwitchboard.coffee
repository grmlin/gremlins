#
# #GremlinJS - `gremlinjs/gremlins/GremlinSwitchboard`
#
# Switchboard singleton, handling the inter-gremlin notifications

# defininge the GremlinSwitchboard module for requirejs
# ## Private module members

# interests cache
cache = {}

# ## Public module members

# The switchboard
module.exports =
  # Register a gremlin
  register: (gremlin) ->
    @_addInterest gremlin, interest for interest in gremlin.interests

  dispatch: (interest, data) ->
    unless cache[interest] is undefined
      @__notify gremlin, interest, data for gremlin in cache[interest]
      
  _addInterest: (gremlin, interest) ->
    cache[interest] = [] if cache[interest] is undefined
    cache[interest].push gremlin

  __notify: (gremlin, interest, data) ->
    gremlin.inform interest, data
