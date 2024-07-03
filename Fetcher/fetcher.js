
/**
 * 
 * @param {!string} url - Url to be fetched.
 * @returns {Promise} - Promise for the fetch.
 */
async function fetchUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                "Network response was not ok: " 
                + response.status
            );
        }
        return response;
    } catch (error) {
        console.error(
            "Url " 
            + url 
            + " could not be fetched. " 
            + error
        );
        throw new Error(error);
    }
}

/**
 * 
 * @param {!string} identifier - Identifier for the file with the meta-data. 
 *      This must be a trismegistos identifier.
 * @returns {Promise} Promise for the xml-file.
 */
async function fetchMeta(identifier) {
    if (!isInteger(identifier)) {
        console.error(
            "The given identifier " 
            + identifier 
            + " is not a trismegistos identifier"
        );
        throw new Error(
            "The given identifier " 
            + identifier 
            + " is not a trismegistos identifier"
        );
    }
    const id = Number(identifier);
    let subfolder = Math.floor(id / 1000);
    if (id % 1000 != 0) {
        subfolder++;
    }
    
    const url = "https://raw.githubusercontent.com/" 
        + "papyri/idp.data/master/HGV_meta_EpiDoc/HGV"
        + subfolder 
        + "/" 
        + id 
        + ".xml";
    try {
        const response = await fetchUrl(url);
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.text();
        return new DOMParser().parseFromString(data, 'text/xml');
    } catch (error) {
        console.error(
            "meta XML at " 
            + url 
            + " with identifier "
            + identifier
            + " could not be fetched. "
            + error
        );
        throw new Error(
            "meta XML with identifier "
            + identifier
            + " could not be fetched. "
            + error
        );
    }
}

/**
 * 
 * @param {!string} ddbHybrid - ddbHybrid identifier.
 * @returns {Promise} Promise for the xml-file.
 */
async function fetchDdb(ddbHybrid) {
    let url = "https://raw.githubusercontent.com/"
        + "papyri/idp.data/master/DDB_EpiDoc_XML/";
    const hybrid = ddbHybrid.split(";");
    url = url + hybrid[0] + "/";
    // Is there a subfolder in the url path?
    if (hybrid[1] != "") {
        url = url 
            + hybrid[0] + "." + hybrid[1] + "/" 
            + hybrid[0] + "." + hybrid[1] + "." + hybrid[2] + ".xml";
    } else {
        url = url + hybrid[0] + "." + hybrid[2] + ".xml";
    }
    try {
        const response = await fetchUrl(url);
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.text();
        return new DOMParser().parseFromString(data, 'text/xml');
    } catch (error) {
        console.error(
            "ddb XML at " 
            + url 
            + " with identifier "
            + ddbHybrid
            + " could not be fetched. "
            + error
        );
        throw new Error(
            "ddb XML with identifier "
            + ddbHybrid
            + " could not be fetched. "
            + error
        );
    }
}

/**
 * This function tests if a given string is a integer or not and returns
 * a boolean value.
 * @param {!string} str - String to test.
 * @returns {boolean} True, if the string is a integer.
 */
function isInteger(str) {
    const regex = /^-?\d+$/;
    return regex.test(str);
}