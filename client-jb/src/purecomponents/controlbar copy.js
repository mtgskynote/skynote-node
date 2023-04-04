//  https://fontawesome.com/search?c=media-playback&o=r

const titles = ["search",                            "beginning",                      "play",                  "record",                       "volume",                        "tempo",                  "visualize"]
const icons = [["fa-solid", "fa-magnifying-glass"], ["fa-solid", "fa-backward-fast"], ["fa-solid", "fa-play"], ["fa-solid", "fa-record-vinyl"], ["fa-solid", "fa-volume-high"], ["fa-solid", "fa-gauge"], ["fa-solid", "fa-bolt-lightning"]];

const numButtons=icons.length;

function makeControlBar(){
	// create a div element to contain the buttons
	var controlbar = document.createElement("div");
	controlbar.style.display = "table"; // set display property to flex to create a row of buttons
	controlbar.style.margin = "0 auto" //centers
	controlbar.style.backgroundColor = "blue";
	controlbar.style.justifyContent = "center";
    controlbar.style.alignItems = "center";
    controlbar.style.borderRadius = "8px";


	// create buttons 
	for (var i = 0; i < numButtons; i++) {
	  	let button = document.createElement("button");
	  	button.style.margin = ".3rem .2rem"
	  	button.style.borderRadius = "5px";
	    button.setAttribute("title", titles[i]); // these show on hover
	    if (button.getAttribute("title") =="record") button.style.color = "red";

	    button.setAttribute("id", titles[i]);

	  	// add button icons
	   	for (let k=0;k<2;k++){ // each font-awsome icon has two classes
	   		button.classList.add(icons[i][k]) // depends on css library from font-awesome - see index.html
	   	}

	    // console message for the developer
	  	button.addEventListener("mousedown", function() {
	    	console.log(`${button.getAttribute("title")} button was clicked.`);
	  	});

	  	controlbar.appendChild(button); // add button to container div
	}

	return controlbar
};

export {makeControlBar};



