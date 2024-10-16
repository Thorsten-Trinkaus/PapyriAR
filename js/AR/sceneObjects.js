/**
 * @class
 * This class is designed to represent a `a-entity` element of given type 
 * from the {@link https://aframe.io/ AFrame framework}, 
 * but it can also handle any normal HTML element type. The main idea behind 
 * this class is to provide a easy way to handle `a-entity` elements and 
 * to create a base class for more specific `a-entity` types. The methods of 
 * this class are modeled after real HTML operations, so elements of 
 * this class can still be used just like any HTML element, while allowing
 * the possibility of additional operations. 
 * 
 * @see AScene for a specialized `a-scene` element.
 * @see AMarker for a specialized `a-marker` element.
 * @see TextBox for a specialized `a-entity` element, 
 * which implements text content in the scene.
 */
class Element {
    /**
     * Create a instance of the `Element` class.
     * @param {string} type - The type of element to create.
     * 
     * @example
     * const marker = new Element("a-marker");
     */
    constructor(type) {
        /**
         * The type of the element.
         * @type {string}
         */
        this.type = type;
        
        /**
         * The actual HTML element.
         * @type {HTMLElement}
         */
        this.element = document.createElement(type);

        /**
         * The parent element, if there is one.
         * @type {Element?}
         */
        this.parent = null;

        /**
         * A map of all the children for this element, keyed by their type.
         * @type {Map<string, Array<Element>>}
         */
        this.children = new Map();
    } 

    /**
     * This method appends a child element to this element. The child
     * needs to be an instance of the `Element` class too.
     * @param {Element} child - The child element.
     * @returns {Element} Returns the appended child.
     * 
     * @throws {TypeError} Will throw an error, if the child is no instance
     * of the `Element` class.
     * 
     * @example
     * const parent = new Element("a-scene");
     * const child = new Element("a-marker");
     * parent.appendChild(child);
     */
    appendChild(child) {
        // Check for an instance of the `Element` class.
        if (!(child instanceof Element)) {
            throw new TypeError(
                "The child needs to be an instance of Element!"
            );
        }

        // Append the actual HTML element.
        this.element.appendChild(child.element);

        // Update parent and child.
        child.parent = this;
        if (!this.children.get(child.type)) {
            this.children.set(child.type, [child]);
        } else {
            this.children.get(child.type).push(child);
        }

        return child;
    }

    /**
     * This method clears all the child elements from this element and also 
     * removes them from the DOM.
     * @returns {void} This method does not return anything.
     * 
     * @example
     * const parent = new Element("a-scene");
     * const child = new Element("a-marker");
     * parent.clear();
     * // This removes child from the parent element and the DOM.
     */
    clear() {
        // Remove the actual HTML elements.
        this.children.forEach((value, key) => {
            value.forEach(el => {
                el.element.remove();
            });
        });

        // Clear the children map.
        this.children = new Map();
    }

    /**
     * Setter method for a single attribute on the element.
     * @param {string} key - The name of the attribute.
     * @param {string} value - The value to set.
     * @returns {Element} Returns the the current element for method chaining.
     * 
     * @example
     * const sun = new Element("a-entity");
     * sun.setAttribute("pros", "life").setAttribute("cons", "deadly laser");
     * // This will set the two attributes "pros" and "cons".
     */
    setAttribute(key, value) {
        // Directly set the value of the attribute on the HTML element.
        this.element.setAttribute(key, value);
        return this;
    }

    /**
     * Setter method for multiple attributes on the element at once.
     * @param {Object<string, string>} attributes - Object, where each key is
     * an attribute name, and the corresponding value is the value of the
     * attribute.
     * @returns {Element} Returns the the current element for method chaining.
     * 
     * @example
     * const sun = new Element("a-entity");
     * sun.setAttributes({
     *  "pros": "life",
     *  "cons": "deadly laser"
     * });
     * // This will set two attributes "pros" and "cons".
     */
    setAttributes(attributes) {
        // For each attribute, directly set the value on the HTML element.
        for (let key in attributes) {
            this.element.setAttribute(key, attributes[key]);
        }
        return this;
    }

    /**
     * Getter method for the value of an attribute on the element.
     * @param {string} key - The name of the attribute.
     * @returns {string?} The value of the attribute or `null`, if the
     * attribute does not exist.
     * 
     * @example
     * const universe = new Element("a-entity");
     * universe.setAttribute("answer", "42");
     * console.log(element.getAttribute("answer"));
     * // This will output "42".
     * console.log(element.getAttribute("question"));
     * // This will output "null"!
     */
    getAttribute(key) {
        // Directly return the value of the attribute on the HTML element.
        return this.element.getAttribute(key);
    }
}

/**
 * This class represents a singleton `a-scene` element for use in the AR.js
 * context. This will extend the basic `Element` class.
 * The class is responsible for setting up the needed markers and managing 
 * updates to the `a-scene`.
 * 
 * This extends the class Element.
 * @singleton
 * @see Element for the base class.
 */
class AScene extends Element {

    /**
     * The singleton instance of this class. `null`, if the instance is 
     * not instantiated yet.
     * @type {AScene?}
     * @private
     */
    static #instance = null;

    /**
     * Flag to symbolize if the constructor is called internally.
     * @type {boolean}
     * @private
     */
    static #isInternalConstructing = false;

    /**
     * The two marker needed for the Scene to work. The first one is
     * the data marker, where all texts get attached to. The second
     * marker is used for calibrating the distance between the two marker.
     * `null` if not instantiated.
     * @type {Array<AMarker?>}
     * @private
     */
    static #marker = [null, null];

    /**
     * Private constructor, such that this can not be directly instantiated.
     * Throws an error if this is called outside of `getInstance`.
     * 
     * @throws {TypeError} Will throw an error, if attempting to instantiate 
     * directly.
     * 
     * @see AScene.getInstance for access to the singleton instance.
     */
    constructor() {
        // Check if the call came from the inside.
        if (!AScene.#isInternalConstructing) {
            throw new TypeError(
                "AScene is not constructable. "
                + "Use AScene.getInstance() instead."
            );
        }
        // Reset the flag
        AScene.#isInternalConstructing = false;

        // Super.
        super("a-scene");

        // Set all attributes for the instance.
        const attributes = {
            "id": "scene",                          // ID in the DOM.
            "embedded": "",                         // Fit the scene into the 
                                                    // parent container.
            "arjs": "sourceType: webcam;"           // Define the AR.js source.
                + "detectionMode: mono_and_matrix;" // Recognize mono and 
                                                    // matrix marker.
                + "matrixCodeType: 3x3;"            // Matrix marker code type.
                + "sourceWidth: 1280;"              // Resolution Webcam feed.
                + "sourceHeight: 960;"              // ""
                + "displayWidth: 1280;"             // Resolution of the scene.
                + "displayHeight: 960",             // ""
            "renderer": "precision: high;",         // Render precision.
            "vr-mode-ui": "enabled: false"          // Disable default vr UI.
        };
        this.setAttributes(attributes);

        // Append this HTML element directly to the body of the DOM.
        this.parent = document.querySelector("body");
        this.parent.appendChild(this.element);

        ////////////////////////////
        // Append other elements. //
        ////////////////////////////

        // Camera element.
        const camera = new Element("a-entity").setAttribute("camera", "");
        this.appendChild(camera);
        // Data marker.
        AScene.#marker[0] = this.appendChild(new AMarker("1"));
        // Marker used for calibration.
        AScene.#marker[1] = this.appendChild(new AMarker("0"));
        
        // Set the attributes on the marker. This is needed for calibration.
        AScene.#marker[0].setAttribute("id", "data");
        AScene.#marker[1].setAttribute("dist", 1);
        // Attach the `calibration` AFrame component. The timeout is needed,
        // to make sure the id of the first marker is set and ready to be 
        // queried.
        // The AFrame component is defined in AFrameComp.js.
        setTimeout(() => {
            AScene.#marker[1].setAttribute("calibration", "#data");
        }, 0);

        // The distance between the two markers. This is needed for the
        // method `update`.
        this.dist = Number(AScene.#marker[1].getAttribute("dist")); 
        
        // Override the appendChild method to disable it.
        this.appendChild = function() {};

        // Request a animation frame for the update method.
        requestAnimationFrame(this.update);
    }

    /**
     * Update method for recalculating the distance and triggering updates 
     * in the Scene instance. The method is invoked recursively using
     * `requestAnimationFrame`.
     * @returns {void} This method does not return anything.
     * 
     * @see Scene for the `Scene` instance.
     */
    update() {
        // Get the current distance.
        const dist = Number(AScene.#marker[1].getAttribute("dist"));

        // Are the old and new distances valid and different?
        if (AScene.getInstance().dist 
            && 
            dist 
            && 
            AScene.getInstance().dist != dist
        ) {
            // Update distance.
            AScene.getInstance().dist = dist;
            // Update `Scene` instance
            Scene.update(dist);
        }

        // Request the next animation frame.
        requestAnimationFrame(AScene.getInstance().update);
    }

    /**
     * This method clears the two marker in the scene.
     * @returns {void} This method does not return anything.
     * 
     * @override
     */
    clear() {
        AScene.#marker[0].clear();
        AScene.#marker[1].clear();
    }

    /**
     * This method returns the singleton instance of the `AScene` class.
     * If the instance does not exist, create it.
     * @returns  {AScene} The singleton instance.
     */
    static getInstance() {
        if (!AScene.#instance) {
            AScene.#isInternalConstructing = true;
            AScene.#instance = new AScene();
        }
        return AScene.#instance;
    }

    /**
     * This method removes the current singleton instance.
     * @returns {void} This method does not return anything.
     */
    static removeInstance() {
        if (AScene.#instance) {
            AScene.update = function() {};
            AScene.#instance.element.remove();
            AScene.#instance = null;
            AScene.#marker = [null, null];
        }
    }

    /**
     * Getter method for the data marker. If no instance of the `AScene`
     * class exists, create one.
     * @returns {AMarker} The data marker.
     */
    static getDataMarker() {
        if (!AScene.#instance) {
            AScene.getInstance();
        }
        return AScene.#marker[0];
    }
}

/**
 * This class represents a `a-marker` element for use in the AR.js context.
 * The marker will always be of type "barcode".
 * This is the heart of the scene and all other elements need to be connected
 * to a marker, for them to be visible in the scene.
 * 
 * For more information about barcode markers and possible values look at:
 * {@link https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection/tree/master Marker}
 * 
 * This extends the class Element.
 * @see Element for the base class. 
 */
class AMarker extends Element {
    /**
     * Create an instance of the `AMarker` class.
     * @param {string} value - The barcode value of the marker.
     * 
     * @example
     * const oh = new AMarker("0");
     * const hey = new AMarker("1");
     * const mark = new AMarker("5");
     */
    constructor(value) {
        // Super.
        super("a-marker");

        // Set attributes.
        const attributes = {
            "type": "barcode",          // Marker type.
            "value": value,             // Barcode value.
            "smooth": "true",           // Enable smoothing out the tracking 
                                        // data.
            "smoothCount": "10",        // Number of frames used for smoothing 
                                        // the marker position.
            "smoothTolerance": "0.01",  // Min difference in marker position 
                                        // required for smoothing.
            "smoothThreshold": "5"      // Threshold for smoothing. If the 
                                        // marker movement exceeds this, the 
                                        // marker position is updated directly
                                        // without smoothing.
        };
        this.setAttributes(attributes);
        // Flag for the visibility of the marker in the scene. This is applied 
        // to the HTML element, because the event listener are attached to this
        // element.
        this.element.visible = false;

        // Event listener to update the visibility.
        this.element.addEventListener("markerFound", function() {
            this.visible = true;
        });
        this.element.addEventListener("markerLost", function() {
            this.visible = false;
        });
    }

    /**
     * Getter method for the visibility flag of this element, because the
     * flag is not attached to the element directly.
     * @returns {boolean} Returns the visibility flag.
     */
    getVisibility() {
        return this.element.visible;
    }

    /**
     * The method highlights this marker in the scene, by adding a colored box
     * on top of the marker. 
     * @param {string} color - The color of the box.
     * @returns {void} This method does not return anything.
     * 
     * @example
     * const marker = new AMarker("1");
     * marker.highlightMarker("red");
     * 
     * @example
     * const marker = new AMarker("1");
     * marker.highlightMarker("rgb(255, 0, 100)");
     */
    highlightMarker(color) {
        const box = new Element("a-box");
        box.setAttributes({
            "position": "0 0 0",
            "material": "opacity: 0.5; color: " + color + ";"
        });
        this.appendChild(box);
    }

    /**
     * This method creates a `TextBox` element and appends it to this marker.
     * The `textColor` is set to "black". The `boxColor` is set to "white".
     * The `boxOpacity`is set to "0.3".
     * @param {string} value - The text value of the `TextBox`.
     * @param {string | number} width - The width of the text block.
     * @param {string | number} wrapCount - Number of characters before 
     * wrapping text.
     * @param {string} position - Position of the `TextBox` relative to 
     * the marker position.
     * @param {string} rotation - Rotation around the center of the new 
     * `TextBox` element in dec.
     * @returns {TextBox} The added `TextBox` element.
     * 
     * @example
     * const marker = new AMarker("1");
     * marker.addTextBox(
     *  "Beware of the TextBox-Mimic!", 
     *  "10", 
     *  50, 
     *  "0 1 0.5", 
     *  "-90 0 10"
     * );
     */
    addTextBox(value, width, wrapCount, position, rotation) {
        const textBox = new TextBox(
            value, width, wrapCount, "black", "white", 
            position, rotation, "0.6"
        );
        this.appendChild(textBox);
        return textBox;
    }
}

/**
 * This class represents a `a-entity` element with a plane geometry and text
 * component. Text added to the scene should be added as `TextBox` elements.
 * 
 * This extends the class Element.
 * @see Element for the base class. 
 */
class TextBox extends Element {
    /**
     * Create an instance of the `TextBox` class.
     * @param {string} value - The text value.
     * @param {string | number} width - The width of the text block.
     * @param {string | number} wrapCount - Number of characters before 
     * wrapping text.
     * @param {string} position - Relative Position.
     * @param {string} rotation - Rotation around the center.
     * @param {string} textColor - The color of the text.
     * @param {string} boxColor - The color of the box.
     * @param {string | number} boxOpacity - Opacity of the box.
     *
     * @example
     * const angel = new TextBox(
     *  "Don't blink!", 
     *  10, 
     *  "10", 
     *  "0 0 -1.3", 
     *  "-90 10 0", 
     *  "red", 
     *  "rgb(0, 0, 0)", 
     *  0.5
     * );
     */
    constructor(
        value, width, wrapCount, textColor, boxColor,
        position, rotation, boxOpacity
    ) {
        // Super.
        super("a-entity");

        // Set attributes.
        const attributes = {
            // Geometry.
            "geometry": "primitive: plane;"     
                + "width: 0;"                       // The width and height
                + "height: 0;",                     // of the plane geometry
                                                    // are set automatically
                                                    // to fit the text content.
            // Position.
            "position": position,
            // Rotation.
            "rotation": rotation,
            // Material.
            "material": "depthTest: false;"         // This needs to be false,
                                                    // to avoid z-fighting 
                                                    // between the text
                                                    // component and the plane
                                                    // geometry.
                + "color: " + boxColor + ";"
                + "opacity: " + boxOpacity + ";"
                + "transparent: true",
            // Text component.
            "text": "value: " + value + ";"   
                + "width: " + width + ";"
                + "align: center;"                  // Text align on the plane.
                + "wrap-count: " + wrapCount + ";"  // Don't get fooled by the
                                                    // AFrame docs. This needs
                                                    // to be written as 
                                                    // "wrap-count" and not
                                                    // "wrapCount".
                + "color: " + textColor + ";"
                + "font: custom-msdf.json;"         // Custom font, because
                                                    // AFrame only supports
                                                    // standard ASCII by
                                                    // default.
                + "font-image: custom.png;"         // Image for the custom
                                                    // font.
                + "negate: false;",                 // This needs to be set
                                                    // in order for the custom
                                                    // font to work correctly.
            
            // Custom AFrame component defined in AFrameComp.js. For short,
            // this rounds off the corners of the box geometry.                     
            "rounded": "0.5"
        };
        this.setAttributes(attributes);
        
    }

    /**
     * This method changes the color of the text component.
     * @param {string} newColor - New color.
     * @returns {TextBox} Returns the the current element for method chaining.
     * 
     * @example
     * const warning = new TextBox(
     *  "This is a example!",
     *  10, 
     *  "10", 
     *  "0 0 -1.3", 
     *  "-90 10 0", 
     *  "white", 
     *  "rgb(0, 0, 0)", 
     *  0.5
     * );
     * warning.changeTextColor("red");
     */
    changeTextColor(newColor) {
        // Get the current text component.
        const textComponent = this.getAttribute("text");
        // Make sure the text component is loaded and ready.
        if (textComponent) {
            textComponent["color"] = newColor;
            // Update the text component.
            this.setAttribute("text", textComponent);
        }

        // Return the current element.
        return this;
    }

    /**
     * This method changes the color of the plane.
     * @param {string} newColor - new color.
     * @returns {TextBox} Returns the current element for method chaining.
     * 
     * @example
     * const text = new TextBox(
     *  "This is a example!",
     *  10, 
     *  "10", 
     *  "0 0 -1.3", 
     *  "-90 10 0", 
     *  "white", 
     *  "rgb(0, 0, 0)", 
     *  0.5
     * );
     * text.changeTextColor("white").changeBoxColor("black");
     * // This changes the text from light-mode to dark-mode.
     */
    changeBoxColor(newColor) {
        // Get the current material.
        const material = this.getAttribute("material");
        // Make sure the material is loaded and ready.
        if (material) {
            material["color"] = newColor;
            // Update the material.
            this.setAttribute("material", material);
        }

        // Return the current element.
        return this;
    }
}