function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let selectedElement = null;

function init() {
    const page = "1023_" + "1248_" + "781-782.5-802-0_" + "784-774-913-0_" + "820-770-1041.5-359_" + "766-772-1153.5-1_" + "802-786-1298-2_" + "881-764.5-1419.5-1";
    if (page) {
        parts = page.split("_");
        const identifier = parts[0];
        fetchMeta(identifier)
            .then(metaXml => {
                const meta = extractMetadataArr(metaXml);
                const ddbIdentifier = extractDdb(metaXml);
                fetchDdb(ddbIdentifier)
                    .then(ddbXml => {
                        const ddb = extractTranscription(ddbXml);
                        if (parts.length == 1) {
                            buildMeta(meta);
                        } else {
                            const marker = buildScene(meta, ddb, parts);
                            selectedElement = marker;
                        }
                    })
                    .catch(() => {
                        errorState("Error getting ddb data. Make sure the identifier " + ddbIdentifier + " is correct!");
                    });
            })
            .catch(() => {
                errorState("Error getting meta data. Make sure the identifier " + identifier + " is correct!");
            });
    } else {
        errorState("NO IDENTIFIER FOUND!");
    }
}

function errorState(errorText) {
    console.error(errorText);
    const body = document.querySelector("body");
    const text = document.createElement("text");
    const textVal = document.createTextNode(errorText);
    text.appendChild(textVal);
    body.appendChild(text);
}

// Function to update position
function updateElementPosition() {
    const posX = parseFloat(document.getElementById('posX').value);
    const posY = parseFloat(document.getElementById('posY').value);
    const posZ = parseFloat(document.getElementById('posZ').value);
    if (selectedElement) {
        selectedElement.updatePosition(posX, posY, posZ);
    }
}

// Function to update rotation
function updateElementRotation() {
    const rotX = parseFloat(document.getElementById('rotX').value);
    const rotY = parseFloat(document.getElementById('rotY').value);
    const rotZ = parseFloat(document.getElementById('rotZ').value);
    if (selectedElement) {
        selectedElement.updateRotation(rotX, rotY, rotZ);
    }
}

// Function to update scale
function updateElementScale() {
    const scaleX = parseFloat(document.getElementById('scaleX').value);
    const scaleY = parseFloat(document.getElementById('scaleY').value);
    const scaleZ = parseFloat(document.getElementById('scaleZ').value);
    if (selectedElement) {
        selectedElement.updateScale(scaleX, scaleY, scaleZ);
    }
}
