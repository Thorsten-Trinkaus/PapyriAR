AFRAME.registerComponent("rounded", {
    schema: {
      borderRadius: { type: "number", default: 0.05 },
      borderWidth: { type: "number", default: 0.05 },
    },
    init: function () {
      const data = this.data;
      const el = this.el;

      const geometry = new THREE.Shape();

      const width = el.getAttribute("geometry").width / 2;
      const height = el.getAttribute("geometry").height / 2;

      geometry.moveTo(-width + data.borderRadius, -height);
      geometry.lineTo(width - data.borderRadius, -height);
      geometry.quadraticCurveTo(width, -height, width, -height + data.borderRadius);
      geometry.lineTo(width, height - data.borderRadius);
      geometry.quadraticCurveTo(width, height, width - data.borderRadius, height);
      geometry.lineTo(-width + data.borderRadius, height);
      geometry.quadraticCurveTo(-width, height, -width, height - data.borderRadius);
      geometry.lineTo(-width, -height + data.borderRadius);
      geometry.quadraticCurveTo(-width, -height, -width + data.borderRadius, -height);

      const shapeGeometry = new THREE.ShapeBufferGeometry(geometry);
      const material = new THREE.MeshStandardMaterial({ 
          color: el.getAttribute("material").color,
          opacity: el.getAttribute("material").opacity,
          transparent: true,
      });

      const mesh = new THREE.Mesh(shapeGeometry, material);
      el.setObject3D("mesh", mesh);
    },
});

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

    appendChild(child) {
        this.element.appendChild(child.element);
        child.parent = this;
        if (!this.children.get(child.type)) {
            this.children.set(child.type, [child]);
        } else {
            this.children.get(child.type).push(child);
        }
    }

    removeChild(child) {
        this.element.removeChild(child.element);
        child.parent = null;
        if (this.children.get(child.type)) {
            const index = this.children.get(child.type).indexOf(child);
            if (index > -1) {
                this.children.get(child.type).splice(index, 1);
            }
        }
    }

    updatePosition(x, y, z) {
        this.element.setAttribute('position', { x: x, y: y, z: z });
    }

    updateRotation(x, y, z) {
        this.element.setAttribute('rotation', { x: x, y: y, z: z });
    }

    updateScale(x, y, z) {
        this.element.setAttribute('scale', { x: x, y: y, z: z });
    }
}

class AScene extends Element {
    constructor(htmlBody) {
        const attributes = [
            ["embedded", ""],
            [
                "arjs",
                "sourceType: webcam; " + 
                "detectionMode: mono_and_matrix; " + 
                "matrixCodeType: 3x3;"
            ], 
            ["renderer", "precision: high;"]
        ];
        super("a-scene", attributes);
        htmlBody.appendChild(this.element);
        this.appendChild(new Element("a-entity", [["camera", ""]]));
        this.marker = [];
    }

    addMarker(value) {
        const marker = new AMarker(value);
        this.appendChild(marker);
        this.marker.push(marker);
        return marker;
    }
}

class AMarker extends Element {
    constructor(value) {
        const attributes = [
            ["type", "barcode"],
            ["value", value],
        ];
        super("a-marker", attributes);
    }

    addTextLine(value, width, position, rotation) {
        const text = new AText(value, width, position, { x: -90, y: 0, z: rotation });
        this.appendChild(text);
        return text;
    }
}

class AText extends Element {
    constructor(value, width, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }) {
        const attributes = [
            ["value", value],
            ["width", width],
            ["wrap-count", value.length],
            ["position", { x: position.x, y: position.y + 0.2, z: position.z }],
            ["rotation", rotation],
            ["align", "center"],
            ["color", "black"],
            ["font", "custom-msdf.json"],
            ["font-image", "custom.png"],
            ["negate", "false"],
            ["z-offset", 0.5]
        ];
        
        super("a-text", attributes);
        const textBoxAttr = [
            ["geometry", "primitive: plane; width: " + width + "; height: " + (width / value.length + 0.5) + ";"],
            ["material", "color: #ffffff; opacity: 0.7; transparent: true"],
            ["position", { x: 0, y: 0, z: 0 }],
            ["rounded", "borderRadius: 0.2; borderWidth: 0.05"],
            ["rotation", { x: 0, y: 0, z: 0 }]
        ];
        this.appendChild(new Element("a-entity", textBoxAttr));
    }

    
}
