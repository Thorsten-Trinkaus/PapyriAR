function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function init() {
    const page = getQueryParameter("page");
    if (page) {
        let identifier = `${page}`;
        fetchMeta(identifier)
            .then(metaXml => {
                const meta = extractMetadataArr(metaXml);
                const ddbIdentifier = extractDdb(metaXml);
                fetchDdb(ddbIdentifier)
                    .then(ddbXml => {
                        const ddb = extractTranscription(ddbXml);
                        buildSceneAsync(meta, ddb);
                    })
                    .catch(() => {
                        errorState("Error getting ddb data. "
                            + "Make sure the identifier "
                            + ddbIdentifier
                            + " is correct!"
                        );
                    });
            })
            .catch(() => {
                errorState("Error getting meta data. "
                    + "Make sure the identifier "
                    + identifier
                    + " is correct!"
                );
            });
    } else {
        errorState("NO IDENTIFIER FOUND!");
    }
}

function errorState(errorText) {
    console.error(errorText);
    const body = document.querySelector("body");
    const scene = document.querySelector("a-scene");
    body.removeChild(scene);
    const text = document.createElement("text");
    const textVal = document.createTextNode(errorText);
    text.appendChild(textVal);
    body.appendChild(text);
}

async function buildSceneAsync(meta, ddb) {
    buildSceneSync(meta, ddb);
}

function buildSceneSync(meta, ddb) {
    meta.forEach(element => {
        if (!Array.isArray(element[1])) {
            addLines(element, ["red", "blue"], [100, 100])
        } else {
            addLine(element[0], "red", 100);
            element[1].forEach(subElement => {
                addLine(subElement, "blue");
            });
        }
    });
    let ddb_split = ddb.split("\n");
    ddb_split = ddb_split.filter(st5r => st5r !== "");
    for (let i = 0; i < ddb_split.length; i++) {
        ddb_split[i] = ddb_split[i].trim();
    }
    addLines(
        ddb_split, 
        Array(ddb_split.length).fill("green"), 
        Array(ddb_split.length).fill(100)
    );
}


