const xmlIn = document.getElementById("xml");
const removeXml = document.getElementById("remove");
const xmlList = generateWithXML.bind(this);
xmlIn.addEventListener("change", xmlList);
const canvas = document.getElementById("image");
const ctx = canvas.getContext("2d");
const resizeLis = onResize.bind(this);
window.addEventListener("resize", resizeLis);
const trisIn = document.getElementById("tris");
const trisLis = generateWithTris.bind(this);
trisIn.addEventListener("input", trisLis);
removeXml.addEventListener("click", function() {
    xmlIn.value = "";
    removeXml.style.display = "none";
    trisIn.style.color = "inherit";
    trisIn.setAttribute(
        "placeholder", 
        "Enter the Trismegistos identifier here"
    );
    downloadReady = false;
    onResize();
});

let markerReady = false;
const marker0 = new Image();
const marker1 = new Image();
const canvas0 = document.createElement("canvas");
const ctx0 = canvas0.getContext("2d");
marker0.src = "0.png";
marker0.onload = function() {
    canvas0.width = marker0.width + 20;
    canvas0.height = marker0.height + 20;
    ctx0.fillStyle = "#ffffff";
    ctx0.fillRect(0, 0, canvas0.width, canvas0.height);
    ctx0.drawImage(marker0, 10, 10);
    marker0.src = canvas0.toDataURL();
    marker0.onload = function() {
        marker1.src = "1.png";
        marker1.onload = function() {
            canvas0.width = marker1.width + 20;
            canvas0.height = marker1.height + 20;
            ctx0.fillStyle = "#ffffff";
            ctx0.fillRect(0, 0, canvas0.width, canvas0.height);
            ctx0.drawImage(marker1, 10, 10);
            marker1.src = canvas0.toDataURL();
            marker1.onload = function() {
                markerReady = true;
                canvas0.remove();
                onResize();
            };
        };
    };
};

const qrIm = new Image();
const baseUrl = "https://thorsten-trinkaus.github.io/PapyriAR/AR/";
let downloadReady = false;


onResize();
function onResize() {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    canvas.height = maxHeight - 100;
    canvas.width = (canvas.height) / 3;
    if (canvas.width > maxWidth / 3 - 100) {
        canvas.width = maxWidth / 3 - 100;
        canvas.height = canvas.width * 3;
    }
    if (markerReady) {
        ctx.drawImage(
            marker0, 
            0, 0, 
            canvas.width, canvas.height / 3
        );
        ctx.drawImage(
            marker1, 
            0, canvas.height / 3, 
            canvas.width, canvas.height / 3
        );
    }
    if (downloadReady) {
        ctx.drawImage(
            qrIm, 
            0, 2 * canvas.height / 3, 
            canvas.width, canvas.height / 3
        );
    }
}

function generateWithTris() {
    if (xmlIn.value != "") {
        trisIn.value = "";
    } else if (trisIn.value == "") {
        downloadReady = false;
        onResize();
    } else {
        downloadReady = false;
        drawQR(baseUrl + trisIn.value);
    }
}

function generateWithXML() {
    if (xmlIn.files.length > 0) {
        removeXml.style.display = "inline-block";
        trisIn.style.color = "grey";
        trisIn.setAttribute("placeholder", "------");
        trisIn.value = "";
        const reader = new FileReader();
        reader.onload = function() {
            const xml = new DOMParser()
                .parseFromString(reader.result, "text/xml");
            const tris = xml.getElementsByTagName("fileName")[0]
                .innerHTML.split("_")[0];
            const maxWidth = xml.getElementsByTagName("Page")[0]
                .getAttribute("WIDTH");
            const maxHeight = xml.getElementsByTagName("Page")[0]
                .getAttribute("HEIGHT");

            let url = tris + "_" + maxWidth + "_" + maxHeight;
            const lines = xml.getElementsByTagName("TextLine");
            let baseline;
            for (let i = 0; i < lines.length; i++) {
                url = url + "_" + lines[i].getAttribute("WIDTH") + "|";
                baseline = stringToNumberArray(
                    lines[i].getAttribute("BASELINE")
                );
                url = url + ((baseline[0] + baseline[2]) / 2) + "|" 
                    + ((baseline[1] + baseline[3]) / 2) + "|";
                url = url + (
                    -(Math.atan((baseline[3] - baseline[1]) 
                    / 
                    (baseline[2] - baseline[0])) * 180 / Math.PI)
                ).toFixed(2);
            }
            drawQR(baseUrl + url);
        };
        reader.readAsText(xmlIn.files[0]);
    }
}

function stringToNumberArray(str) {
    const strArray = str.split(" ");
    const numArray = strArray.map(Number);
    return numArray;
}

function drawQR(url) {
    const imageSize = marker0.width;
    const qr = new QRCodeStyling({
        width: imageSize,
        height: imageSize,
        data: url
    });
    qr.getRawData("png").then(buffer => {
        qrIm.src = URL.createObjectURL(buffer);
        qrIm.onload = function () {
            downloadReady = true;
            onResize();
        };
    }); 
}

function downloadMarker() {
    if (!markerReady) {
        alert("Please try again");
    } else {
        const link = document.createElement("a");
        link.download = "marker0.png";
        link.href = marker0.src;
        link.click();
        link.download = "marker1.png";
        link.href = marker1.src;
        link.click();
        link.remove();
    }
    
}

function downloadQR() {
    if (!downloadReady) {
        alert("Please try again");
    } else {
        const link = document.createElement("a");
        link.download = "QR.png";
        link.href = qrIm.src;
        link.click();
        link.remove();
    }
}

function downloadPdf() {
    if (markerReady && downloadReady) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const imgWidth = doc.internal.pageSize.getWidth() / 8;
        const imgHeight = (marker0.height * imgWidth) / marker0.width;
        doc.addImage(marker0, "PNG", 2, 2, imgWidth, imgHeight);
        doc.addImage(marker1, "PNG", 2, imgHeight + 3, imgWidth, imgHeight);
        doc.addImage(qrIm, "PNG", 2, 2 * imgHeight + 4, imgWidth, imgHeight);
        doc.save("marker-and-qr.pdf");
    } else {
        alert("Please try again");
    }
}
