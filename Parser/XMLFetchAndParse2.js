// Function to fetch XML content from a given URL
async function fetchXML(url) {
    const response = await fetch(url);
    const text = await response.text();
    return new DOMParser().parseFromString(text, 'text/xml');
}

// Function to extract identifiers from the XML
function extractIdentifiers(xml) {
    const id = xml.getElementsByTagName('idno');
    let metadataId = '';
    let transcriptionId = '';
    for (let i = 0; i < id.length; i++) {
        const type = id[i].getAttribute('type');
        if (type === 'TM') {
            metadataId = id[i].textContent;
        } else if (type === 'ddb-hybrid' || type === 'filename') {
            transcriptionId = id[i].textContent;
        }
    }
    return { metadataId, transcriptionId };
}

function extractDdb(xml) {
    const id = xml.getElementsByTagName('idno');
    let identifier = null;
    for (let i = 0; i < id.length; i++) {
        const type = id[i].getAttribute('type');
        if (type === 'ddb-hybrid') {
            identifier = id[i].textContent;
        }
    }
    return identifier;
}

// Function to construct the initial URL for either metadata or transcription
function constructInitialURL(identifier) {
    if (identifier.match(/^\d+$/)) {
        // If the identifier is a number, assume it is for metadata
        return `https://papyri.info/hgv/${identifier}/source`;
    } else {
        // If the identifier is not a number, assume it is for transcription
        return `https://papyri.info/ddbdp/${identifier}/source`;
    }
}

// Function to construct the second URL
function constructURL(baseURL, identifier) {
    if (baseURL.includes('hgv')) {
        return `https://papyri.info/ddbdp/${identifier}/source`;
    } else {
        return `https://papyri.info/hgv/${identifier}/source`;
    }
}

// Function to safely extract text content from an element
function getTextContent(element) {
    return element ? element.textContent : '';
}

// Function to safely extract an attribute value from an element
function getAttributeValue(element, attribute) {
    return element ? element.getAttribute(attribute) : '';
}

// Function to extract data from metadata XML
function extractMetadata(xml) {
    const title = getTextContent(xml.getElementsByTagName('title')[0]);
    const material = getTextContent(xml.getElementsByTagName('material')[0]);
    const originalPlace = getTextContent(xml.getElementsByTagName('origPlace')[0]);
    const origDateElem = xml.getElementsByTagName('origDate')[0];
    const originalDate = `${getAttributeValue(origDateElem, 'notBefore')} - ${getAttributeValue(origDateElem, 'notAfter')}`;
    
    const subjectElems = xml.getElementsByTagName('term');
    const subjects = [];
    for (let i = 0; i < subjectElems.length; i++) {
        subjects.push(getTextContent(subjectElems[i]));
        
    }

    return { title, material, originalPlace, originalDate, subjects };
}

function extractMetadataArr(xml) {
    const title = getTextContent(xml.getElementsByTagName('title')[0]);
    const material = getTextContent(xml.getElementsByTagName('material')[0]);
    const originalPlace = getTextContent(xml.getElementsByTagName('origPlace')[0]);
    const origDateElem = xml.getElementsByTagName('origDate')[0].innerHTML;

    //const originalDate = `${getAttributeValue(origDateElem, 'notBefore')} - ${getAttributeValue(origDateElem, 'notAfter')}`;
    
    const subjectElems = xml.getElementsByTagName('term');
    
    let subjects = "";
    for (let i = 0; i < subjectElems.length; i++) {
        subjects = subjects + subjectElems[i].innerHTML + " | ";
    }

    return [
        ["title", title], 
        ["material", material], 
        ["originalPlace", originalPlace], 
        ["originalDate", origDateElem], 
        ["subjects", subjects]
    ];
}

// Recursive function to extract text content from XML nodes
function extractText(node) {
    let textContent = '';
    for (let child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3) { // TEXT_NODE
            textContent += child.nodeValue;
        } else if (child.nodeType === 1) { // ELEMENT_NODE
            textContent += extractText(child);
        }
    }
    return textContent;
}

// Function to extract transcription from transcription XML
function extractTranscription(xml) {
    const divElem = xml.getElementsByTagName('div')[0];
    return extractText(divElem);
}

// Main function to fetch and parse XMLs starting from one given identifier
async function fetchAndParseXMLs(identifier) {
    // Construct the initial URL based on the identifier type
    const startURL = constructInitialURL(identifier);

    // Fetch the first XML
    const firstXML = await fetchXML(startURL);
    // Extract identifiers from the first XML
    const { metadataId, transcriptionId } = extractIdentifiers(firstXML);

    // Determine the second URL based on the first URL
    let secondURL = '';
    if (startURL.includes('hgv')) {
        secondURL = constructURL(startURL, transcriptionId);
    } else {
        secondURL = constructURL(startURL, metadataId);
    }

    // Fetch the second XML
    const secondXML = await fetchXML(secondURL);

    // Determine which is metadata and which is transcription
    let metadataXML, transcriptionXML;
    if (startURL.includes('hgv')) {
        metadataXML = firstXML;
        transcriptionXML = secondXML;
    } else {
        metadataXML = secondXML;
        transcriptionXML = firstXML;
    }

    // Extract data from both XMLs
    const metadata = extractMetadata(metadataXML);
    const transcription = extractTranscription(transcriptionXML);

    return {
        metadataId,
        transcriptionId,
        metadata,
        transcription
    };
}

