let scene;

function basicScene() {
    scene = new AScene(document.getElementById("body"));
    const marker = scene.addMarker("1");
    const box = new Element("a-box", [
        ["position", "0 0.5 0"],
        ["material", 'opacity: 0.5; side: double;color:black;']
    ]);
    marker.appendChild(box);
    return marker;
}

function buildMeta(meta) {
    const marker = basicScene();
    let count = 0;
    meta.forEach(element => {
        marker.addTextLine(
            element[0] + ": " + element[1], 
            5, 
            {x: 3, y: 0, z: count}
        );
        count += 2/element.length - 0.1;
    });
    return marker;
}

function buildScene(meta, ddb, parts) {
    const marker = buildMeta(meta);
    let ddb_split = ddb.split("\n");
    let subparts;
    let maxWidth = parseFloat(parts[1])/300;
    ddb_split = ddb_split.filter(st5r => st5r !== "");
    for (let i = 0; i < ddb_split.length && i + 2 < parts.length; i++) {
        subparts = parts[i + 2].split("-");
        ddb_split[i] = ddb_split[i].trim();
        marker.addTextLine(
            ddb_split[i], 
            parseFloat(subparts[0])/300, 
            {
                x: parseFloat(subparts[1])/300 - 0.5 - maxWidth, 
                y: 0, 
                z: parseFloat(subparts[2])/300 - 0.5
            }, 
            parseFloat(subparts[3])
        );
    }
}