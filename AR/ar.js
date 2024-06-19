const box = document.querySelector("#box");
let lineCount = 0;

/**
 * 
 * @param {!string} text 
 * @param {!string} color 
 * @param {number} width 
 */
function addLine(text, color, width = 5) {
    const textEl = document.createElement("a-text");
    textEl.setAttribute("rotation", {x: -90,y: 0,z: 0});
    textEl.setAttribute("position", {x: 0, y: -lineCount, z: 1});
    textEl.setAttribute("color", color);
    textEl.setAttribute("width", toString(width));
    textEl.setAttribute("value", text);
    box.appendChild(textEl);
    lineCount++;
}

/**
 * The three lists must have the same length.
 * @param {!string[]} content 
 * @param {!string[]} colors 
 * @param {!number[]} widths 
 */
function addLines(content, colors, widths) {
    if (content.length != colors.length || colors.length != widths.length) {
        console.error("The three lists must have the same length.");
        return;
    }
    for (let i = 0; i < content.length; i++) {
        addLine(content[i], colors[i], widths[i]);
    }
}