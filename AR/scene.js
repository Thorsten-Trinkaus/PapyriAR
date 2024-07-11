function basicScene() {
    const marker = AScene.getDataMarker();
    return marker;
}

let metaData;
let ddbSplit = null;
let ddbParts = null;
let maxHeight;
let maxWidth;
let maxLen = 0;
let maxLenW = 0;

function buildMeta(meta) {
    metaData = meta;
    const marker = basicScene();
    let lineCount = 0;
    let elements = [];
    let maxLen = 0;
    let text = "";
    meta.forEach(element => {
        elements.push(element[0] + ": " + element[1]);
        if(elements[elements.length - 1].length > maxLen) {
            maxLen = elements[elements.length - 1].length;
        }
        text = text + elements[elements.length - 1] + "\n\n";
        lineCount += 3;
    });
    marker.addTextBox(
        text, 
        8, 
        maxLen,
        "4.5 0 0",
        0,
    );
    return marker;
}

function buildScene(meta, ddb, parts) {
    const marker = buildMeta(meta);
    ddbParts = parts;
    ddbSplit = ddb.split("\n");
    let subparts;
    maxWidth = parseFloat(parts[1]);
    maxHeight = parseFloat(parts[2]);
    ddbSplit = ddbSplit.filter(str => str !== "");
    
    for (let i = 0; i < ddbSplit.length && i + 3 < parts.length; i++) {
        ddbSplit[i] = ddbSplit[i].trim();
        subparts = parts[i + 3].split("|");
        if (ddbSplit[i].length > maxLen) {
            maxLen = ddbSplit[i].length;
            maxLenW = parseFloat(subparts[0]);
        }
    }
    for (let i = 0; i < ddbSplit.length && i + 3 < parts.length; i++) {
        subparts = parts[i + 3].split("|");
        marker.addTextBox(
            ddbSplit[i], 
            parseFloat(subparts[0]),
            Math.max(
                parseFloat(subparts[0]) * (maxLen / maxLenW), 
                ddbSplit[i].length
            ),
            (parseFloat(subparts[1]) - 0.5 - maxWidth) 
            + " 0 " 
            + (parseFloat(subparts[2]) - 0.5),
            parseFloat(subparts[3]),
        );
    }
}

function rebuildScene(dist) {
    const marker = buildMeta(metaData);
    if (ddbSplit && ddbParts) {
        let subparts;
        let maxRatio = maxHeight/maxWidth;
        let widthRatio = dist/maxWidth;
        let heightDist = maxRatio * dist;
        let heightRatio = heightDist / maxHeight;
        for (let i = 0; i < ddbSplit.length && i + 3 < ddbParts.length; i++) {
            subparts = ddbParts[i + 3].split("|");
            marker.addTextBox(
                ddbSplit[i], 
                parseFloat(subparts[0])* widthRatio,
                Math.max(
                    parseFloat(subparts[0]) * (maxLen / maxLenW), 
                    ddbSplit[i].length
                ),
                (parseFloat(subparts[1]) * widthRatio - 0.5 - dist) 
                + " 0 " 
                + (parseFloat(subparts[2]) * heightRatio - 0.5),
                parseFloat(subparts[3]),    // Angle stays.
            );
        }
    }
}