const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');

// Function to construct the URL from the given identifier and directory number
function constructURL(directory, identifier) {
    const baseURL = "https://raw.githubusercontent.com/papyri/idp.data/master";
    const filePath = `${directory}/${identifier}.xml`;
    return `${baseURL}/${filePath}`;
}

// Function to fetch and parse the XML file
async function fetchAndParseXML(directory, identifier) {
    const url = constructURL(directory, identifier);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        if (xmlDoc.getElementsByTagName("parsererror").length) {
            throw new Error("Error parsing XML");
        }

        // Extract information from the XML
        const title = xmlDoc.getElementsByTagName("title")[0]?.textContent;
        const material = xmlDoc.getElementsByTagName("material")[0]?.textContent;
        const origPlace = xmlDoc.getElementsByTagName("origPlace")[0]?.textContent;
        const origDate = xmlDoc.getElementsByTagName("origDate")[0]?.textContent;
        const languages = Array.from(xmlDoc.getElementsByTagName("language")).map(lang => lang.textContent);

        return { title, material, origPlace, origDate, languages };
    } catch (error) {
        console.error("Error fetching or parsing XML:", error);
    }
}

// Example usage
const directory = "Biblio/12/"; // Adjust directory as necessary
const identifier = "11008"; // Adjust identifier as necessary
fetchAndParseXML(directory, identifier).then((data) => {
    if (data) {
        console.log("Title:", data.title);
        console.log("Material:", data.material);
        console.log("Original Place:", data.origPlace);
        console.log("Original Date:", data.origDate);
        console.log("Languages:", data.languages);
    }
});
