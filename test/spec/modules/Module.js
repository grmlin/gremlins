describe('modules.Module', function () {
    it('can add modules', function () {

        expect(modules.Module).to.equal(G.Module);
        expect(modules.Module).to.be.a('function');

        expect(function () {
            G.Module('myModule', {});
        }).to.throwError();

        expect(function () {
            G.Module('myModule', {
                extend: function () {
                }
            });
        }).to.throwError();

        expect(function () {
            G.Module('myModule', {
                bind: function () {
                }
            });
        }).to.throwError();

        G.Module('myModule', {
            extend: function (Gremlin) {

            },
            bind: function (gremlin) {

            }
        });

        var TestGremlin = G.define('ModuleTest', function () {
            },
            {},
            {
                include: 'myModule'
            }
        );

    });
});