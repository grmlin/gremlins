define ["gremlinjs/core/helper", "jquery", "gremlinjs/gremlins/AbstractGremlin", "text!/js/gremlins/lair/LairGremlin.js","text!/js/gremlins/lair/LairGremlin.coffee"], (helper, $, AbstractGremlin, LairGremlinJs, LairGremlinCoffee) ->
  gup = (name) ->
    name = name.replace(/[\[]/, "\\\ [").replace(/[\]]/, "\\\]")
    regexS = "[\\?&]" + name + "=([^&#]*)"
    regex = new RegExp(regexS)
    results = regex.exec(window.location.href)
    if results is null then "" else results[1]

  tpl = (template, model) ->
    for own key,value of model
      template = template.replace new RegExp('{{' + key + '}}', 'g'), value
    template

  class Lair extends AbstractGremlin
    @PARAM_GREMLIN_NAME = "gremlinName"
    constructor: ->
      super
      getName = gup Lair.PARAM_GREMLIN_NAME
      @_jForm = @view.find 'form'
      @_jPreview = @view.find '.gremlin-preview'
      @_jName = @view.find 'input[name=gremlinName]'

      @_jName.val(getName)

      @_jForm.submit (e) =>
        e.preventDefault()
        this._handleFormSubmit()
      @view.delegate 'input[type=reset]', 'click', =>
        this._clearPreview()
      @view.delegate '.gremlin-preview textarea', 'click', ->
        this.select()

    _handleFormSubmit: ->
      name = @_jName.val()
      if !helper.isEmptyString name then this._renderGremlin name else @_jName.focus()
    _renderGremlin: (name) ->
      jsFileContent = tpl LairGremlinJs,
        name: name
      coffeeContent = tpl LairGremlinCoffee,
        name: name
      jsFileUri = "data:application/javascript;filename=#{name}.js,#{encodeURIComponent jsFileContent}"
      coffeeFileUri = "data:application/javascript;filename=#{name}.coffee,#{encodeURIComponent coffeeContent}"
      $previews = @_jPreview.children('div').slice 0, 2
      $previews.html ""
      $previews.eq(0).append "<h2><a href=\"#{coffeeFileUri}\">#{name}.coffee</a></h2><pre><code><textarea rows=\"10\">#{coffeeContent}</textarea></code></pre>"
      $previews.eq(1).append "<h2><a href=\"#{jsFileUri}\">#{name}.js</a></h2><pre><code><textarea rows=\"20\">#{jsFileContent}</textarea></code></pre>"
      @_jPreview.show()
      @view.addClass "submitted"
      $('html,body').animate
        scrollTop: @view.find('.gremlin-preview').offset().top - 30
    _clearPreview: ->
      @_jPreview.children('div').slice(0, 2).html ""
      @view.removeClass "submitted"