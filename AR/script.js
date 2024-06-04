const box = document.querySelector("#box");
const text = document.createElement("a-text");
text.setAttribute('rotation', {x: -90,y: 0,z: 1});
text.setAttribute('position', {x: 0, y: 0, z: 1});
text.setAttribute('color', "blue");
text.setAttribute('width', "5");
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
const page = getQueryParameter('page');
if (page) {
    text.setAttribute('value', `${page}`);
} else {
    text.setAttribute('value', "nothing here");
}
box.appendChild(text);
console.log(box,text);