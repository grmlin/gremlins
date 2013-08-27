describe('util.Debug', function () {
  it('can use a console', function () {

    var debug = new util.Debug(true),
      i = 0,
      consoles = ["clear", "debug", "error", "info", "log", "warn", "dir", "dirxml", "trace", "assert", "count", "markTimeline",
        "profile", "profileEnd", "time", "timeEnd", "timeStamp", "group", "groupCollapsed", "groupEnd"]

    util.ready(function () {
      for (; i < consoles.length; i++) {
        expect(debug).to.have.deep.property("console." + consoles[i]).that.is.a('function');
        if (consoles[i] !== 'clear') {
          debug.console[consoles[i]]('Logging with ' + consoles[i] + ' console');
        }
      }

    });

  })
});