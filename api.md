<style type="text/css">
.module-header {
    font-family: 'Bitstream Vera Sans Mono','Courier',monospace;
    font-size: 1.8em;
    color: #969648;
    background: #fff;
}
.module-member {
    font-family: 'Bitstream Vera Sans Mono','Courier',monospace;
    font-size: 1.2em;
    color: #CC7833;
}
</style>

# Introduction
GremlinJS is all about Gremlins. Whenever you have the feeling there is something that uses javascript create one

* Need a custom select box? Create a `SelectBox` gremlin
* Need a fancy tooltip? Create a `Tooltip` gremlin
* Need a fancy something? Create a `Something` gremlin

I think it's clear when to create gremlins: **always**

# HTML
Every HTML-tag is a possible gremlin.

Add a unique css class and a name via the `data-gremlin-name` attribute to it and you are done.

#### Example

    <div class="gremlin" data-gremlin-name="HelloWorld">
        <span>Loading Gremlin...</span>
    </div>

### options
Every gremlin will have a [`data`](#gremlin.data) instance property. All custom data-attributes you add to your gremlins
tag can be found in there.

##### Example
###### HTML
    <div class="gremlin" data-gremlin-name="HelloWorld" data-foo="bar">
        <span>Loading Gremlin...</span>
    </div>

###### Javascript
    this.data.foo === "bar"; //true


# GremlinJS modules


<h3 class="module-header">gremlinjs</h3>

<span class="module-member">gremlinjs#**create**(String **name**, Object **mixin**) : AbstractGremlin</span>

Creates a gremlin class. It does **not** create an instance!

#### Example

    define(['gremlinjs'], function (gremlinjs) {
        var HelloWorld = gremlinjs.create("HelloWorld", {
            initialize:function () {
                this.view.html("<h1>Hello World!</h1>");
            }
        });
        return HelloWorld;
    });

---

<span class="module-member">gremlinjs#**getLoader**(String **namespace** = "", String **cssClass** = "gremlin") : Loader</span>

Creates, or returns an existing, gremlin loader instance. Loader instances should **always** be created this way. It's
the only reliable way to create a single loader instance for a namespace/css class combination

#### Example
    require(["gremlinjs"], function (gremlinjs) {
        var loader = gremlinjs.getLoader("public/gremlins/", "gremlin");
        loader.load();
    });

<h3 class="module-header">sources</h3>

There are some more (helpful) modules available in GremlinJS. For now, please use the annotated sources to learn about
them.

# Details

<h2 class="module-header">gremlinjs#create(name, mixin)</h2>
`gremlinjs.create` is a shortcut to [GremlinLair#create](https://github.com/grmlin/gremlinjs/blob/master/src/gremlinjs/gremlins/GremlinLair.coffee#L12).

It creates and returns a new class inherited from [AbstractGremlin](https://github.com/grmlin/gremlinjs/blob/master/src/gremlinjs/gremlins/AbstractGremlin.coffee) and
mixes **mixin** into the new class' prototype.

### name

Pass a name into the create method. The name will be used for debugging/logging.

### mixin

The mixin describes your gremlin and may come with any property you need.

However, there are some predefined properties used by the `AbstractGremlin` the new gremlin inherits from, you should be aware of.

----

### pseudo constructor

<span class="module-member">method **initialize()**</span>

When the gremlin is instantiated, the initialize method will be called. Use it as your gremlins constructor.

#### Example

     var HelloWorld = gremlinjs.create("HelloWorld", {
        initialize:function () {
            //do constructor work here
        }
    });

----


### "read only" instance properties
**Use but never overwrite them! For performance reasons I didn't include any tests to prevent someone from doing so.**

<span class="module-member">jQuery **view**</span>

jQuery object of the gremlin's dom element

#### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        initialize:function () {
            this.view.html("Hello World!");
        }
    });

<span id="gremlin.data" class="module-member">Object **data**</span>

If you add custom data-attributes to the dom element, you'll find them in here.
`data` is the result of `view.data()` method without any parameters. (see the jQuery data doc for more information)

#### Example
    var attr = this.data.myAttribute; // value of data-my-attribute

<span class="module-member">Number **id**</span>

A unique ID bound to every gremlin. This ID stays unique through multiple Loader instances.
IDs may be useful, if you have to add an dynamically generated ID to the dom element.

#### Example
    this.view.attr("id",this.id);

<span class="module-member">method **chatter(interest,notificationData = {})**</span>

Publish an event/interest/notification. The method expects the interest and an optional notification data object.

See `interests` for more details.

#### Example
    this.chatter("OUCH",{foo:"bar"});

<span class="module-member">method **triggerChange()**</span>

Call this method if you changed the HTML of the gremlin and new gremlins may appear. GremlinJS will search for them this way!

#### Example
    this.view.html(content);
    this.triggerChange();

----

### "rewritable" instance properties

<span class="module-member">Object **events**</span>

A simple way to add jQuery event handler to the gremlins instance within it's context.

The events object has to be of this format: `{'String "instanceMethod"':'String "eventType selector'}`, where the method
has to reference an instance method of this class.

#### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        events: {
            "handleClick": "click div.content h1"
        }
        handleClick:function () {
            alert("ouch");
        }
    });





<span class="module-member">Object **elements**</span>

Similar to the events object you can define jQuery elements in this object. It must have the format `{'String instanceMember':'String selector'}`.

#### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        elements: {
            "content":"div.content"
        }
        initialize:function () {
            content.html("Hello World!");
        }
    });



<span class="module-member">Array **interests**</span>

Some words on notifications. There may be circumstances where you need two gremlins to communicate with each other.
Notifications are a way to do this respecting the lose coupled nature of GremlinJS.

Every gremlin can use `chatter()` to publish a notification. All other gremlins listing the interest name in their `interests`
array will be informed of the event as `inform()` is called.

#### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        interests: ["FOO", "BAR"]
     });

<span class="module-member">method **inform(interest, notificationData)**</span>

`inform` is called, when a gremlin in the site published a notification, the gremlin is interested in (see `interests`)

Both the interest and the notification data are  passed into the inform method.

#### Example

    var HelloWorld = gremlinjs.create("HelloWorld", {
        interests: ["FOO", "BAR"]
        inform:function (interest, data) {
            console.log(interest);//FOO or BAR
        }
    });

<h2 class="module-header">gremlinjs#getLoader(namespace,cssClass)</h2>

### namespace

The namespace tells Gremlinjs/requirejs where to look for the gremlin files. The parameter is optional and empty
by default.

### cssClass

GremlinJS uses a css class to find your gremlins inside the dom. The parameter is optional and *gremlin* by default.

> You may ask yourself why an extra css class is needed and GremlinJS doesn't use the gremlin-name attribute to find them.
> The answer is easy: speed. Modern browsers give you a native `getElementsByClassname()` method. Finding dom elements by attributes
> is much slower.