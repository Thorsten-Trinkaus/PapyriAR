function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function init() {
    // const page = getQueryParameter("page");
    const page = "1023_" 
        + "1248_"
        + "781-782.5-802-0_"
        + "784-774-913-0_"
        + "820-770-1041.5-359_"
        + "766-772-1153.5-1_"
        + "802-786-1298-2_"
        + "881-764.5-1419.5-1";
    if (page) {
        // let parts = `${page}`.split("_");
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
                            buildScene(meta, ddb, parts);
                        }
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
    const text = document.createElement("text");
    const textVal = document.createTextNode(errorText);
    text.appendChild(textVal);
    body.appendChild(text);
}




