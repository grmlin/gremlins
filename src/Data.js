let pendingSearches = [];

const hasId = (element) => element._gid !== undefined;

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
      if (hasId(element)) {
        setTimeout(() => resolve(element), 10);
      } else {
        const gremlinNotFoundTimeout = timeout !== null ? setTimeout(() => {
          resolve(null);
        }, timeout) : null;

        pendingSearches.push({
          element,
          resolve() {
            clearTimeout(gremlinNotFoundTimeout);
            resolve(element);
          },
        });
      }
    });
  },
};
