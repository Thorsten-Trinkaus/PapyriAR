/**
 * Retrieves the value of a query parameter from the URL.
 *
 * @param {string} name - The name of the query parameter.
 * @returns {string | null} The value of the query parameter (`null` 
 * if the parameter is not found).
 *
 * @example
 * // With the URL https://example.com/?user=LetoII
 * getQueryParameter("user"); 
 * // Returns "LetoII".
 */
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * This function is called by the onload function of the body.
 * The function initializes all the needed parts for the scene to be fully 
 * functional. It tries to fetch meta and DDB XML-files and extracts 
 * the needed data from them. The Identifier for the meta file and the
 * eScriptorium data are extracted from the query parameter `page`. For this to
 * work the query parameter needs to be of form metaIdentifier_eScriptData,
 * where the eScriptData should be of form maxWidth_maxHeight_
 * widthOfLine1!xPos1!yPos1!angleOfLine1_...
 * If the function fails to fetch the meta file, the function errorState is
 * called with caught error. If the function fails to fetch the DDB file or
 * there eScriptData is empty, the function calls the initScene method of
 * the Scene class with only the extracted meta data. If both files are
 * successfully extracted the initScene method is called with meta, DDB and
 * eScriptorium data. If the `page` parameter is no set, the function calls
 * errorState directly and doesn't try to fetch any data.
 * 
 * @returns {void} This function does not return anything.
 * 
 * @example
 * // With the query parameter 
 * "2033" 
 * // the function tries to fetch the meta-XML
 * // With Identifier 2033 and calls 
 * Scene.initScene(metaData);
 * // with only the extracted meta data. 
 * 
 * @example
 * // With the query parameter 
 * "2033_795_1063!401.5!104!0.68_657!405.5!198!0.7"
 * // the function tries to fetch both files and calls
 * Scene.initScene(metaData, ddbData, eScriptData);
 * // with meta, ddb and eScriptorium data.
 * 
 * @example
 * // Without the query parameter the function calls
 * errorState("NO IDENTIFIER FOUND!");
 */
function init() {
    // Get the query parameter `page`.
    const pagePara = getQueryParameter("page");
    // If there is no query parameter call errorState.
    if (!pagePara) {
        errorState("NO IDENTIFIER FOUND!");
    } else {
        // Split up the eScriptorium data.
        const eScriptData = pagePara.split("_");
        // The first part of the eScriptorium data is the meta data identifier.
        const identifier = eScriptData[0];
        
        // Try to fetch the meta XML.
        fetchMeta(identifier).then(metaXml => {
            // If the file is loaded, extract the needed data from it.
            const metaData = extractMetadataArr(metaXml);
            // If the eScriptorium data only consists of the meta identifier,
            // Call the initScene method with only the meta data.
            if (eScriptData.length == 1) {
                Scene.initScene(metaData);
            } else {
                // Else, extract the DDB identifier from the metal xml and
                // try to fetch the DDB XML.
                const ddbIdentifier = extractDdb(metaXml);
                fetchDdb(ddbIdentifier).then(ddbXml => {
                    // If the file is loaded, extract the needed data from it.
                    const ddbData = extractTranscription(ddbXml);
                    // Call initScene with meta, DDB and eScriptorium data.
                    Scene.initScene(metaData, ddbData, eScriptData);
                }).catch(error => {
                    // If an error occurs while trying to fetch the DDB XML,
                    // the function logs the error to the console and calls
                    // initScene with only the meta data.
                    console.error("Error getting ddb data. "
                        + "Make sure the identifier "
                        + ddbIdentifier
                        + " is correct! \n Will only use meta data."
                        + error
                    );
                    Scene.initScene(metaData);
                });
            }
        }).catch(error => {
            // If an error occurs while trying to fetch the meta XML, the Scene
            // can't be initialized, so the function calls errorState with the 
            // given error.
            errorState("Error getting meta data. "
                + "Make sure the identifier "
                + identifier
                + " is correct! \n"
                + error
            );
        });
    }
}

/**
 * This function removes all children from the body and adds a text-element to
 * display an error message to the user. This message is also logged to the 
 * console. The function should be used if a critical error has occurred, which
 * can not be solved and keeps the website from working correctly.
 * 
 * @param {string} errorText - text to be displayed and logged to the console.
 * @returns {void} This function does not return anything.
 * 
 * @example
 * errorState("There is no Papyri with identifier 42!");
 * // Logs the error message "There is no Papyri with identifier 42!" 
 * // and displays the message to the user.
 */
function errorState(errorText) {
    // Log to console.
    console.error(errorText);
    // Remove all children of the body.
    const body = document.querySelector("body");
    while (body.firstChild) {
        body.lastChild.remove();
    }
    // Create a text-element with the error message and add it to the body.
    const text = document.createElement("text");
    const textVal = document.createTextNode(errorText);
    text.appendChild(textVal);
    body.appendChild(text);
}