let aspectW = 1;
let aspectH = 1;
function loadImage(event) {
    const maxWidth = window.innerWidth/2;
    const maxHeight = window.innerHeight-100;
    const canvas = document.getElementById("imageCanvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    const reader = new FileReader();
    reader.onload = function() {
        image.src = reader.result;
        image.onload = function() {
            let width = image.width;
            let height = image.height;
            if (width > maxWidth) {
                width = maxWidth;
                height = (image.height/image.width) * maxWidth;
            }
            if (height > maxHeight) {
                height = maxHeight;
                width = (image.width/image.height) * maxHeight;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0, width, height);
            convertToBlackAndWhite(canvas);
            aspectW = width / image.width;
            aspectH = height / image.height;
        }
    }
    reader.readAsDataURL(event.target.files[0]);
}

function convertToBlackAndWhite(canvas) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
}

let poly = [];
let strs = [];
let txtl = [];
function loadXML(event) {
    poly = [];
    strs = [];
    txtl = [];
    const reader = new FileReader();
    reader.onload = function() {
        const xml = new DOMParser().parseFromString(reader.result, "text/xml");
        const polygons = xml.getElementsByTagName("Polygon");
        for (let i = 0; i < polygons.length; i++) {
            poly.push(stringToNumberArray(polygons[i].getAttribute("POINTS")));
        };
        const strings = xml.getElementsByTagName("String");
        let vPos;
        let hPos;
        let w;
        let h;
        for (let i = 0; i < strings.length; i++) {
            vPos = Number(strings[i].getAttribute("VPOS"));
            hPos = Number(strings[i].getAttribute("HPOS"));
            w = Number(strings[i].getAttribute("WIDTH"));
            h = Number(strings[i].getAttribute("HEIGHT"));
            if (h == 0) {
                strs.push([hPos, vPos, hPos + w, vPos]);
            } else {
                strs.push([hPos, vPos, hPos + w, vPos, hPos + w, vPos + h, hPos, vPos + h, hPos, vPos]);
            }
        }
        const textLines = xml.getElementsByTagName("TextLine");
        for (let i = 0; i < textLines.length; i++) {
            txtl.push(stringToNumberArray(textLines[i].getAttribute("BASELINE")));
        };
    }
    reader.readAsText(event.target.files[0]);
}

function stringToNumberArray(str) {
    const strArray = str.split(" ");
    const numArray = strArray.map(Number);
    return numArray;
}

function draw() {
    const canvas = document.getElementById("imageCanvas");
    const ctx = canvas.getContext("2d");
    if (poly.length == 0) {
        window.alert("Please upload a XML-file");
        return;
    } else if (canvas.width == 0) {
        window.alert("Please upload a image");
        return;
    }
    poly.forEach(arr => {
        drawLines(arr, ctx, "red");
    });
    strs.forEach(arr => {
        drawLines(arr, ctx, "blue");
    });
    txtl.forEach(arr => {
        drawLines(arr, ctx, "green");
    })
}

function drawLines(arr, ctx, color) {
    for (let i = 0; i < arr.length - 2; i += 2) {
        ctx.beginPath();
        ctx.moveTo(arr[i] * aspectW, arr[i + 1] * aspectH);
        ctx.lineTo(arr[i + 2] * aspectW, arr[i + 3] * aspectH);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
