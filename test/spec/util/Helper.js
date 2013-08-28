describe('util.Helper', function () {
    it('should expose a public API', function () {
        expect(util.Helper.extend).to.be.a('function');
        expect(util.Helper.mixin).to.be.a('function');
        expect(util.Helper.clone).to.be.a('function');
        expect(util.Helper.hasClass).to.be.a('function');
        expect(util.Helper.addClass).to.be.a('function');
        expect(util.Helper.removeClass).to.be.a('function');
        expect(util.Helper.addStyleSheet).to.be.a('function');
    });

    it('can extend objects', function () {
        var a = {
                a: 'a',
                c: 'foo'
            },
            b = {
                b: 'b',
                c: 'bar'
            },
            c;

        c = util.Helper.extend(a, b);
        expect(c.a).to.be('a');
        expect(c.b).to.be('b');
        expect(c.c).to.be('bar');
        expect(a.c).to.be('bar');

        var d = {
                a: 'a',
                c: 'foo'
            },
            e = {
                b: 'b',
                c: 'bar'
            },
            f;

        c = util.Helper.extend({}, d, e);
        expect(c.a).to.be('a');
        expect(c.b).to.be('b');
        expect(c.c).to.be('bar');
        expect(d.c).to.be('foo');

    });

    it('can mixin  objects into prototypes', function () {
        var Cfn = function () {

            },
            m = {
                foo: 'bar'
            },
            a,
            b;

        a = new Cfn();
        util.Helper.mixin(Cfn, m);
        b = new Cfn();

        expect(Cfn.prototype.foo).to.be('bar');
        expect(a.foo).to.be('bar');
        expect(b.foo).to.be('bar');

        expect(function () {
            util.Helper.mixin({}, m);
        }).to.throwException(TypeError);
    });

    it('can clone  objects', function () {
        var a = {
                foo: {
                    bar: 'bar'
                }
            },
            b;

        b = util.Helper.clone(a);
        expect(b).to.eql(a);
        expect(b).not.to.be(a);

        var d = new Date();

        b = util.Helper.clone(d);
        expect(b).to.eql(d);
        expect(b.getTime()).to.be(d.getTime());
        expect(b).not.to.be(d);

        // TODO clone regexp
        var s = 'foo';
        b = util.Helper.clone(s);
        expect(b).to.be(s);
    });

    it('can check for css classes on dom elements', function () {
        var el = document.createElement('div');

        el.className = 'foo bar';

        expect(util.Helper.hasClass(el, 'foo')).to.be.ok();
        expect(util.Helper.hasClass(el, ' foo')).to.be.ok();
        expect(util.Helper.hasClass(el, 'foo ')).to.be.ok();
        expect(util.Helper.hasClass(el, '  foo ')).to.be.ok();
        expect(util.Helper.hasClass(el, 'bar')).to.be.ok();
        expect(util.Helper.hasClass(el, ' bar')).to.be.ok();
        expect(util.Helper.hasClass(el, 'bar ')).to.be.ok();
        expect(util.Helper.hasClass(el, ' bar ')).to.be.ok();
        expect(util.Helper.hasClass(el, 'FOO')).not.to.be.ok();
        expect(util.Helper.hasClass(el, ' FOO')).not.to.be.ok();
        expect(util.Helper.hasClass(el, 'FOO ')).not.to.be.ok();
        expect(util.Helper.hasClass(el, ' FOO ')).not.to.be.ok();
    });

    it('can add css classes on dom elements', function () {
        var el = document.createElement('div');

        expect(el.className).to.equal('');
        util.Helper.addClass(el, 'foo');
        expect(el.className).to.equal('foo');
        util.Helper.addClass(el, ' foo');
        expect(el.className).to.equal('foo');
        util.Helper.addClass(el, ' bar');
        expect(el.className).to.equal('foo bar');

    });

    it('can remove css classes from dom elements', function () {
        var el = document.createElement('div');
        el.className = 'foo bar';

        util.Helper.removeClass(el, ' bar ');
        expect(el.className).to.be('foo');
        util.Helper.removeClass(el, ' foo ');

        expect(el.className).to.be('');
    });

    it('can add css style strings to the document', function () {
        var el = document.createElement('div');
        el.className = 'css-style-test';
        document.body.appendChild(el);

        util.Helper.addStyleSheet('.css-style-test{border-style: solid;margin: 15px 0; padding: 20px}')

        var styles = document.styleSheets;

        for (var i = 0, l = styles.length; i < l; ++i) {
            var sheet = styles[i];

                var ruleList = sheet.cssRules || sheet.rules;
                for (j = 0; j < ruleList.length; j++) {
                    if (ruleList[j].selectorText == '.css-style-test') {
                        console.dir(ruleList[j]);
                        expect(ruleList[j].style.borderStyle).to.be('solid');
                        return
                    }
                }
        }
    });

});
