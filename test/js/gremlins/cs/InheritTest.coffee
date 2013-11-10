class window.InheritTestParent extends G.Gizmo
  @FOO: 'FOO'
  constructor : ->
    super

  foo: ->

  bar: 'bar'

class window.InheritTestChild extends window.InheritTestParent
  constructor: ->
    super