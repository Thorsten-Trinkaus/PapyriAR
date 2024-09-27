/**
 * @async
 * @description
 * This function tries to fetch a given URL using the fetch API. 
 * It either returns a Promise for the response text or throws an error,
 * if the url can't be fetched.
 * @param {string} url - Url to be fetched.
 * @param {Object} options - Optional fetch options.
 * @returns {Promise<string>} Promise for the fetched data text.
 * 
 * @throws {Error} Throws an error if the URL can't be fetched for some reason.
 * 
 * @example
 * fetchUrl("https://spoo.me/", {
 *  method: "POST",
 *  headers: {
 *   "Content-Type": "application/x-www-form-urlencoded",
 *   "Accept": "application/json",
 *  },
 *  body: new URLSearchParams({url: "example.com"})
 * }).then(data => {
 *  console.log(data);
 * }).catch(error => {
 *  console.error(error);
 * });
 * 
 * @example
 * fetchUrl("https://example.com/").then(d => {}).catch(e => {});
 */
async function fetchUrl(url, options = {}) {
    try {
        // Try to fetch.
        const response = await fetch(url, options);
        
        // Did something go wrong?
        if (!response.ok) {
            throw new Error(
                "Network response was not ok: " 
                + response.status
            );
        }

        // Return Promise for the response text.
        const data = await response.text();
        return data;
    } catch (error) {
        // Catch and throw any error.
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
 * This function fetches a meta XML file using a given Trismegistos identifier.
 * It constructs a URL from the identifier and fetches the URL with `fetchUrl`.
 * The file is parsed using `DomParser` and returned in XML format.
 * If the identifier is not valid, it will throw an error.
 * @param {string} identifier - Trismegistos identifier for the file to fetch. 
 * @returns {Promise<Document>} Promise resolving to the wanted XML file.
 * 
 * @throws {Error} Throws an error if the identifier is not valid or if an
 * error occurs while fetching the URL.
 * 
 * @example
 * const xml = fetchMeta("1").then(metaXml => {}).catch(e => {});
 */
function fetchMeta(identifier) {
    // Trismegistos identifier are always numbers. If the given identifier 
    // isn't a number, it can't be a valid Trismegistos identifier.
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

    /////////////////////////////////////////
    // Construct the URL for the XML file. //
    /////////////////////////////////////////

    const id = Number(identifier);
    // The XML files are stored in batches of 1000. These batches are named
    // after the Trismegistos identifier.
    let subfolder = Math.floor(id / 1000);
    if (id % 1000 != 0) {
        subfolder++;
    }
    // The URL itself.
    const url = "https://raw.githubusercontent.com/" 
        + "papyri/idp.data/master/HGV_meta_EpiDoc/HGV"
        + subfolder 
        + "/" 
        + id 
        + ".xml";

    ///////////////////////////////////////////
    // Fetch the XML and return the Promise. //
    ///////////////////////////////////////////

    return fetchUrl(url).then(data => {
        // Parse the result from string to XML document.
        return new DOMParser().parseFromString(data, 'text/xml');
    }).catch(error => {
        // Catch any error in the process. Log the error before throwing it.
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
    });
}

/**
 * This function fetches a meta XML file using a given hybrid identifier.
 * It constructs a URL from the identifier and fetches the URL with `fetchUrl`.
 * The file is parsed using `DomParser` and returned in XML format.
 * @param {string} ddbHybrid - Hybrid identifier for the file to fetch. 
 * @returns {Promise<Document>} Promise resolving to the wanted XML file.
 * 
 * @throws {Error} Throws an error if an error occurs while fetching the URL.
 * 
 * @example
 * const xml = fetchDdb("psi;4;345").then(ddbXml => {}).catch(e => {});
 */
function fetchDdb(ddbHybrid) {

    ////////////////////////////////////////
    // Construct the URL from the hybrid. //
    ////////////////////////////////////////

    // Base URL.
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

    ///////////////////////////////////////////
    // Fetch the XML and return the Promise. //
    ///////////////////////////////////////////

    return fetchUrl(url).then(data => {
        // Parse the result from string to XML document.
        return new DOMParser().parseFromString(data, 'text/xml');
    }).catch(error => {
        // Catch any error in the process. Log the error before throwing it.
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
    });
}

/**
 * This function tests if a given string is an integer or not and returns
 * a boolean value.
 * @param {string} str - String to test.
 * @returns {boolean} True, if the string is a integer.
 * 
 * @example
 * isInteger("42");
 * // Output: true.
 * 
 * @example
 * isInteger("I'm an integer.");
 * // Output: false.
 */
function isInteger(str) {
    const regex = /^-?\d+$/;
    return regex.test(str);
}