


//attach event listener to the input checking whether [ENTER] is pressed, and if so running report() which processes the data

function setInputListener() {
	document.getElementById('input').addEventListener('keyup', function (e) {
		var key = e.which || e.keyCode; 
		if (key == 13) { 
			takeInput();
		} 
	});
}


//Deal with input from prompt

function takeInput() {
	var input = document.getElementById("input"); //get input element
	var history = document.getElementById("history"); //get history elemnt for appending previous commands
	
	var node = document.createElement("p"); //create new element which will be appended
	node.setAttribute("class", "history"); //set the history paragraph class to 'history'
	history.append(node, input.value); //append history paragraph and inpute value to histry div
	resetPrompt();
}


//deal with the input
function dealInput(input) {
	
}


// Resets the prompt value and brings it into focus

function resetPrompt() {
	document.getElementById("input").value = ">>> ";
	$("#input").focus();
}




//function sets the scroll of the console back to the bottom (where the input is)

function updateScroll() {
	var console = document.getElementById("console");
	console.scrollTop = console.scrollHeight - console.clientHeight;
}

