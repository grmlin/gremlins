class Espresso extends G.Gremlin
  constructor : ->
    super
    @el.innerHTML = "Espresso #{@id}, hmmmm"      
    console.dir @klass

G.add "Espresso", Espresso


