define([
    "gremlinjs/gremlins/GremlinSwitchboard"
], function (switchboard) {
    return function () {
        module("gremlinjs/gremlins/GremlinSwitchboard");
        //not much to test here. See GremlinLair tests notifications for more
        test("registration", function(){
            throws(function(){
                switchboard.register({});
            },"the switchboard registers gremlins only");
        })
    }
});