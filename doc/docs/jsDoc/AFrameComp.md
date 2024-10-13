# AFrameComp.js 

## Modules

<dl><dt><a href="#module_calibration">calibration</a></dt><dd><p>This AFrame component can be used to calculate the distance between two <code>a-marker</code> elements. The component, when attached to a <code>a-marker</code> element,gets a query selector as its property. This should be the id of the second<code>a-marker</code>. The <code>tick</code> handler will be called every frame and calculate thedistance between both elements, if both are visible. This distance is then set as an attribute for the element this component is attached to.</p></dd><dt><a href="#module_rounded">rounded</a></dt><dd><p>This AFrame component can be attached to any <code>a-entity</code>element with a plane geometry and text component. The component only consists of a <code>init</code> handler, which uses the dimensions of the text component to change the geometry of the plane, such that its corners are rounded off, while still fitting all of the content. The property of this component is a number andrepresents the radius of the rounded corners.</p></dd></dl>

<a name="module_calibration"></a>

## calibration
This AFrame component can be used to calculate the distance between two 
`a-marker` elements. The component, when attached to a `a-marker` element,
gets a query selector as its property. This should be the id of the second
`a-marker`. The `tick` handler will be called every frame and calculate the
distance between both elements, if both are visible. This distance is then 
set as an attribute for the element this component is attached to.

**Example**  
```js
const mark = document.createElement("a-marker");
const er = document.createElement("a-marker");
er.setAttribute("id", "er");
mark.setAttribute("calibration", "#er");
```
<a name="module_rounded"></a>

## rounded
This AFrame component can be attached to any `a-entity`element with a plane 
geometry and text component. The component only consists of a `init` 
handler, which uses the dimensions of the text component to change the 
geometry of the plane, such that its corners are rounded off, while still 
fitting all of the content. The property of this component is a number and
represents the radius of the rounded corners.

**Example**  
```js
const text = document.createElement("a-entity");
text.addAttribute("geometry", "primitive: plane; width: 0; height: 0;");
text.addAttribute("text", "value: hello world; width: 10;");
text.addAttribute("rounded", "0.1");
```
