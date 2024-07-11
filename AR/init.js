function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function init() {
    const page = getQueryParameter("page");
    console.log(page);
    if (page) {
        let parts = `${page}`.split("_");
        console.log(parts);
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
                    .catch((error) => {
                        errorState("Error getting ddb data. "
                            + "Make sure the identifier "
                            + ddbIdentifier
                            + " is correct! \n"
                            + error
                        );
                    });
            })
            .catch((error) => {
                errorState("Error getting meta data. "
                    + "Make sure the identifier "
                    + identifier
                    + " is correct! \n"
                    + error
                );
            });
    } else {
        errorState("NO IDENTIFIER FOUND!");
    }
}

function errorState(errorText) {
    console.error(errorText);
    const body = document.getElementById("body");
    const text = document.createElement("text");
    const textVal = document.createTextNode(errorText);
    text.appendChild(textVal);
    body.appendChild(text);
}




