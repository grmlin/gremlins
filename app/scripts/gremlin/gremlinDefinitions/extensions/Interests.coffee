goog.provide 'gremlin.gremlinDefinitions.extensions.Interests'

class gremlin.gremlinDefinitions.extensions.Interests

  class Controller
    cache = {}
    @registerHandler: (interest, handler, ctx) ->
      cache[interest] = cache[interest] ? []
      cache[interest].push {handler: handler, ctx: ctx}

    @dispatch: (interest, data) ->
      unless cache[interest] is undefined
        item.handler.call item.ctx, data for item in cache[interest]


  addInterests = ->
    @interests = @interests ? {}
    @emit = (name, data) ->
      Controller.dispatch name, data

    for interest, handler of @interests
      #console.log interest, @[handler]
      Controller.registerHandler interest, @[handler], @

  @test: ->
    yes

  @bind: (gremlinInstance) ->
    #console.log "Adding Interests"
    addInterests.call gremlinInstance
#Switchboard.register @