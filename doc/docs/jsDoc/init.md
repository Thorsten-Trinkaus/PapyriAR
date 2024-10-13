# init.js 

## Functions

<dl><dt><a href="#getQueryParameter">getQueryParameter(name)</a> ⇒ <code>string</code> | <code>null</code></dt><dd><p>Retrieves the value of a query parameter from the URL.</p></dd><dt><a href="#init">init()</a> ⇒ <code>void</code></dt><dd><p>This function is called by the onload function of the body.The function initializes all the needed parts for the scene to be fully functional. It tries to fetch meta and DDB XML-files and extracts the needed data from them. The Identifier for the meta file and theeScriptorium data are extracted from the query parameter <code>page</code>. For this towork the query parameter needs to be of form metaIdentifier_eScriptData,where the eScriptData should be of form maxWidth_maxHeight_widthOfLine1!xPos1!yPos1!angleOfLine1_...If the function fails to fetch the meta file, the function errorState iscalled with caught error. If the function fails to fetch the DDB file orthere eScriptData is empty, the function calls the initScene method ofthe Scene class with only the extracted meta data. If both files aresuccessfully extracted the initScene method is called with meta, DDB andeScriptorium data. If the <code>page</code> parameter is no set, the function callserrorState directly and doesn&#39;t try to fetch any data.</p></dd><dt><a href="#errorState">errorState(errorText)</a> ⇒ <code>void</code></dt><dd><p>This function removes all children from the body and adds a text-element todisplay an error message to the user. This message is also logged to the console. The function should be used if a critical error has occurred, whichcan not be solved and keeps the website from working correctly.</p></dd></dl>

<a name="getQueryParameter"></a>

## getQueryParameter(name) ⇒ <code>string</code> \| <code>null</code>
Retrieves the value of a query parameter from the URL.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>null</code> - The value of the query parameter (`null` 
if the parameter is not found).  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the query parameter. |

**Example**  
```js
// With the URL https://example.com/?user=LetoII
getQueryParameter("user"); 
// Returns "LetoII".
```
<a name="init"></a>

## init() ⇒ <code>void</code>
This function is called by the onload function of the body.
The function initializes all the needed parts for the scene to be fully 
functional. It tries to fetch meta and DDB XML-files and extracts 
the needed data from them. The Identifier for the meta file and the
eScriptorium data are extracted from the query parameter `page`. For this to
work the query parameter needs to be of form metaIdentifier_eScriptData,
where the eScriptData should be of form maxWidth_maxHeight_
widthOfLine1!xPos1!yPos1!angleOfLine1_...
If the function fails to fetch the meta file, the function errorState is
called with caught error. If the function fails to fetch the DDB file or
there eScriptData is empty, the function calls the initScene method of
the Scene class with only the extracted meta data. If both files are
successfully extracted the initScene method is called with meta, DDB and
eScriptorium data. If the `page` parameter is no set, the function calls
errorState directly and doesn't try to fetch any data.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
**Example**  
```js
// With the query parameter 
"2033" 
// the function tries to fetch the meta-XML
// With Identifier 2033 and calls 
Scene.initScene(metaData);
// with only the extracted meta data. 
```
**Example**  
```js
// With the query parameter 
"2033_795_1063!401.5!104!0.68_657!405.5!198!0.7"
// the function tries to fetch both files and calls
Scene.initScene(metaData, ddbData, eScriptData);
// with meta, ddb and eScriptorium data.
```
**Example**  
```js
// Without the query parameter the function calls
errorState("NO IDENTIFIER FOUND!");
```
<a name="errorState"></a>

## errorState(errorText) ⇒ <code>void</code>
This function removes all children from the body and adds a text-element to
display an error message to the user. This message is also logged to the 
console. The function should be used if a critical error has occurred, which
can not be solved and keeps the website from working correctly.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  

| Param | Type | Description |
| --- | --- | --- |
| errorText | <code>string</code> | text to be displayed and logged to the console. |

**Example**  
```js
errorState("There is no Papyri with identifier 42!");
// Logs the error message "There is no Papyri with identifier 42!" 
// and displays the message to the user.
```
