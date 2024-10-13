# sceneObjects.js 

## Classes

<dl><dt><a href="#Element">Element</a></dt><dd><p>This class is designed to represent a <code>a-entity</code> element of given type from the <a href="https://aframe.io/">AFrame framework</a>, but it can also handle any normal HTML element type. The main idea behind this class is to provide a easy way to handle <code>a-entity</code> elements and to create a base class for more specific <code>a-entity</code> types. The methods of this class are modeled after real HTML operations, so elements of this class can still be used just like any HTML element, while allowingthe possibility of additional operations.</p></dd><dt><a href="#AScene">AScene</a></dt><dd><p>This class represents a singleton <code>a-scene</code> element for use in the AR.jscontext. This will extend the basic <code>Element</code> class.The class is responsible for setting up the needed markers and managing updates to the <code>a-scene</code>.</p><p>This extends the class Element.</p></dd><dt><a href="#AMarker">AMarker</a></dt><dd><p>This class represents a <code>a-marker</code> element for use in the AR.js context.The marker will always be of type &quot;barcode&quot;.This is the heart of the scene and all other elements need to be connectedto a marker, for them to be visible in the scene.</p><p>For more information about barcode markers and possible values look at:<a href="https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection/tree/master">Marker</a></p><p>This extends the class Element.</p></dd><dt><a href="#TextBox">TextBox</a></dt><dd><p>This class represents a <code>a-entity</code> element with a plane geometry and textcomponent. Text added to the scene should be added as <code>TextBox</code> elements.</p><p>This extends the class Element.</p></dd></dl>

<a name="Element"></a>

## Element
This class is designed to represent a `a-entity` element of given type 
from the [AFrame framework](https://aframe.io/), 
but it can also handle any normal HTML element type. The main idea behind 
this class is to provide a easy way to handle `a-entity` elements and 
to create a base class for more specific `a-entity` types. The methods of 
this class are modeled after real HTML operations, so elements of 
this class can still be used just like any HTML element, while allowing
the possibility of additional operations.

**Kind**: global class  
**See**

- AScene for a specialized `a-scene` element.
- AMarker for a specialized `a-marker` element.
- TextBox for a specialized `a-entity` element, 
which implements text content in the scene.


* [Element](#Element)
    * [new Element(type)](#new_Element_new)
    * [.type](#Element+type) : <code>string</code>
    * [.element](#Element+element) : <code>HTMLElement</code>
    * [.parent](#Element+parent) : [<code>Element</code>](#Element)
    * [.children](#Element+children) : <code>Map.&lt;string, Array.&lt;Element&gt;&gt;</code>
    * [.appendChild(child)](#Element+appendChild) ⇒ [<code>Element</code>](#Element)
    * [.clear()](#Element+clear) ⇒ <code>void</code>
    * [.setAttribute(key, value)](#Element+setAttribute) ⇒ [<code>Element</code>](#Element)
    * [.setAttributes(attributes)](#Element+setAttributes) ⇒ [<code>Element</code>](#Element)
    * [.getAttribute(key)](#Element+getAttribute) ⇒ <code>string</code>

<a name="new_Element_new"></a>

### new Element(type)
Create a instance of the `Element` class.


| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of element to create. |

**Example**  
```js
const marker = new Element("a-marker");
```
<a name="Element+type"></a>

### element.type : <code>string</code>
The type of the element.

**Kind**: instance property of [<code>Element</code>](#Element)  
<a name="Element+element"></a>

### element.element : <code>HTMLElement</code>
The actual HTML element.

**Kind**: instance property of [<code>Element</code>](#Element)  
<a name="Element+parent"></a>

### element.parent : [<code>Element</code>](#Element)
The parent element, if there is one.

**Kind**: instance property of [<code>Element</code>](#Element)  
<a name="Element+children"></a>

### element.children : <code>Map.&lt;string, Array.&lt;Element&gt;&gt;</code>
A map of all the children for this element, keyed by their type.

**Kind**: instance property of [<code>Element</code>](#Element)  
<a name="Element+appendChild"></a>

### element.appendChild(child) ⇒ [<code>Element</code>](#Element)
This method appends a child element to this element. The child
needs to be an instance of the `Element` class too.

**Kind**: instance method of [<code>Element</code>](#Element)  
**Returns**: [<code>Element</code>](#Element) - Returns the appended child.  
**Throws**:

- <code>TypeError</code> Will throw an error, if the child is no instance
of the `Element` class.


| Param | Type | Description |
| --- | --- | --- |
| child | [<code>Element</code>](#Element) | The child element. |

**Example**  
```js
const parent = new Element("a-scene");
const child = new Element("a-marker");
parent.appendChild(child);
```
<a name="Element+clear"></a>

### element.clear() ⇒ <code>void</code>
This method clears all the child elements from this element and also 
removes them from the DOM.

**Kind**: instance method of [<code>Element</code>](#Element)  
**Returns**: <code>void</code> - This method does not return anything.  
**Example**  
```js
const parent = new Element("a-scene");
const child = new Element("a-marker");
parent.clear();
// This removes child from the parent element and the DOM.
```
<a name="Element+setAttribute"></a>

### element.setAttribute(key, value) ⇒ [<code>Element</code>](#Element)
Setter method for a single attribute on the element.

**Kind**: instance method of [<code>Element</code>](#Element)  
**Returns**: [<code>Element</code>](#Element) - Returns the the current element for method chaining.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the attribute. |
| value | <code>string</code> | The value to set. |

**Example**  
```js
const sun = new Element("a-entity");
sun.setAttribute("pros", "life").setAttribute("cons", "deadly laser");
// This will set the two attributes "pros" and "cons".
```
<a name="Element+setAttributes"></a>

### element.setAttributes(attributes) ⇒ [<code>Element</code>](#Element)
Setter method for multiple attributes on the element at once.

**Kind**: instance method of [<code>Element</code>](#Element)  
**Returns**: [<code>Element</code>](#Element) - Returns the the current element for method chaining.  

| Param | Type | Description |
| --- | --- | --- |
| attributes | <code>Object.&lt;string, string&gt;</code> | Object, where each key is an attribute name, and the corresponding value is the value of the attribute. |

**Example**  
```js
const sun = new Element("a-entity");
sun.setAttributes({
 "pros": "life",
 "cons": "deadly laser"
});
// This will set two attributes "pros" and "cons".
```
<a name="Element+getAttribute"></a>

### element.getAttribute(key) ⇒ <code>string</code>
Getter method for the value of an attribute on the element.

**Kind**: instance method of [<code>Element</code>](#Element)  
**Returns**: <code>string</code> - The value of the attribute or `null`, if the
attribute does not exist.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The name of the attribute. |

**Example**  
```js
const universe = new Element("a-entity");
universe.setAttribute("answer", "42");
console.log(element.getAttribute("answer"));
// This will output "42".
console.log(element.getAttribute("question"));
// This will output "null"!
```
<a name="AScene"></a>

## AScene
This class represents a singleton `a-scene` element for use in the AR.js
context. This will extend the basic `Element` class.
The class is responsible for setting up the needed markers and managing 
updates to the `a-scene`.

This extends the class Element.

**Kind**: global class  
**Singleton**:   
**See**: Element for the base class.  

* [AScene](#AScene)
    * [new AScene()](#new_AScene_new)
    * _instance_
        * [.update()](#AScene+update) ⇒ <code>void</code>
        * [.clear()](#AScene+clear) ⇒ <code>void</code>
    * _static_
        * [.getInstance()](#AScene.getInstance) ⇒ [<code>AScene</code>](#AScene)
        * [.removeInstance()](#AScene.removeInstance) ⇒ <code>void</code>
        * [.getDataMarker()](#AScene.getDataMarker) ⇒ [<code>AMarker</code>](#AMarker)

<a name="new_AScene_new"></a>

### new AScene()
Private constructor, such that this can not be directly instantiated.
Throws an error if this is called outside of `getInstance`.

**Throws**:

- <code>TypeError</code> Will throw an error, if attempting to instantiate 
directly.

<a name="AScene+update"></a>

### aScene.update() ⇒ <code>void</code>
Update method for recalculating the distance and triggering updates 
in the Scene instance. The method is invoked recursively using
`requestAnimationFrame`.

**Kind**: instance method of [<code>AScene</code>](#AScene)  
**Returns**: <code>void</code> - This method does not return anything.  
**See**: Scene for the `Scene` instance.  
<a name="AScene+clear"></a>

### aScene.clear() ⇒ <code>void</code>
This method clears the two marker in the scene.

**Kind**: instance method of [<code>AScene</code>](#AScene)  
**Returns**: <code>void</code> - This method does not return anything.  
<a name="AScene.getInstance"></a>

### AScene.getInstance() ⇒ [<code>AScene</code>](#AScene)
This method returns the singleton instance of the `AScene` class.
If the instance does not exist, create it.

**Kind**: static method of [<code>AScene</code>](#AScene)  
**Returns**: [<code>AScene</code>](#AScene) - The singleton instance.  
<a name="AScene.removeInstance"></a>

### AScene.removeInstance() ⇒ <code>void</code>
This method removes the current singleton instance.

**Kind**: static method of [<code>AScene</code>](#AScene)  
**Returns**: <code>void</code> - This method does not return anything.  
<a name="AScene.getDataMarker"></a>

### AScene.getDataMarker() ⇒ [<code>AMarker</code>](#AMarker)
Getter method for the data marker. If no instance of the `AScene`
class exists, create one.

**Kind**: static method of [<code>AScene</code>](#AScene)  
**Returns**: [<code>AMarker</code>](#AMarker) - The data marker.  
<a name="AMarker"></a>

## AMarker
This class represents a `a-marker` element for use in the AR.js context.
The marker will always be of type "barcode".
This is the heart of the scene and all other elements need to be connected
to a marker, for them to be visible in the scene.

For more information about barcode markers and possible values look at:
[Marker](https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection/tree/master)

This extends the class Element.

**Kind**: global class  
**See**: Element for the base class.  

* [AMarker](#AMarker)
    * [new AMarker(value)](#new_AMarker_new)
    * [.getVisibility()](#AMarker+getVisibility) ⇒ <code>boolean</code>
    * [.highlightMarker(color)](#AMarker+highlightMarker) ⇒ <code>void</code>
    * [.addTextBox(value, width, wrapCount, position, rotation)](#AMarker+addTextBox) ⇒

<a name="new_AMarker_new"></a>

### new AMarker(value)
Create an instance of the `AMarker` class.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | The barcode value of the marker. |

**Example**  
```js
const oh = new AMarker("0");
const hey = new AMarker("1");
const mark = new AMarker("5");
```
<a name="AMarker+getVisibility"></a>

### aMarker.getVisibility() ⇒ <code>boolean</code>
Getter method for the visibility flag of this element, because the
flag is not attached to the element directly.

**Kind**: instance method of [<code>AMarker</code>](#AMarker)  
**Returns**: <code>boolean</code> - Returns the visibility flag.  
<a name="AMarker+highlightMarker"></a>

### aMarker.highlightMarker(color) ⇒ <code>void</code>
The method highlights this marker in the scene, by adding a colored box
on top of the marker.

**Kind**: instance method of [<code>AMarker</code>](#AMarker)  
**Returns**: <code>void</code> - This method does not return anything.  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | The color of the box. |

**Example**  
```js
const marker = new AMarker("1");
marker.highlightMarker("red");
```
**Example**  
```js
const marker = new AMarker("1");
marker.highlightMarker("rgb(255, 0, 100)");
```
<a name="AMarker+addTextBox"></a>

### aMarker.addTextBox(value, width, wrapCount, position, rotation) ⇒
This method creates a `TextBox` element and appends it to this marker.
The `textColor` is set to "black". The `boxColor` is set to "white".
The `boxOpacity`is set to "0.3".

**Kind**: instance method of [<code>AMarker</code>](#AMarker)  
**Returns**: The added `TextBox` element.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | The text value of the `TextBox`. |
| width | <code>string</code> \| <code>number</code> | The width of the text block. |
| wrapCount | <code>string</code> \| <code>number</code> | Number of characters before  wrapping text. |
| position | <code>string</code> | Position of the `TextBox` relative to  the marker position. |
| rotation | <code>string</code> | Rotation around the center of the new  `TextBox` element in dec. |

**Example**  
```js
const marker = new AMarker("1");
marker.addTextBox(
 "Beware of the TextBox-Mimic!", 
 "10", 
 50, 
 "0 1 0.5", 
 "-90 0 10"
);
```
<a name="TextBox"></a>

## TextBox
This class represents a `a-entity` element with a plane geometry and text
component. Text added to the scene should be added as `TextBox` elements.

This extends the class Element.

**Kind**: global class  
**See**: Element for the base class.  

* [TextBox](#TextBox)
    * [new TextBox(value, width, wrapCount, position, rotation, textColor, boxColor, boxOpacity)](#new_TextBox_new)
    * [.changeTextColor(newColor)](#TextBox+changeTextColor) ⇒ [<code>TextBox</code>](#TextBox)
    * [.changeBoxColor(newColor)](#TextBox+changeBoxColor) ⇒ [<code>TextBox</code>](#TextBox)

<a name="new_TextBox_new"></a>

### new TextBox(value, width, wrapCount, position, rotation, textColor, boxColor, boxOpacity)
Create an instance of the `TextBox` class.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | The text value. |
| width | <code>string</code> \| <code>number</code> | The width of the text block. |
| wrapCount | <code>string</code> \| <code>number</code> | Number of characters before  wrapping text. |
| position | <code>string</code> | Relative Position. |
| rotation | <code>string</code> | Rotation around the center. |
| textColor | <code>string</code> | The color of the text. |
| boxColor | <code>string</code> | The color of the box. |
| boxOpacity | <code>string</code> \| <code>number</code> | Opacity of the box. |

**Example**  
```js
const angel = new TextBox(
 "Don't blink!", 
 10, 
 "10", 
 "0 0 -1.3", 
 "-90 10 0", 
 "red", 
 "rgb(0, 0, 0)", 
 0.5
);
```
<a name="TextBox+changeTextColor"></a>

### textBox.changeTextColor(newColor) ⇒ [<code>TextBox</code>](#TextBox)
This method changes the color of the text component.

**Kind**: instance method of [<code>TextBox</code>](#TextBox)  
**Returns**: [<code>TextBox</code>](#TextBox) - Returns the the current element for method chaining.  

| Param | Type | Description |
| --- | --- | --- |
| newColor | <code>string</code> | New color. |

**Example**  
```js
const warning = new TextBox(
 "This is a example!",
 10, 
 "10", 
 "0 0 -1.3", 
 "-90 10 0", 
 "white", 
 "rgb(0, 0, 0)", 
 0.5
);
warning.changeTextColor("red");
```
<a name="TextBox+changeBoxColor"></a>

### textBox.changeBoxColor(newColor) ⇒ [<code>TextBox</code>](#TextBox)
This method changes the color of the plane.

**Kind**: instance method of [<code>TextBox</code>](#TextBox)  
**Returns**: [<code>TextBox</code>](#TextBox) - Returns the current element for method chaining.  

| Param | Type | Description |
| --- | --- | --- |
| newColor | <code>string</code> | new color. |

**Example**  
```js
const text = new TextBox(
 "This is a example!",
 10, 
 "10", 
 "0 0 -1.3", 
 "-90 10 0", 
 "white", 
 "rgb(0, 0, 0)", 
 0.5
);
text.changeTextColor("white").changeBoxColor("black");
// This changes the text from light-mode to dark-mode.
```
