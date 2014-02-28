/* Change Playgrounds */
function changeFunc() {
    var selectBox = document.getElementById("selectPlayground");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    document.location.href = selectedValue;
}
/*
function playgroundSwitcher() {
	var node = document.body;
	node.innerHTML += '<div id="playground-switch" style="position: absolute; bottom: 0; right: 0; left: 0; margin: auto;"><select id="selectPlayground" onchange="changeFunc();"><option value="/Users/nic/playground/index.html">Playground OG</option><option value="/Users/nic/playground/coachmarks/index.html">Coachmarks</option><option value="/Users/nic/playground/design-shop/index.html">Design Shop</option></select></div>';
}
window.onload = playgroundSwitcher;
*/