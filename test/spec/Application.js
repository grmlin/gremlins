describe('Application', function () {
  var app = new Application();

  it('can be started', function () {
    app.start();
  });
  it('can be refreshed', function () {
    app.refresh();
  });

});