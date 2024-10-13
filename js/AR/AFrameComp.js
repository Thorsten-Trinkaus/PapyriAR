/**
 * @module calibration
 * @description
 * This AFrame component can be used to calculate the distance between two 
 * `a-marker` elements. The component, when attached to a `a-marker` element,
 * gets a query selector as its property. This should be the id of the second
 * `a-marker`. The `tick` handler will be called every frame and calculate the
 * distance between both elements, if both are visible. This distance is then 
 * set as an attribute for the element this component is attached to.
 * 
 * @example
 * const mark = document.createElement("a-marker");
 * const er = document.createElement("a-marker");
 * er.setAttribute("id", "er");
 * mark.setAttribute("calibration", "#er");
 */
AFRAME.registerComponent("calibration", 
    {
        // Property of type `selector` with default value `null`.
        schema: {type: "selector"},

        // The `init` handler is called once after the element is set up and
        // ready. The method sets some variables needed for this component to
        // function.
        init: function ()
        {
            // The two `a-marker` elements.
            this.datMarker = this.data;
            this.calMarker = this.el;
            // The distance value, set to a default value.
            this.dist = 1;
            // Set the `dist` attribute of the attached marker.
            this.el.setAttribute("dist", this.dist);
            // Two vector elements. These are used to store and compare
            // the 3D positions of the two markers.
            this.p0 = new THREE.Vector3();
            this.p1 = new THREE.Vector3(); 
        },

        // The `tick` handler is called every frame and handles the 
        // main computation.
        tick: function ()
        {
            // The computation is only possible if both marker are visible.
            if (this.datMarker.visible && this.calMarker.visible) {

                // Set the vectors.
                this.datMarker.object3D.getWorldPosition(this.p0);
                this.calMarker.object3D.getWorldPosition(this.p1);

                // Update the `dist` attribute if needed.
                if (this.dist != this.p0.distanceTo(this.p1)) {
                    this.dist = this.p0.distanceTo(this.p1);
                    this.el.setAttribute("dist", this.dist);
                }
            }
        }
    }
);

  
/**
 * @module rounded
 * @description
 * This AFrame component can be attached to any `a-entity`element with a plane 
 * geometry and text component. The component only consists of a `init` 
 * handler, which uses the dimensions of the text component to change the 
 * geometry of the plane, such that its corners are rounded off, while still 
 * fitting all of the content. The property of this component is a number and
 * represents the radius of the rounded corners.
 * 
 * @example
 * const text = document.createElement("a-entity");
 * text.addAttribute("geometry", "primitive: plane; width: 0; height: 0;");
 * text.addAttribute("text", "value: hello world; width: 10;");
 * text.addAttribute("rounded", "0.1");
 */
AFRAME.registerComponent("rounded", 
    {
        // Property of type `number` with default value 0.1.
        schema: {type: "number", default: 0.1},

        // The `init` handler recomputes the geometry.
        init: function () {

            // Get the property.
            const radius = this.data;
            // This is needed inside the event listener!
            const el = this.el;

            // Wait for the text component to be fully loaded and sized.
            this.el.addEventListener("textfontset", function () {
                // Text component for sizing.
                const textComponent = el.getAttribute("text");

                // If the component consists of multiple lines of text,
                // find the longest one.
                let maxLength = 0;
                const lines = textComponent.value.split("\n");
                
                if (lines.length > 1) {
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].length > maxLength) {
                            maxLength = lines[i].length;
                        }
                    }
                } else {
                    maxLength = textComponent.value.length;
                }

                //////////////////////////////////////////////////////////
                // Get width and height values from the text component. //
                //////////////////////////////////////////////////////////

                // `wrapCount` describes the number of characters before 
                // wrapping text.
                const wrapCount = textComponent.wrapCount;
                const textWidth = textComponent.width;

                const width = maxLength * (textWidth / wrapCount);
                
                const height = 2.5 * (width / maxLength) * lines.length;

                const halfWidth = width / 2;
                const halfHeight = height / 2;

                // Make sure the radius is not bigger than the box height.
                const trueRadius = radius > halfHeight? halfHeight : radius;

                // Check if everything worked.
                if (width > 0 && height > 0) {

                    ///////////////////////////////
                    // Compute the new geometry. //
                    ///////////////////////////////

                    // Create the shape.
                    const shape = new THREE.Shape();
                    // Define the shape with rounded corners, 
                    // using lines and quadratic curves.
                    // More information on these operations can be found in
                    // the three.js documentation:
                    // https://threejs.org/docs/#api/en/extras/core/ShapePath
                    shape.moveTo(-halfWidth + trueRadius, halfHeight);
                    shape.lineTo(halfWidth - trueRadius, halfHeight);
                    shape.quadraticCurveTo(
                        halfWidth, halfHeight, 
                        halfWidth, halfHeight - trueRadius
                    );
                    shape.lineTo(halfWidth, -halfHeight + trueRadius);
                    shape.quadraticCurveTo(
                        halfWidth, -halfHeight, 
                        halfWidth - trueRadius, -halfHeight
                    );
                    shape.lineTo(-halfWidth + trueRadius, -halfHeight);
                    shape.quadraticCurveTo(
                        -halfWidth, -halfHeight, 
                        -halfWidth, -halfHeight + trueRadius
                    );
                    shape.lineTo(-halfWidth, halfHeight - trueRadius);
                    shape.quadraticCurveTo(
                        -halfWidth, halfHeight, 
                        -halfWidth + trueRadius, halfHeight
                    );

                    // Create geometry from the shape and apply it to the mesh 
                    // of the plane.
                    const geometry = new THREE.ShapeBufferGeometry(shape);
                    el.getObject3D("mesh").geometry = geometry;
                } else {
                    // Warn that something went wrong.
                    console.warn(
                        "Text width / height couldn't be calculated correctly:"
                        + "\nwidth: " + width
                        + "\nheight " + height
                    );
                }
            });
        }
    }
);