# scene.js 

## Classes

<dl><dt><a href="#Scene">Scene</a></dt><dd><p>The Scene class is responsible for managing the scene state and displayingmeta and DDB data. It uses a singleton pattern, ensuring only one instanceis ever created. It supports initializing the scene with meta and optionally with DDB and eScriptorium data through the method initScene. This method is the only way to create an object of this class and can also only be called once. There is no way to access the instance of this class directly, but it can be interacted with through the static methods.If the instance is initialized with meta, DDB and eScriptorium data, thescene can toggle between displaying meta and DDB data using checkboxes, displayed over the actual scene.</p></dd></dl>

## Functions

<dl><dt><a href="#setAttributes">setAttributes(element, attributes)</a> ⇒ <code>void</code></dt><dd><p>This function sets multiple attributes for a given HTMLElement.</p></dd></dl>

## Typedefs

<dl><dt><a href="#StringPair">StringPair</a> : <code>Array.&lt;string&gt;</code></dt><dd><p>A tuple containing two strings, e.g., [&quot;hello&quot;, &quot;there&quot;].</p></dd></dl>

<a name="Scene"></a>

## Scene
The Scene class is responsible for managing the scene state and displaying
meta and DDB data. It uses a singleton pattern, ensuring only one instance
is ever created. It supports initializing the scene with meta and optionally 
with DDB and eScriptorium data through the method initScene. This method is 
the only way to create an object of this class and can also only be called 
once. There is no way to access the instance of this class directly, but it 
can be interacted with through the static methods.
If the instance is initialized with meta, DDB and eScriptorium data, the
scene can toggle between displaying meta and DDB data using checkboxes, 
displayed over the actual scene.

**Kind**: global class  
**Singleton**:   

* [Scene](#Scene)
    * [new Scene(meta, ddb, eScript)](#new_Scene_new)
    * _instance_
        * [.buildMeta()](#Scene+buildMeta) ⇒ <code>void</code>
        * [.buildDdb()](#Scene+buildDdb) ⇒ <code>void</code>
    * _static_
        * [.initScene(meta, ddb, eScript)](#Scene.initScene) ⇒ <code>void</code>
        * [.update(newDist)](#Scene.update) ⇒ <code>void</code>

<a name="new_Scene_new"></a>

### new Scene(meta, ddb, eScript)
Constructor for the Scene class. It is private and cannot be called 
directly. Use Scene.initScene() to create the instance.

**Throws**:

- <code>TypeError</code> Throws an error if this is called without the 
`#isConstructing` flag being set.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| meta | [<code>Array.&lt;StringPair&gt;</code>](#StringPair) |  | Meta data to display in  the scene. |
| ddb | <code>string</code> | <code>null</code> | Optional DDB data to display. |
| eScript | <code>Array.&lt;string&gt;</code> | <code></code> | Optional eScriptorium data for  positioning. |

**Example**  
```js
const scene = new Scene(metaData);
```
**Example**  
```js
const scene = new Scene(metaData, ddbData, eScriptData);
```
<a name="Scene+buildMeta"></a>

### scene.buildMeta() ⇒ <code>void</code>
This method builds up the scene by adding the meta data as text. The
method first constructs the text and then adds a `TextBox` element to
the data marker of the `AScene` instance.

**Kind**: instance method of [<code>Scene</code>](#Scene)  
**Returns**: <code>void</code> - This method does not return anything.  
<a name="Scene+buildDdb"></a>

### scene.buildDdb() ⇒ <code>void</code>
This method builds up the scene by adding every DDB data line as text. 
The method first constructs the text and then adds one `TextBox` element
for each line to the data marker of the `AScene` instance.

**Kind**: instance method of [<code>Scene</code>](#Scene)  
**Returns**: <code>void</code> - This method does not return anything.  
<a name="Scene.initScene"></a>

### Scene.initScene(meta, ddb, eScript) ⇒ <code>void</code>
This method initializes the scene by calling the constructor
after setting the `#isConstructing` flag. The method should
only be called once and won't do anything if there is an instance
of the `Scene` class already.
Meta data should have the form 
[ [name, text], [name2, text2], ... ].
DDB data should have the form 
"line1 \n line2 \n ...".
eScriptorium data should have the form
[
     "Trismegistos identifier", 
     "maxWidth", 
     "maxHeight", 
     "line1Width!line1X!line1Y!line1Angle", 
     line2, ...
].

**Kind**: static method of [<code>Scene</code>](#Scene)  
**Returns**: <code>void</code> - This method does not return anything.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| meta | [<code>Array.&lt;StringPair&gt;</code>](#StringPair) |  | Meta data to display in  the scene. |
| ddb | <code>string</code> | <code>null</code> | Optional DDB data to display. |
| eScript | <code>Array.&lt;string&gt;</code> | <code></code> | Optional eScriptorium data for  positioning. |

**Example**  
```js
Scene.initScene(metaData);
```
**Example**  
```js
Scene.initScene(metaData, ddbData, eScriptData);
```
<a name="Scene.update"></a>

### Scene.update(newDist) ⇒ <code>void</code>
This method is static and can be called to update the scene with a new
distance between the two marker of the scene.

**Kind**: static method of [<code>Scene</code>](#Scene)  
**Returns**: <code>void</code> - This method does not return anything.  
**Throws**:

- <code>Error</code> Will throw an error if there is no `Scene` instance.


| Param | Type | Description |
| --- | --- | --- |
| newDist | <code>number</code> | New Distance. |

<a name="setAttributes"></a>

## setAttributes(element, attributes) ⇒ <code>void</code>
This function sets multiple attributes for a given HTMLElement.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 
| attributes | <code>Object.&lt;string, string&gt;</code> | 

**Example**  
```js
const div = document.createElement("div");
setAttributes(div, {"text": ":-)", "id": "div0"});
```
<a name="StringPair"></a>

## StringPair : <code>Array.&lt;string&gt;</code>
A tuple containing two strings, e.g., ["hello", "there"].

**Kind**: global typedef  
