/**
 * @typedef {Array<string>} StringPair
 * A tuple containing two strings, e.g., ["hello", "there"].
 */


/**
 * The Scene class is responsible for managing the scene state and displaying
 * meta and DDB data. It uses a singleton pattern, ensuring only one instance
 * is ever created. It supports initializing the scene with meta and optionally 
 * with DDB and eScriptorium data through the method initScene. This method is 
 * the only way to create an object of this class and can also only be called 
 * once. There is no way to access the instance of this class directly, but it 
 * can be interacted with through the static methods.
 * If the instance is initialized with meta, DDB and eScriptorium data, the
 * scene can toggle between displaying meta and DDB data using checkboxes, 
 * displayed over the actual scene.
 */
class Scene {
    
    /**
     * The singleton instance of this class. `null`, if the instance is 
     * not instantiated yet.
     * @type {Scene?}
     * @private
     */
    static #instance = null;

    /**
     * The meta data. `null`, if the class is not instantiated yet.
     * @type {Array<StringPair>?}
     * @private
     */
    static #metaData = null;

    /**
     * The DDB data. `null`, if the class is not instantiated yet or if there
     * was no DDB data provided on instantiation.
     * @type {string?}
     * @private
     */
    static #ddbData = null;         

    /**
     * The eScriptorium data. `null`, if the class is not instantiated yet or 
     * if there was no eScriptorium data provided on instantiation.
     * @type {Array<string>?}
     * @private
     */
    static #eScriptData = null;

    /**
     * Checkbox for displaying meta data. `null`, if the class is not 
     * instantiated yet or if there was no DDB and eScriptorium data provided 
     * on instantiation.
     * @type {HTMLElement?}
     * @private
     */
    static #metaCheck = null;

    /**
     * Checkbox for displaying DDB data. `null`, if the class is not 
     * instantiated yet or if there was no DDB and eScriptorium data provided 
     * on instantiation.
     * @type {HTMLElement?}
     * @private
     */
    static #ddbCheck = null;

    /**
     * Distance between the data marker and the marker used for calibration. 
     * This can be set through the static update method and represents the 
     * scale of the maximum width of the eScriptorium data.
     * @type {number}
     * @private
     */
    static #dist = 1;

    /**
     * Flag for internal construction. This is `false` by default and set to
     * `true` the first time `initScene` is called. The constructor can't be
     * called while this is set to `false`.
     */
    static #isConstructing = false;

    /**
     * Constructor for the Scene class. It is private and cannot be called 
     * directly. Use Scene.initScene() to create the instance.
     * @param {Array<StringPair>} meta - Meta data to display in 
     * the scene.
     * @param {string?} ddb - Optional DDB data to display.
     * @param {Array<string>?} eScript - Optional eScriptorium data for 
     * positioning.
     * 
     * @throws {TypeError} Throws an error if this is called without the 
     * `#isConstructing` flag being set.
     * 
     * @example
     * const scene = new Scene(metaData);
     * 
     * @example
     * const scene = new Scene(metaData, ddbData, eScriptData);
     */
    constructor(meta, ddb = null, eScript = null) {
        // If called outside initScene, throw an Error, because this
        // constructor can't be called from the outside.
        if (!Scene.#isConstructing) {
            throw new TypeError(
                "Scene is not constructable. "
                + "Use Scene.getInstance() instead."
            );
        }
        // Reset the `#isConstructing` flag.
        Scene.#isConstructing = false;

        /////////////////////////////////
        // Set the private attributes. //
        /////////////////////////////////

        // This also creates an instance of the AScene class.
        Scene.#metaData = meta;
        Scene.#ddbData = ddb;
        Scene.#eScriptData = eScript;

        // If ddb and eScriptorium data is provided, 
        // create the Checkbox-UI to change between meta and ddb data.
        if (ddb != null && eScript != null) {
            Scene.#metaCheck = document.createElement("input");
            Scene.#ddbCheck = document.createElement("input");
            setAttributes(
                Scene.#metaCheck,
                {
                    "type": "checkbox",
                    "style": "top: 20px;"
                }
            );
            setAttributes(
                Scene.#ddbCheck,
                {
                    "type": "checkbox",
                    "style": "top: 90px;"
                }
            );

            // The meta data is always displayed first and can be toggled with
            // the added Checkboxes.
            Scene.#metaCheck.checked = true;

            // Add event listener to both checkboxes, so they toggle each 
            // other, but don't toggle themselves.
            Scene.#metaCheck.addEventListener("change", function() {
                if (Scene.#metaCheck.checked) {
                    Scene.#ddbCheck.checked = false;
                } else {
                    Scene.#metaCheck.checked = true;
                }
                // If the user toggles between meta and DDB data,
                // the Scene object needs to be updated, for the changes
                // to be displayed.
                Scene.update(Scene.#dist);
            });
            Scene.#ddbCheck.addEventListener("change", function() {
                if (Scene.#ddbCheck.checked) {
                    Scene.#metaCheck.checked = false;
                } else {
                    Scene.#ddbCheck.checked = true;
                }
                // If the user toggles between meta and DDB data,
                // the Scene object needs to be updated, for the changes
                // to be displayed.
                Scene.update(Scene.#dist);
            });

            /////////////////////////////////////////////
            // Attach the new Checkbox-UI to the body. //
            /////////////////////////////////////////////

            // The div will be attached to the body element and contain
            // the checkbox inputs.
            const div = document.createElement("div");
            const body = document.querySelector("body");
            // Add the meta checkbox.
            div.appendChild(Scene.#metaCheck);
            // Add a label to the meta checkbox.
            let text = document.createElement("text");
            text.innerHTML = " META";
            div.appendChild(text);
            // Add spacing.
            const br = document.createElement("br");
            div.appendChild(br);
            // Add the DDB checkbox
            div.appendChild(Scene.#ddbCheck);
            // Add a label to the DDB checkbox.
            text = document.createElement("text");
            text.innerHTML = " DDB";
            div.appendChild(text);
            // Attach the div.
            body.appendChild(div);
        }

        // Display the meta data.
        this.buildMeta();
    }

    /**
     * This method initializes the scene by calling the constructor
     * after setting the `#isConstructing` flag. The method should
     * only be called once and won't do anything if there is an instance
     * of the `Scene` class already.
     * Meta data should have the form 
     * [ [name, text], [name2, text2], ... ].
     * DDB data should have the form 
     * "line1 \n line2 \n ...".
     * eScriptorium data should have the form
     * [
     *      "Trismegistos identifier", 
     *      "maxWidth", 
     *      "maxHeight", 
     *      "line1Width!line1X!line1Y!line1Angle", 
     *      line2, ...
     * ].
     * @param {Array<StringPair>} meta - Meta data to display in 
     * the scene.
     * @param {string?} ddb - Optional DDB data to display.
     * @param {Array<string>?} eScript - Optional eScriptorium data for 
     * positioning.
     * @returns {void} This method does not return anything.
     * 
     * @example
     * Scene.initScene(metaData);
     * 
     * @example
     * Scene.initScene(metaData, ddbData, eScriptData);
     */
    static initScene(meta, ddb = null, eScript = null) {
        // Is there no instance yet?
        if (!Scene.#instance) {
            // Set flag and call constructor.
            Scene.#isConstructing = true;
            Scene.#instance = new Scene(meta, ddb, eScript);
        } else {
            // Log the problem.
            console.error("Scene already initialized");
        }
    }

    /**
     * This method builds up the scene by adding the meta data as text. The
     * method first constructs the text and then adds a `TextBox` element to
     * the data marker of the `AScene` instance.
     * @returns {void} This method does not return anything.
     */
    buildMeta() {
        // Construct the text from the meta data and compute the max
        // text line length.
        let maxLength = 0;
        let text = "<META>\n\n";
        Scene.#metaData.forEach(element => {
            const line = element[0] + ": " + element[1];
            if(line.length > maxLength) {
                maxLength = line.length;
            }
            text = text + line + "\n\n";
        });

        // Add the `TextBox` to the marker.
        AScene.getDataMarker().addTextBox(
            text, 
            Scene.#dist + 4, 
            maxLength,
            (-1 * (Scene.#dist / 2)) + " 0 2.5",
            "-90 0 0",
        );
    }

    /**
     * This method builds up the scene by adding every DDB data line as text. 
     * The method first constructs the text and then adds one `TextBox` element
     * for each line to the data marker of the `AScene` instance.
     * @returns {void} This method does not return anything.
     */
    buildDdb() { 

        ///////////////////////////
        // Set needed variables. //
        ///////////////////////////

        // eScriptorium `maxWidth` and `maxHeight`.
        const maxWidth = parseFloat(Scene.#eScriptData[1]);
        const maxHeight = parseFloat(Scene.#eScriptData[2]);
        // Ratio between eScriptorium `maxWidth` and `maxHeight`.
        const maxRatio = maxHeight / maxWidth;
        // Ratio between eScriptorium `maxWidth` and the available width.
        const widthRatio = Scene.#dist/maxWidth;
        // Maximum available height.
        const heightDist = maxRatio * Scene.#dist;
        // Ratio between eScriptorium `maxHeight` and the available height.
        const heightRatio = heightDist / maxHeight;

        // Split the ddb data into individual lines and remove empty lines.
        const ddbSplit = Scene.#ddbData.split("\n").filter(str => str !== "");
        // The length of the longest line in the DDB data.
        let maxLen = 0;
        // The eScriptorium width of this longest line
        let maxLenW = 0;
        
        // the individual parts of each line in the eScriptorium data 
        // (e.g. line width or line position).
        let subparts;

        console.log(Scene.#eScriptData)
        // Compute the values for `maxLen` and `maxLenW`. There are
        // some DDB files with more lines than their eScriptorium counterpart.
        // For these we just use the amount of lines that are covered by the 
        // eScriptorium data.
        for (
            let i = 0; 
            i < ddbSplit.length && i + 3 < Scene.#eScriptData.length; 
            i++
        ) {
            // Get each line in both data sets.
            ddbSplit[i] = ddbSplit[i].trim();
            subparts = Scene.#eScriptData[i + 3].split("!");
            // Update `maxLen` and `maxLenW`.
            if (ddbSplit[i].length > maxLen) {
                maxLen = ddbSplit[i].length;
                maxLenW = parseFloat(subparts[0]);
            }
        }

        /////////////////////////////
        // Add `TextBox` elements. //
        /////////////////////////////

        // For each line in the DDB data.
        for (
            let i = 0; 
            i < ddbSplit.length && i + 3 < Scene.#eScriptData.length; 
            i++
        ) {
            // Get the corresponding line in the eScriptorium data.
            subparts = Scene.#eScriptData[i + 3].split("!");

            // Add `TextBox` to the data marker of the `AScene` instance.
            AScene.getDataMarker().addTextBox(
                ddbSplit[i], 
                parseFloat(subparts[0])* widthRatio,
                Math.max(
                    parseFloat(subparts[0]) * (maxLen / maxLenW), 
                    ddbSplit[i].length
                ),
                (parseFloat(subparts[1]) * widthRatio - Scene.#dist) 
                + " 0 " 
                + ((parseFloat(subparts[2]) * heightRatio - 0.5) + 1),
                "-90 0 " + parseFloat(subparts[3]),
            );
        }
    }

    /**
     * This method is static and can be called to update the scene with a new
     * distance between the two marker of the scene.
     * @param {number} newDist - New Distance.
     * @returns {void} This method does not return anything.
     * 
     * @throws {Error} Will throw an error if there is no `Scene` instance.
     */
    static update(newDist) {
        // Is there a instance of the `Scene` class?
        if (!Scene.#instance) {
            throw new Error("There is no Scene to update.");
        }
        // Clear the `AScene` instance and rebuild the text displayed in the
        // scene.
        AScene.getInstance().clear();
        // Update `#dist`.
        if (newDist) {
            Scene.#dist = newDist;
        }
        // Rebuild the scene depending on which data should be displayed 
        // right now.
        if (Scene.#metaCheck == null || Scene.#metaCheck.checked) {
            Scene.#instance.buildMeta();
        } else {
            Scene.#instance.buildDdb();
        }
    }

}

/**
 * This function sets multiple attributes for a given HTMLElement.
 * @param {HTMLElement} element 
 * @param {Object<string, string>} attributes 
 * @returns {void} This function does not return anything.
 * 
 * @example
 * const div = document.createElement("div");
 * setAttributes(div, {"text": ":-)", "id": "div0"});
 */
function setAttributes(element, attributes) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}
