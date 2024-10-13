# fetcher.js 

## Functions

<dl><dt><a href="#fetchUrl">fetchUrl(url, options)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt><dd><p>This function tries to fetch a given URL using the fetch API. It either returns a Promise for the response text or throws an error,if the url can&#39;t be fetched.</p></dd><dt><a href="#fetchMeta">fetchMeta(identifier)</a> ⇒ <code>Promise.&lt;Document&gt;</code></dt><dd><p>This function fetches a meta XML file using a given Trismegistos identifier.It constructs a URL from the identifier and fetches the URL with <code>fetchUrl</code>.The file is parsed using <code>DomParser</code> and returned in XML format.If the identifier is not valid, it will throw an error.</p></dd><dt><a href="#fetchDdb">fetchDdb(ddbHybrid)</a> ⇒ <code>Promise.&lt;Document&gt;</code></dt><dd><p>This function fetches a meta XML file using a given hybrid identifier.It constructs a URL from the identifier and fetches the URL with <code>fetchUrl</code>.The file is parsed using <code>DomParser</code> and returned in XML format.</p></dd><dt><a href="#isInteger">isInteger(str)</a> ⇒ <code>boolean</code></dt><dd><p>This function tests if a given string is an integer or not and returnsa boolean value.</p></dd></dl>

<a name="fetchUrl"></a>

## fetchUrl(url, options) ⇒ <code>Promise.&lt;string&gt;</code>
This function tries to fetch a given URL using the fetch API. 
It either returns a Promise for the response text or throws an error,
if the url can't be fetched.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise for the fetched data text.  
**Throws**:

- <code>Error</code> Throws an error if the URL can't be fetched for some reason.


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Url to be fetched. |
| options | <code>Object</code> | Optional fetch options. |

**Example**  
```js
fetchUrl("https://spoo.me/", {
 method: "POST",
 headers: {
  "Content-Type": "application/x-www-form-urlencoded",
  "Accept": "application/json",
 },
 body: new URLSearchParams({url: "example.com"})
}).then(data => {
 console.log(data);
}).catch(error => {
 console.error(error);
});
```
**Example**  
```js
fetchUrl("https://example.com/").then(d => {}).catch(e => {});
```
<a name="fetchMeta"></a>

## fetchMeta(identifier) ⇒ <code>Promise.&lt;Document&gt;</code>
This function fetches a meta XML file using a given Trismegistos identifier.
It constructs a URL from the identifier and fetches the URL with `fetchUrl`.
The file is parsed using `DomParser` and returned in XML format.
If the identifier is not valid, it will throw an error.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Document&gt;</code> - Promise resolving to the wanted XML file.  
**Throws**:

- <code>Error</code> Throws an error if the identifier is not valid or if an
error occurs while fetching the URL.


| Param | Type | Description |
| --- | --- | --- |
| identifier | <code>string</code> | Trismegistos identifier for the file to fetch. |

**Example**  
```js
const xml = fetchMeta("1").then(metaXml => {}).catch(e => {});
```
<a name="fetchDdb"></a>

## fetchDdb(ddbHybrid) ⇒ <code>Promise.&lt;Document&gt;</code>
This function fetches a meta XML file using a given hybrid identifier.
It constructs a URL from the identifier and fetches the URL with `fetchUrl`.
The file is parsed using `DomParser` and returned in XML format.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Document&gt;</code> - Promise resolving to the wanted XML file.  
**Throws**:

- <code>Error</code> Throws an error if an error occurs while fetching the URL.


| Param | Type | Description |
| --- | --- | --- |
| ddbHybrid | <code>string</code> | Hybrid identifier for the file to fetch. |

**Example**  
```js
const xml = fetchDdb("psi;4;345").then(ddbXml => {}).catch(e => {});
```
<a name="isInteger"></a>

## isInteger(str) ⇒ <code>boolean</code>
This function tests if a given string is an integer or not and returns
a boolean value.

**Kind**: global function  
**Returns**: <code>boolean</code> - True, if the string is a integer.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to test. |

**Example**  
```js
isInteger("42");
// Output: true.
```
**Example**  
```js
isInteger("I'm an integer.");
// Output: false.
```
