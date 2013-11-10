describe('packages.Package', function () {
    it('can add packages', function () {

        expect(packages.Package).to.equal(G.Package);
        expect(packages.Package).to.be.a('function');


        var ns = 'foo.bar',
            data = {
                baz: 42
            };

        G.Package(ns, data);

        var thePackage = G.Package.require('foo.bar');
        expect(thePackage).to.equal(data);

    });
});