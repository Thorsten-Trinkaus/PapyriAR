

class Element {
    constructor(type, attributes) {
        this.type = type;
        this.element = document.createElement(type);
        attributes.forEach(arr => {
            this.element.setAttribute(arr[0], arr[1]);
        });
        this.parent = null;
        this.children = new Map();
    } 

    /**
     * 
     * @param {!Element} child 
     */
    appendChild(child) {
        this.element.appendChild(child.element);
        child.parent = this;
        if (!this.children.get(child.type)) {
            this.children.set(child.type, [child]);
        } else {
            this.children.get(child.type).push(child);
        }
        return child;
    }
}

// This is a singleton.
class AScene extends Element {

    static #instance = null;
    static #isInternalConstructing = false;
    static #marker = [null, null];

    constructor() {
        if (!AScene.#isInternalConstructing) {
            throw new TypeError(
                "AScene is not constructable. "
                + "Use AScene.getInstance() instead."
            );
        }
        const attributes = [
            ["id", "scene"],
            ["embedded", ""],
            [
                "arjs",
                "sourceType: webcam; "
                + "detectionMode: mono_and_matrix; "
                + "matrixCodeType: 3x3; "
                + "sourceWidth: 1280; "
                + "sourceHeight: 960; "
                + "displayWidth: 1280; "
                + "displayHeight: 960"
            ],
            ["renderer", "precision: high;"],
            ["vr-mode-ui", "enabled: false"]
        ];
        super("a-scene", attributes);
        this.attributes = attributes;
        this.parent = document.querySelector("body");
        this.parent.appendChild(this.element);
        this.appendChild(new Element("a-entity", [["camera", ""]]));
        AScene.#marker[0] = this.appendChild(
            new AMarker("1", "black", "data")
        );
        AScene.#marker[1] = this.appendChild(
            new AMarker("0", "white", "calibration")
        );
        AScene.#isInternalConstructing = false;
    }

    update(dist) {
        AScene.#marker[0].children.forEach((value, key) => {
            value.forEach(el => {
                el.element.remove();
            });
        });
        AScene.#marker[0].children = new Map();
        AScene.#marker[0].appendChild(new Element("a-box", [
            ["position", "0 0.5 0"],
            ["material", "opacity: 0.3; side: double; color: black;"]
        ]));
        rebuildScene(dist);
    }

    static getInstance() {
        if (!AScene.#instance) {
            AScene.#isInternalConstructing = true;
            AScene.#instance = new AScene();
        }
        return AScene.#instance;
    }

    static remove() {
        if (AScene.#instance) {
            AScene.#instance.element.remove();
            AScene.#instance = null;
            AScene.#marker = [null, null];
        }
    }

    static getDataMarker() {
        if (!AScene.#instance) {
            AScene.getInstance();
        }
        return AScene.#marker[0];
    }
}

/**
 * This will be a <a-marker> element of type barcode.
 */
class AMarker extends Element {
    constructor(value, color, mode) {
        if (mode) {
            super("a-marker", [
                ["type", "barcode"],
                ["value", value],
                ["smooth", "true"],
                ["smoothCount"="10"],
                ["smoothTolerance"=".01"],
                ["smoothThreshold"="5"],
                [mode, ""]
            ]);
        } else {
            super("a-marker", [
                ["type", "barcode"],
                ["value", value],
                ["smooth", "true"],
                ["smoothCount"="10"],
                ["smoothTolerance"=".01"],
                ["smoothThreshold"="5"]
            ]);
        }
        
        this.appendChild(new Element("a-box", [
            ["position", "0 0.5 0"],
            ["material", "opacity: 0.3; side: double; color: " + color + ";"]
        ]));
    }

    addTextBox(value, width, wrapCount, position, rotation) {
        const textBox = new TextBox(
            value, 
            width, 
            wrapCount, 
            "center", 
            "white", 
            "black", 
            position, 
            "-90 0 " + rotation
        );
        this.appendChild(textBox);
        return textBox;
    }
}

class TextBox extends Element {
    constructor(
        value, width, wrapCount, align, boxColor, textColor, 
        position = "0 0 0", rotation = "0 0 0"
    ) {
        const attributes = [
            ["geometry", "primitive: plane; width: 0; height: 0;"],
            ["position", position],
            ["rotation", rotation],
            [
                "material", 
                "depthTest: false; color: " + boxColor + ";"
                + "opacity: 0.6; transparent: true"
            ],
            [
                "text",
                "value: " + value + "; "
                + "width: " + width + "; "
                + "wrap-count: " + wrapCount + "; "
                + "align: " + align + "; "
                + "color: " + textColor + "; "
                + "font: custom-msdf.json; "
                + "font-image: custom.png; "
                + "negate: false; "
            ]
        ];
        super("a-entity", attributes);
    }
}

class AText extends Element {
    constructor(
        value, width, wrapCount, align, color, 
        position = "0 0 0", rotation = "0 0 0"
    ) {
        const attributes = [
            ["value", value],
            ["width", width],
            ["wrap-count", wrapCount],
            ["align", align],
            ["color", color],
            ["position", position],
            ["rotation", rotation],
            ["font", "custom-msdf.json"],
            ["font-image", "custom.png"],
            ["negate", "false"],
            ["z-offset", 0.1],
            ["material", "depthTest: false;"]
        ];
        
        super ("a-text", attributes);
        const textBoxAttr = [
            [
                "geometry", 
                "primitive: plane; width: " + width + ";"
                + "height: " + (width/value.length + 0.5) + ";"
            ],
            ["material", "depthTest: false; color: #ffffff; opacity: 0.5;"],
            ["rounded", "borderRadius: 0.2; borderWidth: 0.05"],
        ];
        this.appendChild(new Element("a-entity", textBoxAttr));
    }
}
