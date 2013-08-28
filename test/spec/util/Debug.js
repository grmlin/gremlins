describe('util.Debug', function () {
  it('can use a console', function () {

    var debug = G.debug,
      i = 0,
      consoles = ["debug", "error", "info", "log", "warn", "dir", "dirxml", "trace", "assert", "count", "markTimeline",
        "profile", "profileEnd", "time", "timeEnd", "timeStamp", "group", "groupCollapsed", "groupEnd"]

    util.ready(function () {
      for (; i < consoles.length; i++) {
        expect(debug.console[consoles[i]]).to.be.a('function');
        if (consoles[i] !== 'clear') {
          debug.console[consoles[i]]('Logging with ' + consoles[i] + ' console');
        }
      }

    });

  })
});