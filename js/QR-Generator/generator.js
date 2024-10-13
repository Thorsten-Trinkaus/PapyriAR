//////////////////////////////////////////////////////
// Get all the needed elements and other constants. //
//////////////////////////////////////////////////////

/**
 * @constant {HTMLElement} xmlIn - The input element for the 
 * eScriptorium XML file.
 */
const xmlIn = document.getElementById("xml");

/**
 * @constant {HTMLElement} rmXmlBtn - The button to remove the uploaded 
 * eScriptorium XML file.
 */
const rmXmlBtn = document.getElementById("remove");

/**
 * @constant {HTMLElement} dlMarkerBtn - The button to download both marker 
 * as a png file.
 */
const dlMarkerBtn = document.getElementById("dM");

/**
 * @constant {HTMLElement} dlQrBtn - The button to download the QR-Code 
 * as a png file.
 */
const dlQrBtn = document.getElementById("dQ");

/**
 * @constant {HTMLElement} dlPdfBtn - The button to download both marker and
 * QR-code as a single pdf file.
 */
const dlPdfBtn = document.getElementById("dB");

/**
 * @constant {HTMLElement} shortenBtn - The button to shorten the URL to make
 * the QR-Code more readable.
 */
const shortenBtn = document.getElementById("sB")

/**
 * @constant {HTMLCanvasElement} canvas - The canvas element to draw the 
 * marker and QR-Code to.
 */
const canvas = document.getElementById("image");

/**
 * @constant {CanvasRenderingContext2D} ctx - The rendering context 
 * of the canvas.
 */
const ctx = canvas.getContext("2d");

/**
 * @constant {HTMLElement} trisIn - The input element for the 
 * Trismegistos identifier.
 */
const trisIn = document.getElementById("tris");

/**
 * @constant {HTMLImageElement} marker0 - Image of the marker with value 0.
 */
const marker0 = new Image();

/**
 * @constant {HTMLImageElement} marker1 - Image of the marker with value 1.
 */
const marker1 = new Image();

/**
 * @type {boolean} markerReady - Flag indicating if the marker images 
 * (`marker0` and `marker1`) are loaded and are ready to use / download.
 */
let markerReady = false;

/**
 * @constant {HTMLCanvasElement} canvas0 - Internal canvas for 
 * image manipulation.
 */
const canvas0 = document.createElement("canvas");

/**
 * @constant {CanvasRenderingContext2D} ctx0 - Rendering context of the 
 * internal canvas.
 */
const ctx0 = canvas0.getContext("2d");

/**
 * @constant {HTMLImageElement} qrIm - Image of the QR-Code.
 */
const qrIm = new Image();

/**
 * @constant {string} baseUrl - Base URL for generating the QR-Codes.
 */
const baseUrl = "https://thorsten-trinkaus.github.io/PapyriAR/AR/?data=";

/**
 * @type {string} qrUrl - The full URL of the QR-Code 
 * (`baseUrl` + URL extension).
 */
let qrUrl = "";

/**
 * @type {boolean} downloadReady - Flag indicating if the `qrIm` image is 
 * loaded and ready to use / download.
 */
let downloadReady = false;

/////////////////////////
// Add event listener. //
/////////////////////////

/**
 * Event listener that binds the `xmlIn` input change event to
 * the `generateWithXML` function.
 * @type {Function}
 */
const xmlList = generateWithXML.bind(this);
xmlIn.addEventListener("change", xmlList);

/**
 * Event listener that binds the remove eScriptorium XML 
 * button click event to the `removeXml` function.
 * @type {Function}
 */
const xmlRem = removeXml.bind(this);
rmXmlBtn.addEventListener("click", xmlRem);

/**
 * Event listener that binds the Trismegistos input event to 
 * the `generateWithTris` function.
 * @type {Function}
 */
const trisLis = generateWithTris.bind(this);
trisIn.addEventListener("input", trisLis);

/**
 * Event listener that binds the window resize event to 
 * the `onResize` function.
 * @type {Function}
 */
const resizeLis = onResize.bind(this);
window.addEventListener("resize", resizeLis);

/**
 * Event listener that binds the `shortenBtn` button onclick event to
 * the `shortenUrl` function.
 * @type {Function}
 */
const shortenList = shortenUrl.bind(this);
shortenBtn.addEventListener("click", shortenList);

/**
 * Event listener that binds the `dlMarkerBtn` button onclick event to
 * the `downloadMarker` function.
 * @type {Function}
 */
const dlMarkerList = downloadMarker.bind(this);
dlMarkerBtn.addEventListener("click", dlMarkerList);

/**
 * Event listener that binds the `dlQrBtn` button onclick event to
 * the `downloadQR` function.
 * @type {Function}
 */
const dlQrList = downloadQR.bind(this);
dlQrBtn.addEventListener("click", dlQrList);

/**
 * Event listener that binds the `dlPdfBtn` button onclick event to
 * the `downloadPdf` function.
 * @type {Function}
 */
const dlPdfList = downloadPdf.bind(this);
dlPdfBtn.addEventListener("click", dlPdfList);

/////////////////////////////////////////////////////////////////////////////
// Load the marker images and resize the canvas to fit the current window. //
/////////////////////////////////////////////////////////////////////////////

// Load the image of the marker with value 0. Upon loading the image manipulate
// the image to have a white border around it, which makes the marker more 
// readable for the AR framework.
marker0.src = "0.png";
marker0.onload = function () {

    // Use the internal canvas and its render context to add white borders
    // around the original image.
    canvas0.width = marker0.width + 40;
    canvas0.height = marker0.height + 40;
    ctx0.fillStyle = "#ffffff";
    ctx0.fillRect(0, 0, canvas0.width, canvas0.height);
    ctx0.drawImage(marker0, 20, 20);

    // Load the new image from the internal canvas to the marker image 
    // constant. Upon loading the new image, start loading the image of 
    // the marker with value 1.
    marker0.src = canvas0.toDataURL();
    marker0.onload = function () {

        // Upon loading the second image, also add a border to this image.
        marker1.src = "1.png";
        marker1.onload = function () {
            canvas0.width = marker1.width + 40;
            canvas0.height = marker1.height + 40;
            ctx0.fillStyle = "#ffffff";
            ctx0.fillRect(0, 0, canvas0.width, canvas0.height);
            ctx0.drawImage(marker1, 20, 20);

            // Save the edited version to the marker image constant.
            // Upon loading the final image, change the `markerReady` flag to 
            // `true`, remove the internal canvas and call `onResize()`;
            marker1.src = canvas0.toDataURL();
            marker1.onload = function () {
                markerReady = true;
                canvas0.remove();
                onResize();
            };
        };
    };
};

////////////////
// Functions. //
////////////////

/**
 * This function removes the uploaded eScriptorium XML from the `xmlIn` 
 * and hides the `rmXmlBtn`. It also resets the `trisIn`, such that the 
 * Trismegistos input can be used again.
 * The function is called automatically by the onclick event listener of 
 * the `rmXmlBtn`.
 * 
 * @returns {void} This function does not return anything.
 */
function removeXml() {
    // Clear the value of the `xmlIn` input.
    xmlIn.value = "";
    // Hide the `rmXmlBtn`.
    rmXmlBtn.style.display = "none";
    // Reset `trisIn`.
    trisIn.style.color = "inherit";
    trisIn.setAttribute(
        "placeholder", 
        "Enter the Trismegistos identifier here"
    );
    // Set the `downloadReady` flag to `false`.
    downloadReady = false;
    //Call `onResize`.
    onResize();
}

/**
 * This function resizes the `canvas` and redraws the images to fit the 
 * current `window` size. The function prevents the `canvas` from getting to
 * big / small when resizing the `window`.
 * The function is called automatically by the resize event listener 
 * of the `window`.
 * 
 * @returns {void} This function does not return anything.
 */
function onResize() {
    // Get the new size of the window.
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // Update the height of the `canvas` and calculate the new width of the
    // `canvas` (the aspect ratio of the canvas stays constant).
    canvas.height = maxHeight - 100;
    canvas.width = canvas.height / 3;
    // If the width of the `window` is smaller than its height, it is possible
    // for the canvas to be to big in width. In this case, set the width and 
    // recalculate the height of the `canvas`.
    if (canvas.width > maxWidth / 3 - 100) {
        canvas.width = maxWidth / 3 - 100;
        canvas.height = canvas.width * 3;
    }

    // If `markerReady` is set to `true`, redraw the marker images to the `canvas`.
    if (markerReady) {
        ctx.drawImage(marker0, 0, 0, canvas.width, canvas.height / 3);
        ctx.drawImage(marker1, 0, canvas.height / 3, canvas.width, canvas.height / 3);
    }
    // If `downloadReady` is set to `true`, redraw the QR-Code to the canvas.
    if (downloadReady) {
        ctx.drawImage(qrIm, 0, 2 * canvas.height / 3, canvas.width, canvas.height / 3);
    }
}

/**
 * This function uses the URL shortener spoo.me to shorten the URL and generate
 * a new QR-Code with the new URL. The function is called automatically by the 
 * onclick event listener of the `shortenBtn`. 
 * Because this service is not provided by us and has an API limit of 5 calls 
 * per minute (50 per hour), it might happen, that this process fails. In this 
 * case, the function logs the error to the console, alerts the user and keeps 
 * the old QR-Code.
 * 
 * More information on spoo.me can be found here:
 * {@link https://github.com/spoo-me/url-shortener}
 * 
 * @returns {void} This function does not return anything.
 */
function shortenUrl() {
    // Make sure there is a URL to shorten.
    if (downloadReady) {
        // Set the flag `downloadReady` to `false`.
        downloadReady = false;

        // Fetch the shortened URL and call `drawQR` with the new URL. 
        // If an error is caught, alert the user and log the error to 
        // the console.
        fetchUrl("https://spoo.me/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            body: new URLSearchParams({
                url: qrUrl,
            }),
        }).then((data) => {
            const newUrl = data.split('"')[3];
            // `qrUrl` is updated inside `drawQR`!
            drawQR(newUrl);
        }).catch((error) => {
            console.error(
                "Could not shorten the url. Will use the long one. ", 
                error
            );
            alert(
                "Could not shorten the url. " +
                "Please feel free to try again!"
            );
            // Set the flag `downloadReady` back to `true`.
            downloadReady = true;
        });
    }
}

/**
 * This function generates the QR-Code using the Trismegistos input (`trisIn`)
 * and draws the QR-Code to the canvas.
 * The function is called automatically by the input event listener of
 * the `trisIn` input.
 * `xmlIn`, if present, will always get prioritized. In 
 * this case, this function will just clear the value of `trisIn` on input. If 
 * the `trisIn` input is cleared by the user, this function will set the 
 * `downloadReady` flag to `false` and call `onResize` to clear the current 
 * QR-Code.
 * 
 * @returns {void} This function does not return anything.
 */
function generateWithTris() {
    if (xmlIn.value != "") {
        trisIn.value = "";
    } else if (trisIn.value == "") {
        downloadReady = false;
        onResize();
    } else {
        downloadReady = false;
        // There is no Trismegistos identifier with spaces, 
        // so this will obviate some user errors.
        drawQR(baseUrl + trisIn.value.replace(/\s/g, ""));
    }
}

/**
 * This function generates the QR-Code using a the eScriptorium XML provided
 * by the user through `xmlIn`. The function will reset the `trisIn` input.
 * After that, it parses the file and gathers the needed
 * information to construct the URL. The URL is then used to generate the
 * QR-Code and draw it to the canvas.
 * The function is called automatically by the onchange event listener of
 * `xmlIn`.
 * If there is no file present, the function will call `removeXml`. This is
 * done, such that the Trismegistos input is enabled again after the user
 * cancels a XML selection.
 * 
 * @returns {void} This function does not return anything.
 */
function generateWithXML() {
    // Is a XML present at the `xmlIn`.
    if (xmlIn.files.length > 0) {
        // Reset the `trisIn` input.
        rmXmlBtn.style.display = "inline-block";
        trisIn.style.color = "grey";
        trisIn.setAttribute("placeholder", "------");
        trisIn.value = "";

        // Load the XML file.
        const reader = new FileReader();
        reader.onload = function () {
            // Onload, read the XML file.
            const xml = new DOMParser()
                .parseFromString(reader.result, "text/xml");
            // Get the Trismegistos identifier, 
            // maxWidth, maxHeight and all text lines from the XML file.
            let tris = xml.getElementsByTagName("fileName");
            let maxWidth = xml.getElementsByTagName("Page");
            let maxHeight = xml.getElementsByTagName("Page");
            const lines = xml.getElementsByTagName("TextLine");
            // Check the polygon count. If there is more than one, this
            // XML can't be used.
            const poly = xml.getElementsByTagName("Polygon");
            // Check if everything is alright.
            if (
                tris.length == 0
                || maxHeight.length == 0
                || maxWidth.length == 0
                || lines.length == 0
                || poly.length > 1
            ) {
                // If the uploaded XML file does not provide the needed
                // data, alert the user and remove the XML.
                alert("This XML does not provide the needed data!");
                removeXml();
                return;
            }
            // Check if the polygon has the right length, if there is one.
            if (poly.length > 0) {
                const p = stringToNumberArray(poly[0].getAttribute("POINTS"));
                // If it has not the right length, the XML can't be used.
                if (p.length != 8) {
                    // If the uploaded XML file does not provide the needed
                    // data, alert the user and remove the XML.
                    alert("This XML does not provide the needed data!");
                    removeXml();
                    return;
                }
            }
            tris = tris[0].innerHTML.split("_")[0];
            maxWidth = maxWidth[0].getAttribute("WIDTH");
            maxHeight = maxHeight[0].getAttribute("HEIGHT");

            // Construct the base URL.
            let url = tris + "_" + maxWidth + "_" + maxHeight;

            // Compute the needed information for each line and update the url.
            let baseline;
            // For each line.
            for (let i = 0; i < lines.length; i++) {
                // Width of the line.
                url = url + "_" + lines[i].getAttribute("WIDTH") + "!";
                baseline = stringToNumberArray(
                    lines[i].getAttribute("BASELINE")
                );
                // Is the baseline a line?
                if (baseline.length != 4) {
                    // If the uploaded XML file does not provide the needed
                    // data, alert the user and remove the XML.
                    alert("This XML does not provide the needed data!");
                    removeXml();
                    return;
                }
                // x and y Coords.
                url = url +
                    ((baseline[0] + baseline[2]) / 2) +
                    "!" +
                    ((baseline[1] + baseline[3]) / 2) +
                    "!";
                // Angle of the line.
                url = url + (
                        -(
                            Math.atan(
                                (baseline[3] - baseline[1]) 
                                / 
                                (baseline[2] - baseline[0])
                            ) * 180
                        ) 
                        /
                        Math.PI
                    ).toFixed(2);
            }
            // draw the URL.
            drawQR(baseUrl + url);
        };
        reader.readAsText(xmlIn.files[0]);
    } else {
        removeXml();
    }
}

/**
 * This function converts a space-separated string into an array of numbers.
 * 
 * @param {string} str - The string to convert.
 * @returns {number[]} - Array of numbers.
 * 
 * @example
 * stringToNumberArray("40 3 1 23");
 * // This will return [40, 3, 1, 23].
 */
function stringToNumberArray(str) {
    const strArray = str.split(" ");
    const numArray = strArray.map(Number);
    return numArray;
}

/**
 * This function takes a URL as string and creates a QR-Code with the given
 * URL. It saves this QR-Code to the `qrIm` and draws it to the `canvas`.
 * If the marker are not ready yet, this will do nothing, so the
 * function should always be called after loading the marker images.
 * The function uses the `QRCodeStyling` function of the qr-code-styling 
 * framework.
 * 
 * For more information on the framework look at:
 * {@link https://github.com/kozakdenys/qr-code-styling}
 * 
 * @param {string} url - The URL to generate a QR-Code for.
 * @returns {void} This function does not return anything.
 */
function drawQR(url) {
    // Update `qrUrl`.
    qrUrl = url;
    // Create a QR-Code with the same size as the marker images.
    if (markerReady) {
        const imageSize = marker0.width;
        const qr = new QRCodeStyling({
            width: imageSize,
            height: imageSize,
            data: url,
        });
        // Get the image data from the QR-Code and load it to the `qrIm`.
        qr.getRawData("png").then((buffer) => {
            qrIm.src = URL.createObjectURL(buffer);
            // Onload, set the `downloadReady` flag to `true` and call 
            // `onResize`.
            qrIm.onload = function () {
                downloadReady = true;
                onResize();
            };
        });
    }
}

/**
 * This function downloads the marker images as PNG files, if the `markerReady`
 * flag is set to `true`.
 * The function is called automatically by the onclick event listener of the
 * `dlMarkerBtn`.
 * 
 * @returns {void} This function does not return anything.
 */
function downloadMarker() {
    // alert the user, if the marker images are not ready yet.
    if (!markerReady) {
        alert("Please try again");
    } else {
        // Create a link for downloading the `marker0` image.
        const link = document.createElement("a");
        link.download = "marker0.png";
        link.href = marker0.src;
        // Click the link.
        link.click();
        // Create a link for downloading the `marker1` image.
        link.download = "marker1.png";
        link.href = marker1.src;
        // Click the link.
        link.click();
        // Remove the link.
        link.remove();
    }
}

/**
 * This function downloads the QR-Code image as a PNG file, if the 
 * `downloadReady` flag is set to `true`.
 * The function is called automatically by the onclick event listener of the
 * `dlQrBtn`.
 * 
 * @returns {void} This function does not return anything.
 */
function downloadQR() {
    // alert the user, if the QR-Code image is not ready yet.
    if (!downloadReady) {
        alert("Please try again");
    } else {
        // Create a link for downloading the `qrIm` image.
        const link = document.createElement("a");
        link.download = "QR.png";
        link.href = qrIm.src;
        // Click the link.
        link.click();
        // Remove the link.
        link.remove();
    }
}

/**
 * This function downloads both marker images and the QR-Code image as a 
 * single PDF file, if `downloadReady` and `markerReady` are both set to 
 * `true`.  It uses the jspdf framework.
 * The function is called automatically by the onclick event listener 
 * of the `dlPdfBtn`.
 * 
 * For more information on the framework look at:
 * {@link https://github.com/parallax/jsPDF}
 * 
 * @returns {void} This function does not return anything.
 */
function downloadPdf() {
    // Alert the user if any of the images are not ready yet.
    if (!markerReady || !downloadReady) {
        alert("Please try again");
    } else {
        // Create a new PDF.
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get new image width and height for fitting onto the PDF.
        const imgWidth = doc.internal.pageSize.getWidth() / 8;
        const imgHeight = (marker0.height * imgWidth) / marker0.width;

        // Add the images to the PDF as PNGs.
        doc.addImage(marker0, "PNG", 2, 2, imgWidth, imgHeight);
        doc.addImage(marker1, "PNG", 2, imgHeight + 3, imgWidth, imgHeight);
        doc.addImage(qrIm, "PNG", 2, 2 * imgHeight + 4, imgWidth, imgHeight);

        // Download the PDF.
        doc.save("marker-and-qr.pdf");
    }
}