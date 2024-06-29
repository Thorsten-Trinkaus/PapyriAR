const canvas = document.getElementById("image");
const ctx = canvas.getContext("2d");
const resizeLis = onResize.bind(this);
window.addEventListener("resize", resizeLis);
const tokenDiv = document.getElementById("token");
const eScCheck = document.getElementById("eScCheck");
const eScBtn = document.getElementById("eScBtn");
eScBtn.addEventListener("click", function () {
    eScCheck.checked = !eScCheck.checked;
    eScChange();
});
const eScLis = eScChange.bind(this);
eScCheck.addEventListener("change", eScLis);
const trisIn = document.getElementById("trisInput");
const trisLis = generate.bind(this);
trisIn.addEventListener("input", trisLis);
const downBtn = document.getElementById("downBtn");
const downloadLis = download.bind(this);
downBtn.addEventListener("click", downloadLis);
const genBtn = document.getElementById("genBtn");
const genLis = generateWithEScript.bind(this);
genBtn.addEventListener("click", genLis)
const tokenIn = document.getElementById("tokenInput");
tokenIn.addEventListener("input", function () {
    eScriptPage(1);
});
let loaded = false;
let generated = true;
const downloadIm = new Image();

onResize();

function onResize() {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    canvas.height = maxHeight - 100;
    canvas.width = (canvas.height - 10) / 2;
    if (canvas.width > maxWidth / 2 - 100) {
        canvas.width = maxWidth / 2 - 100;
        canvas.height = canvas.width * 2 + 10;
    }
    generate();
}

function eScChange() {
    if (eScCheck.checked) {
        tokenDiv.style.visibility = "visible";
        tokenDiv.style.height = "100%";
        generated = false;
        clearCanvas();
    } else {
        tokenDiv.style.visibility = "collapse";
        tokenDiv.style.height = "0";
        generated = true;
        generate();
    }
}

function clearCanvas() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function generate() {
    loaded = false;
    if (eScCheck.checked) {
        generated = false;
    }
    else {
        const id = trisIn.value;
        const url = "https://thorsten-trinkaus.github.io/PapyriAR/AR/" + id;
        if (id == "") {
            clearCanvas();
        } else {
            drawQR(url);
        }
    }
    loaded = true;
}

function drawQR(url) {
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
            const qrImage = new Image();
            const canvas0 = document.createElement("canvas");
            const ctx0 = canvas0.getContext("2d");
            qrImage.src = URL.createObjectURL(buffer);
            qrImage.onload = function () {
                canvas0.width = imageSize;
                canvas0.height = imageSize * 2 + 10;
                ctx0.fillStyle = "#ffffff";
                ctx0.fillRect(0, 0, imageSize, imageSize * 2 + 10);
                ctx0.drawImage(qrImage, 0, 0);
                ctx0.drawImage(image, 0, imageSize + 10);
                downloadIm.src = canvas0.toDataURL();
                downloadIm.onload = function () {
                    canvas0.remove();
                    ctx.drawImage(
                        downloadIm, 
                        0, 0,
                        canvas.width, canvas.height
                    );
                };
            };
        }); 
    }
}

function download() {
    if (trisIn.value == "") {
        alert("Please enter a identifier");
        return;
    } else if (!loaded) {
        alert("Please try again");
        return;
    } else if (!generated) {
        alert("Please generate the QR Code first");
        return;
    }
    const link = document.createElement("a");
    link.download = "qr-code-with-image.png";
    link.href = downloadIm.src;
    link.click();
    link.remove();
}

async function generateWithEScript() {
    fetchMeta(trisIn.value).then(xml => {
        const hybridId = extractDdb(xml);
        const hybrid = hybridId.split(";");
        let identifier;
        if (hybrid[1] != "") {
            identifier = hybrid[0] + "." + hybrid[1] + "." + hybrid[2];
        } else {
            identifier = hybrid[0] + "." + hybrid[2];
        }
        console.log(identifier);
    }).catch(err => {
        let errParts = "" + err;
        errParts = errParts.split(" ");
        if (errParts[errParts.length - 1] == "404") {
            alert("There is no file with the identifier " + trisIn.value);
        } else {
            alert(err);
        }
    });
}

async function eScriptPage(page) {
    try {
        const url = "https://serv50.ub.uni-heidelberg.de"
            + "/api/documents/79/parts/?page=" 
            + page;
        const headers = {
            'Content-type':'application/json', 
            'Accept':'application/json', 
            'Authorization':'Token ' + tokenIn.value
        };
        const response = await fetch(url, {
            headers: headers,
        });
        if (!response.ok) {
            throw new Error();
        }
        const data = response.text();
        console.log(data.json());
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}
