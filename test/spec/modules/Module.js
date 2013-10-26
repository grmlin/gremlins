describe('modules.Module', function () {
    it('has a namespace for all modules', function () {

        expect(pkg).to.equal(G.pkg);
        expect(pkg).to.equal(G.packages);
        expect(pkg).to.be.an('object');

    });

    it('can add packages', function () {

        expect(modules.Module).to.equal(G.Module);
        expect(modules.Module).to.be.a('function');


        var ns = 'foo.bar',
            data = {
                baz: 42
            };

        G.Module(ns, data);

        expect(G.pkg.foo.bar).to.equal(data);
        expect(G.pkg.foo.bar).to.equal(G.Module.get(ns));
        expect(G.Module.get(ns)).to.equal(data);

    });
});