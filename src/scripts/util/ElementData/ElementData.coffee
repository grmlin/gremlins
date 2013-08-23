goog.provide 'gremlin.util.ElementData.ElementData'

goog.require 'gremlin.util.ElementData.DataValue'
goog.require 'gremlin.util.Helper'

class gremlin.util.ElementData.ElementData
  camelize = (string) ->
    return string.toLowerCase().replace /-(.)/g, (match, group1) ->
      return group1.toUpperCase()

  getData = (element) ->
    resultObj = {}

    if element.dataset isnt undefined
      data = element.dataset
    else
      data = {}
      #console.dir element.attributes

      [].filter.call(element.attributes, (at) ->
        isDataAttr = /^data-/.test(at.name)
        data[camelize(at.name.substring(5))] = element.getAttribute(at.name) if isDataAttr
        return isDataAttr
      )

    for own key, value of data
      dataVal = new gremlin.util.ElementData.DataValue value
      resultObj[key] = dataVal.parse()

    return resultObj

  constructor : (@_el) ->
    @_obj = getData @_el

  get : (key) ->
    @_obj[key] ? null

  toObject : ->
    gremlin.util.Helper.clone @_obj