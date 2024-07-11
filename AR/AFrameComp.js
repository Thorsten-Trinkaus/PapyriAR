let dataMarkerVisible = false;
let dataMarker = null;
let calibrationMarkerVisible = false;
let dist = 1;

AFRAME.registerComponent("data", {
    init: function () 
    {
        dataMarker = this.el;
        this.el.addEventListener(
            "markerFound", 
            function() {
                dataMarkerVisible = true;
            }
        );
        this.el.addEventListener(
            "markerLost", 
            function() {
                dataMarkerVisible = false;
            }
        );
    }
});

AFRAME.registerComponent("calibration", {
    init: function () 
    {
        this.m0 = dataMarker;
        this.m1 = this.el;
        this.p0 = new THREE.Vector3();
        this.p1 = new THREE.Vector3(); 
        this.el.addEventListener(
            "markerFound", 
            function() {
                calibrationMarkerVisible = true;
            }
        );
        this.el.addEventListener(
            "markerLost", 
            function() {
                calibrationMarkerVisible = false;
            }
        );
    },
    tick: function ()
    {
        if (dataMarkerVisible && calibrationMarkerVisible) {
            this.m0.object3D.getWorldPosition(this.p0);
            this.m1.object3D.getWorldPosition(this.p1);
            if (dist != this.p0.distanceTo(this.p1)) {
                dist = this.p0.distanceTo(this.p1);
                AScene.getInstance().update(dist);
            }
        }
    }
});
