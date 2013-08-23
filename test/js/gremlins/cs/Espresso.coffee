class Espresso extends G.Gizmo
  constructor : ->
    super
    @el.innerHTML = "Espresso #{@id}, hmmmm"
    console.dir @klass

G.add "Espresso", Espresso
