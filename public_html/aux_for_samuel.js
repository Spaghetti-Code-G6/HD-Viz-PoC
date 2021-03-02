let bool = false;

function invertColors() {
	if (bool) {
		document.getElementsByTagName("body")[0].style.backgroundColor = "#515151";
		document.getElementsByTagName("body")[0].style.color = "white";
		bool = false;
	} else {
		document.getElementsByTagName("body")[0].style.backgroundColor = "white";
		document.getElementsByTagName("body")[0].style.color = "black";
		bool = true;
	}
}