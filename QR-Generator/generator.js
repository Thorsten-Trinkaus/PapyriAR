const logoBtn = document.getElementById("logoBtn");
const logoCheck = document.getElementById("logoCheck");
const imageBtn = document.getElementById("imageBtn");
const imageCheck = document.getElementById("imageCheck");
const markerBtn = document.getElementById("markerBtn");
const markerCheck = document.getElementById("markerCheck");
const downloadBtn = document.getElementById("downloadBtn");
const urlInput = document.getElementById("urlInput");
const canvas = document.getElementById("qrImage");
const context2D = canvas.getContext("2d");
canvas.width = 0;
canvas.height = 0;
const size = 400;
const qrImage = new Image();
let qr;
let base64;
let loaded = false;

function logo() {
    if (imageCheck.checked) {
        imageCheck.checked = false;
    } else if (markerCheck.checked) {
        markerCheck.checked = false;
    }
    logoCheck.checked = true;
    generate();
}

function image() {
    if (logoCheck.checked) {
        logoCheck.checked = false;
    } else if (markerCheck.checked) {
        markerCheck.checked = false;
    }
    imageCheck.checked = true;
    generate();
}

function marker() {
    if (imageCheck.checked) {
        imageCheck.checked = false;
    } else if (logoCheck.checked) {
        logoCheck.checked = false;
    }
    markerCheck.checked = true;
    generate();
}

function drawCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
    if (width == 0 && height == 0) {
    } else {
        context2D.drawImage(qrImage, 0, 0, width, height);
    }
    loaded = true;
}

function generate() {
    loaded = false;
    const url = urlInput.value;
    if (url == "") {
        drawCanvas(0, 0);
    } else if (logoCheck.checked) {
        qr = new QRCodeStyling({
            type: "svg",
            data: url,
            image: "1.png",
            imageOptions: {
                imageSize: 0.5,
                margin: 10
            }
        });
        qr.getRawData("png").then(buffer => {
            qrImage.src = URL.createObjectURL(buffer);
            qrImage.onload = function () {
                drawCanvas(size, size);
            };
        });
    } else if (imageCheck.checked) {
        const image = new Image();
        image.src = "1.png";
        image.onload = function() {
            const imageSize = image.width;
            qr = new QRCodeStyling({
                width: imageSize,
                height: imageSize,
                data: url
            });
            qr.getRawData("png").then(buffer => {
                const qrImage0 = new Image();
                const canvas0 = document.createElement("canvas");
                const context0 = canvas0.getContext("2d");
                qrImage0.src = URL.createObjectURL(buffer);
                qrImage0.onload = function () {
                    canvas0.width = imageSize;
                    canvas0.height = imageSize * 2 + 10;
                    context0.fillStyle = "#ffffff";
                    context0.fillRect(0, 0, imageSize, imageSize * 2 + 10);
                    context0.drawImage(qrImage0, 0, 0);
                    context0.drawImage(image, 0, imageSize + 10);
                    qrImage.src = canvas0.toDataURL();
                    qrImage.onload = function () {
                        canvas0.remove();
                        drawCanvas(size/2 - 10, size);
                    };
                };
            }); 
        }
    } else {
        qr = new QRCodeStyling({
            data: url,
            backgroundOptions: {
                color: "#f0f0f0"
            }
        });
        qr.getRawData("png").then(buffer => {
            const reader = new FileReader();
            reader.readAsDataURL(buffer);
            reader.onload = function () {
                base64 = reader.result;
                THREEx.ArPatternFile.buildFullMarker(base64, 0.5, 1200, "black", function onComplete(markerUrl){
                    qrImage.src = markerUrl
                    qrImage.onload = function () {
                        drawCanvas(size, size);
                    };

                });
            }
        });
    }
}

logoBtn.addEventListener("click", logo);
logoCheck.addEventListener("click", logo);

imageBtn.addEventListener("click", image);
imageCheck.addEventListener("click", image);

markerBtn.addEventListener("click", marker);
markerCheck.addEventListener("click", marker);

urlInput.addEventListener("input", generate);

downloadBtn.addEventListener("click",
    function() {
        if (urlInput.value == "") {
            alert("Please enter a URL");
            return;
        } else if (!loaded) {
            alert("Please try again");
            return;
        }
        if (logoCheck.checked) {
            qr.download({ 
                name: "qrcode-with-logo", 
                extension: "png" 
            });
        } else if (imageCheck.checked) {
            const link = document.createElement("a");
            link.download = "qr-code-with-image.png";
            link.href = qrImage.src;
            link.click();
            link.remove();
        } else {
            const link = document.createElement("a");
            link.download = "qr-code-as-marker.png";
            link.href = qrImage.src;
            link.click();
            link.remove();
            THREEx.ArPatternFile.encodeImageURL(base64, function onComplete(patternFileString){
                THREEx.ArPatternFile.triggerDownload(patternFileString, "qr-code-as-marker.patt");
            });
        }
    }
);