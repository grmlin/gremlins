let pendingSearches = [];

const hasComponent = (element) => element.__gremlinInstance__ !== undefined;

module.exports = {
  addGremlin(id) {
    pendingSearches = pendingSearches.filter((search) => {
      const wasSearchedFor = search.element._gid === id;
      if (wasSearchedFor) {
        search.resolve();
      }

      return !wasSearchedFor;
    });
  },
  getGremlinAsync(element, timeout = null) {
    return new Promise((resolve) => {
      if (hasComponent(element)) {
        setTimeout(() => resolve(element.__gremlinInstance__), 10);
      } else {
        const gremlinNotFoundTimeout = timeout !== null ? setTimeout(() => {
          resolve(null);
        }, timeout) : null;

        pendingSearches.push({
          element,
          resolve() {
            clearTimeout(gremlinNotFoundTimeout);
            resolve(element.__gremlinInstance__);
          },
        });
      }
    });
  },
};
