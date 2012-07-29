define([
    "gremlinjs/gremlins/LoaderPool",
    "gremlinjs/gremlins/Loader"
], function (LoaderPool, Loader) {
    return function () {
        module("gremlinjs/gremlins/LoaderPool");
        test("returns a loader instance", function () {
            var l1 = LoaderPool.getInstance("my/", "gremlin"),
                l2 = LoaderPool.getInstance("yours/", "foo"),
                l3, l4;
            ok(l1 instanceof Loader, "Loader 1 returned");
            ok(l2 instanceof Loader, "Loader 2 returned");
            ok(l1 !== l2, "loader 1 and loader 2 are two different instances");
            equal(LoaderPool.getInstance("my/", "gremlin"), l1, "only one instance per css class returned");
            throws(function () {
                l3 = LoaderPool.getInstance("yours/", "gremlin");
            }, "can't instantiate loader for same css class with different namespaces");
        });
    }
});