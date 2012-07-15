define ["gremlinjs/gremlins/AbstractGremlin"], (AbstractGremlin) ->
  class {{name}} extends AbstractGremlin
    constructor : ->
      super
      @view.html "Hello, world! :) <br>
      I'm the {{name}}-gremlin and the ##{@id}. gremlin in this page. <br>
      Use <code>@data</code> to access the data-object of this gremlin."