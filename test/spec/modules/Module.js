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

    });

    it('can include modules in gremlins', function (done) {
        var TestGremlin,
            el = document.createElement('div'),
            el2 = document.createElement('div');

        el.setAttribute('data-gremlin', 'ModuleTest');
        el2.setAttribute('data-gremlin', 'ModuleTest2');

        document.body.appendChild(el);
        document.body.appendChild(el2);

        G.Module('moduleTestModule', {
            extend: function (Gizmo) {
                Gizmo.FOO = "BAR";
            },
            bind: function (gizmo) {
                gizmo.onClick = function () {
                    return "onClick";
                };

            }
        });

        G.Module('moduleTestModule2', {
            extend: function (Gizmo) {
                Gizmo.BAZ = "BOZ";
            },
            bind: function (gizmo) {
                gizmo.onWhatever = function () {
                    return "onWhatever";
                };

            }
        });

        TestGremlin = G.Gizmo.extend(function () {
                try {
                    expect(this.constructor.FOO).to.equal("BAR");
                    expect(this.onClick()).to.equal("onClick");
                    //done();
                } catch (e) {
                    done(e);
                }
            },
            {},
            {
                include: 'moduleTestModule'
            }
        );
        G.add('ModuleTest', TestGremlin);

        TestGremlin2 = G.Gizmo.extend(function () {
                try {
                    expect(this.constructor.FOO).to.equal("BAR");
                    expect(this.constructor.BAZ).to.equal("BOZ");
                    expect(this.onClick()).to.equal("onClick");
                    expect(this.onWhatever()).to.equal("onWhatever");
                    done();
                } catch (e) {
                    done(e);
                }
            },
            {},
            {
                include: ['moduleTestModule', 'moduleTestModule2']
            }
        );
        G.add('ModuleTest2', TestGremlin2);

        TestGremlin3 = G.Gizmo.extend(function () {
            },
            {},
            {
                include: ['foo']
            }
        );


        expect(function () {
            G.add('ModuleTest3', TestGremlin3);
        }).to.throwError();
    });
});