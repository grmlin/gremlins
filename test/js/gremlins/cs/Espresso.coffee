class Espresso extends G.Gizmo
  constructor : ->
    super
    @el.innerHTML = "Espresso #{@id}, hmmmm"

G.add "Espresso", Espresso
