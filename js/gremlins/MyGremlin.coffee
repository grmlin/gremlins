define ["gremlinjs/gremlins/AbstractGremlin"], (AbstractGremlin) ->
  class MyGremlin extends AbstractGremlin
    constructor : ->
      super
      @view.html "Hello, world! :) <br>
            I'm the MyGremlin-gremlin and the ##{@id}. gremlin in this page. <br>
            Use <code>@data</code> to access the data-object of this gremlin."