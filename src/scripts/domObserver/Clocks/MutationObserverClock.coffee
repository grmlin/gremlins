goog.provide 'domObserver.clocks.MutationObserverClock'

class domObserver.clocks.MutationObserverClock
  MutationObserver = window.MutationObserver or window.WebKitMutationObserver or window.MozMutationObserver or null

  mutationTypes =
    CHILD_LIST: 'childList'

  constructor: ->
    throw new Error "Mutation Observer not available" if MutationObserver is null
  observe: ->
    observer = new MutationObserver @_onMutation
    observer.observe document.body,
      childList: true
      subtree: true

  _onMutation: (mutations) =>
    for mutation in mutations
      if mutation.type is mutationTypes.CHILD_LIST
        @onMutation()
        break

  onMutation: ->
