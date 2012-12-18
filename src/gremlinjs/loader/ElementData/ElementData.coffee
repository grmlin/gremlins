helper    = require "./../../helper.coffee"
DataValue = require "./DataValue.coffee"

camelize = (string) ->
  return string.toLowerCase().replace /-(.)/g, (match, group1) ->
    return group1.toUpperCase()

getData = (element) ->
  resultObj = {} 
  
  if not helper.isUndefined element.dataset
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
    dataVal = new DataValue value  
    resultObj[key] = dataVal.parse()
    
  return resultObj

class ElementData
  
  constructor: (@_el) ->
    
  toObject: ->
    getData @_el 
  
module.exports = ElementData