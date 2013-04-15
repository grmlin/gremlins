GremlinJS.extensions.DirksExtension = {
  test: function(){
      return true;
  },
  bind: function(gremlinInstance) {
      gremlinInstance.dirk = "was here, 42.";
  }

};