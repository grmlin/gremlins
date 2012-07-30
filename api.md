<style type="text/css">
.module-header {
    font-family: 'Bitstream Vera Sans Mono','Courier',monospace;
    font-size: 1.2em;
    color: #969648;
    background: #fff;
}
.toc-code a {
   font-family: 'Bitstream Vera Sans Mono','Courier',monospace;
   color: #969648;
   text-decoration: none;
}
.module-member {
    font-family: 'Bitstream Vera Sans Mono','Courier',monospace;
    font-size: 1.2em;
    color: #969648;
    display: inline-block;
    padding-top: 10px;
}

.property-name {
    font-family: 'Bitstream Vera Sans Mono','Courier',monospace;
    font-size: 1.1em;
    font-weight: bold;

}

.read-only {
    color:#E97F02;
    font-weight: bold;
}
</style>

# GremlinJS Documentation

### [Require configuration](#requirejs)

---

### [Loader](#loader)

* [getting Loader instances](#gettingloaderinstances)
    * <span class="toc-code">[gremlinjs.getLoader()](#getloader)</span>
* [the Loader instance](#theloaderinstance)
    * <span class="toc-code">[\<loader\>.load()](#loading-gremlins)</span>
    * <span class="toc-code">[\<loader\>.resetLazyGremlins()](#lazy-load-gremlins)</span>

---

### [Gremlins](#gremlins)


* [HTML](#html)
    * [Multiple gremlins per element](#multiplegremlinsperelement)
    * [lazy loading](#lazyloading)
* [Gremlin creation](#gremlincreation)
    * <span class="toc-code">[gremlinjs.create()](#create)</span>
* [Initialization / pseudo constructor](#initializationpseudoconstructor)
    * <span class="toc-code">[\<gremlin\>.initialize()](#initialize)</span>
* [jQuery toolkit](#jquerytoolkit)
    * <span class="toc-code">[\<gremlin\>.view](#view)</span>
    * <span class="toc-code">[\<gremlin\>.events](#events)</span>
    * <span class="toc-code">[\<gremlin\>.elements](#elements)</span>
* [Setting gremlin options](#settinggremlinoptions)
    * <span class="toc-code">[\<gremlin\>.data](#data)</span>
* [Notifications](#notifications)
    * <span class="toc-code">[\<gremlin\>.interests](#interests)</span>
    * <span class="toc-code">[\<gremlin\>.chatter()](#chatter)</span>
    * <span class="toc-code">[\<gremlin\>.inform()](#inform)</span>
* [MISC](#misc)
    * <span class="toc-code">[\<gremlin\>.id](#id)</span>
    * <span class="toc-code">[\<gremlin\>.triggerChange()](#triggerChange)</span>



# requirejs

The `gremlinjs` module used below with requirejs is part of the `gremlin.min.js`. Tell requirejs where to find it with
the `path` configuration option.

    require.config({
        paths: {
            "gremlinjs": "js/gremlin.min"
        }
    });


# Loader

## Getting Loader instances
The gremlins won't be processed by simply including the script. You have to use the loader for that.

<span id="getloader" class="module-member">gremlinjs.**getLoader**(String **namespace** = "", String **cssClass** = "gremlin") : loader</span>

Creates, or returns an existing, gremlin loader instance. Loader instances should **always** be created this way. It's
the only reliable way to create a single loader instance for a namespace/css class combination

<table>
<tr>
<td class="property-name">namespace</td>
<td>The namespace tells Gremlinjs/requirejs where to look for the gremlin files. The parameter is optional and empty
    by default.</td>
</tr>
<tr>
<td class="property-name">cssClass</td>
<td>GremlinJS uses a css class to find your gremlins inside the dom. The parameter is optional and *gremlin* by default.</td>
</tr>
</table>

##### Example
    require(["gremlinjs"], function (gremlinjs) {
        var loader = gremlinjs.getLoader("public/gremlins/", "gremlin");
    });

You may ask yourself why an extra css class is needed and GremlinJS doesn't use the gremlin-name attribute to find them.
The answer is easy: speed. Modern browsers give you a native `getElementsByClassname()` method. Finding dom elements by attributes
is much slower.

**Take care not to use css classes for loader instances more than once. This will not work and throw an exception**

## the loader instance
<span id="loading-gremlins" class="module-member">method \<loader\>.**load(**jquery **parent** = jQuery('body') )</span>

Loads all the loader's gremlins.

<table>
<tr>
<td class="property-name">parent</td>
<td>Optional jquery-element to search the gremlins in. If you know where the new gremlins can be found, use this
parameter. It's faster than traversing the whole dom.
<br />
If you omit this parameter, the complete document will be searched.
</td>
</tr>
</table>

##### Example
    require(["gremlinjs"], function (gremlinjs) {
        var loader = gremlinjs.getLoader("public/gremlins/", "gremlin");
        loader.load();
    });

<span id="lazy-load-gremlins" class="module-member">method \<loader\>.**resetLazyGremlins()**</span>

Using lazy loading for gremlins can be tricky when the HTML changes. Call this method to recalculate the lazy loading
offsets for the remaining gremlins.

##### Example
    require(["gremlinjs"], function (gremlinjs) {
        var loader = gremlinjs.getLoader("public/gremlins/", "gremlin");
        loader.load();
        //html changed
        loader.resetLazyGremlins();
    });



# Gremlins
GremlinJS is all about Gremlins. Whenever you have the feeling there is something that uses javascript create one

* Need a custom select box? Create a `SelectBox` gremlin
* Need a fancy tooltip? Create a `Tooltip` gremlin
* Need a fancy something? Create a `Something` gremlin

I think it's clear when to create gremlins: **always**

## HTML

Every HTML element is a possible gremlin.

Add a unique css class and a name via the `data-gremlin-name` attribute to it and you are done.

##### Example

    <div class="gremlin" data-gremlin-name="HelloWorld">
        <span>Loading Gremlin...</span>
    </div>

### Multiple gremlins per element

If you want to use multiple gremlins with a single html element, seperate the gremlin names by `,`

       <div class="gremlin" data-gremlin-name="Foo,Bar">
           <span>Loading Gremlin...</span>
       </div>

### Lazy Loading

If you want GremlinJS to load a gremlin not before it's visible, add the `data-lazy-load` parameter
set `true` to the gremlins HTML.

    <div class="gremlin" data-gremlin-name="HelloWorld" data-lazy-load="true">
        <span>Loading Gremlin if it's visible...</span>
    </div>

## Gremlin creation

<span id="create" class="module-member">gremlinjs.**create**(String **name**, Object **mixin**) : AbstractGremlin</span>

Creates a gremlin class. It does **not** create an instance!
`gremlinjs.create` is a shortcut to [GremlinLair#create](https://github.com/grmlin/gremlinjs/blob/master/src/gremlinjs/gremlins/GremlinLair.coffee#L12).

It creates and returns a new class inherited from [AbstractGremlin](https://github.com/grmlin/gremlinjs/blob/master/src/gremlinjs/gremlins/GremlinLair.coffee#L44-L114) and
mixes **mixin** into the new class' prototype.

<table>
<tr>
<td class="property-name">name</td>
<td>Pass a name into the create method. The name will be used for debugging/logging.
</td>
</tr>
<tr>
<td class="property-name">mixin</td>
<td>The mixin describes your gremlin and may come with any property you need.

    However, there are some predefined properties used by the AbstractGremlin the new gremlin inherits from, you should be aware of.
    </td>
</tr>
</table>

##### Example

    define(['gremlinjs'], function (gremlinjs) {
        var HelloWorld = gremlinjs.create("HelloWorld", {
            initialize:function () {
                this.view.html("<h1>Hello World!</h1>");
            }
        });
        return HelloWorld;
    });

## Initialization / pseudo constructor
<span id="initialize" class="module-member">method \<gremlin\>.**initialize()**</span>

initialize() will always be called automatically when a gremlin is instantiated. Use it as your gremlins constructor.

##### Example

     var HelloWorld = gremlinjs.create("HelloWorld", {
        initialize:function () {
            //do constructor work here
        }
    });

## jQuery toolkit

<span id="view" class="module-member">jQuery \<gremlin\>.**view**</span> <sup class="read-only">read-only</sup>

jQuery object of the gremlin's dom element

##### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        initialize:function () {
            this.view.html("Hello World!");
        }
    });

<span id="events" class="module-member">Object \<gremlin\>.**events**</span>

A simple way to delegate jQuery event handler to the gremlins instance or it's children within it's context.

The events object has to be of this format: `{'String "instanceMethod"':'String "eventType selector'}`, where the method
has to reference an instance method of this class.

##### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        events: {
            "handleClick": "click div.content h1"
        }
        handleClick:function () {
            alert("ouch");
        }
    });

Omitting the target selector, the gremlin's main dom element (`this.view`) will be used as a target

    var HelloWorld = gremlinjs.create("HelloWorld", {
        events: {
            "handleClick": "click"
        }
        handleClick:function () {
            alert("ouch");
        }
    });


<span id="elements" class="module-member">Object \<gremlin\>.**elements**</span>

Similar to the events object you can define jQuery elements in this object. It must have the format `{'String instanceMember':'String selector'}`.

##### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        elements: {
            "content":"div.content"
        }
        initialize:function () {
            content.html("Hello World!");
        }
    });

## Setting Gremlin Options
<span id="data" class="module-member">Object \<gremlin\>.**data**</span> <sup class="read-only">read-only</sup>

Every gremlin automatically provides data-attributes to it's instance with the [`data`](#gremlin.data) property.
All custom data-attributes you add to your gremlins tag can be found in there.

##### Example
    <div class="gremlin" data-gremlin-name="HelloWorld" data-foo="bar">
        <span>Loading Gremlin...</span>
    </div>


    var HelloWorld = gremlinjs.create("HelloWorld", {
        initialize:function () {
            console.log(this.data.foo);//bar
        }
    });

see [jQuery API](http://api.jquery.com/data/#data-html5) for more details

## Notifications

Inspired by the notifications used in PureMVC, gremlin instances can trigger and catch notifications/events. This is build
in and all you have to do is:

* define interests, events the gremlin will be informed of
* implement the inform-method called when notifications are incoming
* trigger the chatter-method if your gremlin has something to say

<span id="interests" class="module-member">Array \<gremlin\>.**interests**</span>

List of all interests. If any gremlin triggers on of the events in the list, `inform` will be called.

##### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        interests: ["FOO", "BAR"]
     });

<span id="chatter" class="module-member">method \<gremlin\>.**chatter**(String **interest**, Object **notificationData** = {})</span> <sup class="read-only">read-only</sup>

Publish an event/interest/notification. The method expects the interest and an optional notification data object.

<table>
<tr>
<td class="property-name">interest</td>
<td>
    The interest type. All gremlins with this interest type in their interests list will be informed.
</td>
</tr>
<tr>
<td class="property-name">notificationData</td>
<td>
    Optional event data
</td>
</tr>
</table>


##### Example
    initialize:function () {
        this.chatter("OUCH",{foo:"bar"});
    }

<span id="inform" class="module-member">method \<gremlin\>.**inform**(**interest**, **notificationData**)</span>

`inform` is called, when a gremlin in the site published a notification, the gremlin is interested in (see `interests`)

Both the interest and the notification data are  passed into the inform method.

<table>
<tr>
<td class="property-name">interest</td>
<td>
    The interest type..
</td>
</tr>
<tr>
<td class="property-name">notificationData</td>
<td>
    Event data
</td>
</tr>
</table>

##### Example

    var HelloWorld = gremlinjs.create("HelloWorld", {
        interests: ["FOO", "BAR"]
        inform:function (interest, data) {
            switch (interest) {
                case "FOO":
                    console.log("FOO");
                    break;
                calse "BAR":
                    console.log("BAR");
                    break;
                default:
                    break;
            }
        }
    });


## MISC
<span id="id" class="module-member">Number \<gremlin\>.**id**</span> <sup class="read-only">read-only</sup>

A unique ID bound to every gremlin. This ID stays unique through multiple Loader instances.
IDs may be useful, if you have to add an dynamically generated ID to the dom element.

##### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        initialize:function () {
           this.view.attr("id",this.id);
        }
    });

<span id="triggerChange" class="module-member">method \<gremlin\>.**triggerChange()**</span>

Call this method if you changed the HTML of the gremlin and new gremlins may appear in it.

The Loader will scan inside the gremlin for new gremlins. **Don't call the loader directly!**

##### Example
    var HelloWorld = gremlinjs.create("HelloWorld", {
        events: {
            "handleClick": "click"
        }
        handleClick:function () {
            this.view.html(content);
            this.triggerChange();
        }
    });

