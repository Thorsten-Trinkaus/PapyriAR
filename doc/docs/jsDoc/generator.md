# generator.js 

## Members

<dl><dt><a href="#markerReady">markerReady</a> : <code>boolean</code></dt><dd><p>markerReady - Flag indicating if the marker images (<code>marker0</code> and <code>marker1</code>) are loaded and are ready to use / download.</p></dd><dt><a href="#qrUrl">qrUrl</a> : <code>string</code></dt><dd><p>qrUrl - The full URL of the QR-Code (<code>baseUrl</code> + URL extension).</p></dd><dt><a href="#downloadReady">downloadReady</a> : <code>boolean</code></dt><dd><p>downloadReady - Flag indicating if the <code>qrIm</code> image is loaded and ready to use / download.</p></dd></dl>

## Constants

<dl><dt><a href="#xmlIn">xmlIn</a> : <code>HTMLElement</code></dt><dd><p>The input element for the eScriptorium XML file.</p></dd><dt><a href="#rmXmlBtn">rmXmlBtn</a> : <code>HTMLElement</code></dt><dd><p>The button to remove the uploaded eScriptorium XML file.</p></dd><dt><a href="#dlMarkerBtn">dlMarkerBtn</a> : <code>HTMLElement</code></dt><dd><p>The button to download both marker as a png file.</p></dd><dt><a href="#dlQrBtn">dlQrBtn</a> : <code>HTMLElement</code></dt><dd><p>The button to download the QR-Code as a png file.</p></dd><dt><a href="#dlPdfBtn">dlPdfBtn</a> : <code>HTMLElement</code></dt><dd><p>The button to download both marker andQR-code as a single pdf file.</p></dd><dt><a href="#shortenBtn">shortenBtn</a> : <code>HTMLElement</code></dt><dd><p>The button to shorten the URL to makethe QR-Code more readable.</p></dd><dt><a href="#canvas">canvas</a> : <code>HTMLCanvasElement</code></dt><dd><p>The canvas element to draw the marker and QR-Code to.</p></dd><dt><a href="#ctx">ctx</a> : <code>CanvasRenderingContext2D</code></dt><dd><p>The rendering context of the canvas.</p></dd><dt><a href="#trisIn">trisIn</a> : <code>HTMLElement</code></dt><dd><p>The input element for the Trismegistos identifier.</p></dd><dt><a href="#marker0">marker0</a> : <code>HTMLImageElement</code></dt><dd><p>Image of the marker with value 0.</p></dd><dt><a href="#marker1">marker1</a> : <code>HTMLImageElement</code></dt><dd><p>Image of the marker with value 1.</p></dd><dt><a href="#canvas0">canvas0</a> : <code>HTMLCanvasElement</code></dt><dd><p>Internal canvas for image manipulation.</p></dd><dt><a href="#ctx0">ctx0</a> : <code>CanvasRenderingContext2D</code></dt><dd><p>Rendering context of the internal canvas.</p></dd><dt><a href="#qrIm">qrIm</a> : <code>HTMLImageElement</code></dt><dd><p>Image of the QR-Code.</p></dd><dt><a href="#baseUrl">baseUrl</a> : <code>string</code></dt><dd><p>Base URL for generating the QR-Codes.</p></dd><dt><a href="#xmlList">xmlList</a> : <code>function</code></dt><dd><p>Event listener that binds the <code>xmlIn</code> input change event tothe <code>generateWithXML</code> function.</p></dd><dt><a href="#xmlRem">xmlRem</a> : <code>function</code></dt><dd><p>Event listener that binds the remove eScriptorium XML button click event to the <code>removeXml</code> function.</p></dd><dt><a href="#trisLis">trisLis</a> : <code>function</code></dt><dd><p>Event listener that binds the Trismegistos input event to the <code>generateWithTris</code> function.</p></dd><dt><a href="#resizeLis">resizeLis</a> : <code>function</code></dt><dd><p>Event listener that binds the window resize event to the <code>onResize</code> function.</p></dd><dt><a href="#shortenList">shortenList</a> : <code>function</code></dt><dd><p>Event listener that binds the <code>shortenBtn</code> button onclick event tothe <code>shortenUrl</code> function.</p></dd><dt><a href="#dlMarkerList">dlMarkerList</a> : <code>function</code></dt><dd><p>Event listener that binds the <code>dlMarkerBtn</code> button onclick event tothe <code>downloadMarker</code> function.</p></dd><dt><a href="#dlQrList">dlQrList</a> : <code>function</code></dt><dd><p>Event listener that binds the <code>dlQrBtn</code> button onclick event tothe <code>downloadQR</code> function.</p></dd><dt><a href="#dlPdfList">dlPdfList</a> : <code>function</code></dt><dd><p>Event listener that binds the <code>dlPdfBtn</code> button onclick event tothe <code>downloadPdf</code> function.</p></dd></dl>

## Functions

<dl><dt><a href="#removeXml">removeXml()</a> ⇒ <code>void</code></dt><dd><p>This function removes the uploaded eScriptorium XML from the <code>xmlIn</code> and hides the <code>rmXmlBtn</code>. It also resets the <code>trisIn</code>, such that the Trismegistos input can be used again.The function is called automatically by the onclick event listener of the <code>rmXmlBtn</code>.</p></dd><dt><a href="#onResize">onResize()</a> ⇒ <code>void</code></dt><dd><p>This function resizes the <code>canvas</code> and redraws the images to fit the current <code>window</code> size. The function prevents the <code>canvas</code> from getting tobig / small when resizing the <code>window</code>.The function is called automatically by the resize event listener of the <code>window</code>.</p></dd><dt><a href="#shortenUrl">shortenUrl()</a> ⇒ <code>void</code></dt><dd><p>This function uses the URL shortener spoo.me to shorten the URL and generatea new QR-Code with the new URL. The function is called automatically by the onclick event listener of the <code>shortenBtn</code>. Because this service is not provided by us and has an API limit of 5 calls per minute (50 per hour), it might happen, that this process fails. In this case, the function logs the error to the console, alerts the user and keeps the old QR-Code.</p><p>More information on spoo.me can be found here:<a href="https://github.com/spoo-me/url-shortener">https://github.com/spoo-me/url-shortener</a></p></dd><dt><a href="#generateWithTris">generateWithTris()</a> ⇒ <code>void</code></dt><dd><p>This function generates the QR-Code using the Trismegistos input (<code>trisIn</code>)and draws the QR-Code to the canvas.The function is called automatically by the input event listener ofthe <code>trisIn</code> input.<code>xmlIn</code>, if present, will always get prioritized. In this case, this function will just clear the value of <code>trisIn</code> on input. If the <code>trisIn</code> input is cleared by the user, this function will set the <code>downloadReady</code> flag to <code>false</code> and call <code>onResize</code> to clear the current QR-Code.</p></dd><dt><a href="#generateWithXML">generateWithXML()</a> ⇒ <code>void</code></dt><dd><p>This function generates the QR-Code using a the eScriptorium XML providedby the user through <code>xmlIn</code>. The function will reset the <code>trisIn</code> input.After that, it parses the file and gathers the neededinformation to construct the URL. The URL is then used to generate theQR-Code and draw it to the canvas.The function is called automatically by the onchange event listener of<code>xmlIn</code>.If there is no file present, the function will call <code>removeXml</code>. This isdone, such that the Trismegistos input is enabled again after the usercancels a XML selection.</p></dd><dt><a href="#stringToNumberArray">stringToNumberArray(str)</a> ⇒ <code>Array.&lt;number&gt;</code></dt><dd><p>This function converts a space-separated string into an array of numbers.</p></dd><dt><a href="#drawQR">drawQR(url)</a> ⇒ <code>void</code></dt><dd><p>This function takes a URL as string and creates a QR-Code with the givenURL. It saves this QR-Code to the <code>qrIm</code> and draws it to the <code>canvas</code>.If the marker are not ready yet, this will do nothing, so thefunction should always be called after loading the marker images.The function uses the <code>QRCodeStyling</code> function of the qr-code-styling framework.</p><p>For more information on the framework look at:<a href="https://github.com/kozakdenys/qr-code-styling">https://github.com/kozakdenys/qr-code-styling</a></p></dd><dt><a href="#downloadMarker">downloadMarker()</a> ⇒ <code>void</code></dt><dd><p>This function downloads the marker images as PNG files, if the <code>markerReady</code>flag is set to <code>true</code>.The function is called automatically by the onclick event listener of the<code>dlMarkerBtn</code>.</p></dd><dt><a href="#downloadQR">downloadQR()</a> ⇒ <code>void</code></dt><dd><p>This function downloads the QR-Code image as a PNG file, if the <code>downloadReady</code> flag is set to <code>true</code>.The function is called automatically by the onclick event listener of the<code>dlQrBtn</code>.</p></dd><dt><a href="#downloadPdf">downloadPdf()</a> ⇒ <code>void</code></dt><dd><p>This function downloads both marker images and the QR-Code image as a single PDF file, if <code>downloadReady</code> and <code>markerReady</code> are both set to <code>true</code>.  It uses the jspdf framework.The function is called automatically by the onclick event listener of the <code>dlPdfBtn</code>.</p><p>For more information on the framework look at:<a href="https://github.com/parallax/jsPDF">https://github.com/parallax/jsPDF</a></p></dd></dl>

<a name="markerReady"></a>

## markerReady : <code>boolean</code>
markerReady - Flag indicating if the marker images (`marker0` and `marker1`) are loaded and are ready to use / download.

**Kind**: global variable  
<a name="qrUrl"></a>

## qrUrl : <code>string</code>
qrUrl - The full URL of the QR-Code (`baseUrl` + URL extension).

**Kind**: global variable  
<a name="downloadReady"></a>

## downloadReady : <code>boolean</code>
downloadReady - Flag indicating if the `qrIm` image is loaded and ready to use / download.

**Kind**: global variable  
<a name="xmlIn"></a>

## xmlIn : <code>HTMLElement</code>
The input element for the 
eScriptorium XML file.

**Kind**: global constant  
<a name="rmXmlBtn"></a>

## rmXmlBtn : <code>HTMLElement</code>
The button to remove the uploaded 
eScriptorium XML file.

**Kind**: global constant  
<a name="dlMarkerBtn"></a>

## dlMarkerBtn : <code>HTMLElement</code>
The button to download both marker 
as a png file.

**Kind**: global constant  
<a name="dlQrBtn"></a>

## dlQrBtn : <code>HTMLElement</code>
The button to download the QR-Code 
as a png file.

**Kind**: global constant  
<a name="dlPdfBtn"></a>

## dlPdfBtn : <code>HTMLElement</code>
The button to download both marker and
QR-code as a single pdf file.

**Kind**: global constant  
<a name="shortenBtn"></a>

## shortenBtn : <code>HTMLElement</code>
The button to shorten the URL to make
the QR-Code more readable.

**Kind**: global constant  
<a name="canvas"></a>

## canvas : <code>HTMLCanvasElement</code>
The canvas element to draw the 
marker and QR-Code to.

**Kind**: global constant  
<a name="ctx"></a>

## ctx : <code>CanvasRenderingContext2D</code>
The rendering context 
of the canvas.

**Kind**: global constant  
<a name="trisIn"></a>

## trisIn : <code>HTMLElement</code>
The input element for the 
Trismegistos identifier.

**Kind**: global constant  
<a name="marker0"></a>

## marker0 : <code>HTMLImageElement</code>
Image of the marker with value 0.

**Kind**: global constant  
<a name="marker1"></a>

## marker1 : <code>HTMLImageElement</code>
Image of the marker with value 1.

**Kind**: global constant  
<a name="canvas0"></a>

## canvas0 : <code>HTMLCanvasElement</code>
Internal canvas for 
image manipulation.

**Kind**: global constant  
<a name="ctx0"></a>

## ctx0 : <code>CanvasRenderingContext2D</code>
Rendering context of the 
internal canvas.

**Kind**: global constant  
<a name="qrIm"></a>

## qrIm : <code>HTMLImageElement</code>
Image of the QR-Code.

**Kind**: global constant  
<a name="baseUrl"></a>

## baseUrl : <code>string</code>
Base URL for generating the QR-Codes.

**Kind**: global constant  
<a name="xmlList"></a>

## xmlList : <code>function</code>
Event listener that binds the `xmlIn` input change event to
the `generateWithXML` function.

**Kind**: global constant  
<a name="xmlRem"></a>

## xmlRem : <code>function</code>
Event listener that binds the remove eScriptorium XML 
button click event to the `removeXml` function.

**Kind**: global constant  
<a name="trisLis"></a>

## trisLis : <code>function</code>
Event listener that binds the Trismegistos input event to 
the `generateWithTris` function.

**Kind**: global constant  
<a name="resizeLis"></a>

## resizeLis : <code>function</code>
Event listener that binds the window resize event to 
the `onResize` function.

**Kind**: global constant  
<a name="shortenList"></a>

## shortenList : <code>function</code>
Event listener that binds the `shortenBtn` button onclick event to
the `shortenUrl` function.

**Kind**: global constant  
<a name="dlMarkerList"></a>

## dlMarkerList : <code>function</code>
Event listener that binds the `dlMarkerBtn` button onclick event to
the `downloadMarker` function.

**Kind**: global constant  
<a name="dlQrList"></a>

## dlQrList : <code>function</code>
Event listener that binds the `dlQrBtn` button onclick event to
the `downloadQR` function.

**Kind**: global constant  
<a name="dlPdfList"></a>

## dlPdfList : <code>function</code>
Event listener that binds the `dlPdfBtn` button onclick event to
the `downloadPdf` function.

**Kind**: global constant  
<a name="removeXml"></a>

## removeXml() ⇒ <code>void</code>
This function removes the uploaded eScriptorium XML from the `xmlIn` 
and hides the `rmXmlBtn`. It also resets the `trisIn`, such that the 
Trismegistos input can be used again.
The function is called automatically by the onclick event listener of 
the `rmXmlBtn`.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
<a name="onResize"></a>

## onResize() ⇒ <code>void</code>
This function resizes the `canvas` and redraws the images to fit the 
current `window` size. The function prevents the `canvas` from getting to
big / small when resizing the `window`.
The function is called automatically by the resize event listener 
of the `window`.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
<a name="shortenUrl"></a>

## shortenUrl() ⇒ <code>void</code>
This function uses the URL shortener spoo.me to shorten the URL and generate
a new QR-Code with the new URL. The function is called automatically by the 
onclick event listener of the `shortenBtn`. 
Because this service is not provided by us and has an API limit of 5 calls 
per minute (50 per hour), it might happen, that this process fails. In this 
case, the function logs the error to the console, alerts the user and keeps 
the old QR-Code.

More information on spoo.me can be found here:
[https://github.com/spoo-me/url-shortener](https://github.com/spoo-me/url-shortener)

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
<a name="generateWithTris"></a>

## generateWithTris() ⇒ <code>void</code>
This function generates the QR-Code using the Trismegistos input (`trisIn`)
and draws the QR-Code to the canvas.
The function is called automatically by the input event listener of
the `trisIn` input.
`xmlIn`, if present, will always get prioritized. In 
this case, this function will just clear the value of `trisIn` on input. If 
the `trisIn` input is cleared by the user, this function will set the 
`downloadReady` flag to `false` and call `onResize` to clear the current 
QR-Code.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
<a name="generateWithXML"></a>

## generateWithXML() ⇒ <code>void</code>
This function generates the QR-Code using a the eScriptorium XML provided
by the user through `xmlIn`. The function will reset the `trisIn` input.
After that, it parses the file and gathers the needed
information to construct the URL. The URL is then used to generate the
QR-Code and draw it to the canvas.
The function is called automatically by the onchange event listener of
`xmlIn`.
If there is no file present, the function will call `removeXml`. This is
done, such that the Trismegistos input is enabled again after the user
cancels a XML selection.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
<a name="stringToNumberArray"></a>

## stringToNumberArray(str) ⇒ <code>Array.&lt;number&gt;</code>
This function converts a space-separated string into an array of numbers.

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - - Array of numbers.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to convert. |

**Example**  
```js
stringToNumberArray("40 3 1 23");
// This will return [40, 3, 1, 23].
```
<a name="drawQR"></a>

## drawQR(url) ⇒ <code>void</code>
This function takes a URL as string and creates a QR-Code with the given
URL. It saves this QR-Code to the `qrIm` and draws it to the `canvas`.
If the marker are not ready yet, this will do nothing, so the
function should always be called after loading the marker images.
The function uses the `QRCodeStyling` function of the qr-code-styling 
framework.

For more information on the framework look at:
[https://github.com/kozakdenys/qr-code-styling](https://github.com/kozakdenys/qr-code-styling)

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to generate a QR-Code for. |

<a name="downloadMarker"></a>

## downloadMarker() ⇒ <code>void</code>
This function downloads the marker images as PNG files, if the `markerReady`
flag is set to `true`.
The function is called automatically by the onclick event listener of the
`dlMarkerBtn`.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
<a name="downloadQR"></a>

## downloadQR() ⇒ <code>void</code>
This function downloads the QR-Code image as a PNG file, if the 
`downloadReady` flag is set to `true`.
The function is called automatically by the onclick event listener of the
`dlQrBtn`.

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
<a name="downloadPdf"></a>

## downloadPdf() ⇒ <code>void</code>
This function downloads both marker images and the QR-Code image as a 
single PDF file, if `downloadReady` and `markerReady` are both set to 
`true`.  It uses the jspdf framework.
The function is called automatically by the onclick event listener 
of the `dlPdfBtn`.

For more information on the framework look at:
[https://github.com/parallax/jsPDF](https://github.com/parallax/jsPDF)

**Kind**: global function  
**Returns**: <code>void</code> - This function does not return anything.  
