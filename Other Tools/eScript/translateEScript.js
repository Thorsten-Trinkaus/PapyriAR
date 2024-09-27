let strs = [];
let txtl = [];
function loadXML(event) {
    strs = [];
    txtl = [];
    const reader = new FileReader();
    reader.onload = function() {
        const xml = new DOMParser().parseFromString(reader.result, "text/xml");
        const tris = xml.getElementsByTagName("fileName")[0].innerHTML.split("_")[0];
        const maxWidth = xml.getElementsByTagName("Page")[0].getAttribute("WIDTH");
        const maxHeight = xml.getElementsByTagName("Page")[0].getAttribute("HEIGHT");

        let txt = tris + "_" + maxWidth + "_" + maxHeight;
        const lines = xml.getElementsByTagName("TextLine");
        let baseline;
        for (let i = 0; i < lines.length; i++) {
            txt = txt + "_" + lines[i].getAttribute("WIDTH") + "|";
            baseline = stringToNumberArray(lines[i].getAttribute("BASELINE"));
            txt = txt + ((baseline[0] + baseline[2]) / 2) + "|" 
                + ((baseline[1] + baseline[3]) / 2) + "|";
            if ((Math.atan((baseline[3] - baseline[1]) / (baseline[2] - baseline[0])) * 180 / Math.PI) >= 0) {
                txt = txt + (-(Math.atan((baseline[3] - baseline[1]) / (baseline[2] - baseline[0])) * 180 / Math.PI));
            } else {
                txt = txt + (-(Math.atan((baseline[3] - baseline[1]) / (baseline[2] - baseline[0])) * 180 / Math.PI));
            }
            
        }
        const htmlTXT = document.getElementById("txt");
        htmlTXT.innerHTML = txt;
    }
    reader.readAsText(event.target.files[0]);
}

function stringToNumberArray(str) {
    const strArray = str.split(" ");
    const numArray = strArray.map(Number);
    return numArray;
}