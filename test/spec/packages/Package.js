describe('packages.Package', function () {
    it('has a namespace for all packages', function () {

        expect(namespace).to.equal(G.namespace);
        expect(namespace).to.be.an('object');

    });

    it('can add packages', function () {

        expect(packages.Package).to.equal(G.Package);
        expect(packages.Package).to.be.a('function');


        var ns = 'foo.bar',
            data = {
                baz: 42
            };

        G.Package(ns, data);

        expect(G.namespace.foo.bar).to.equal(data);
        expect(G.namespace.foo.bar).to.equal(G.Package.get(ns));
        expect(G.Package.get(ns)).to.equal(data);

    });
});