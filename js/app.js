/*
 * Create a list that holds all of your cards
 */

let cardsList = [];
let openCardsList = [];
const cardsULs = document.querySelectorAll(".card");
let currentClass;
let timerOn = false;
const newBoard = document.querySelector("#board");
const newDeck = document.querySelector(".deck");
let timer = document.getElementById('timer');
let seconds = 0, minutes = 0, hours = 0
let totalTime = document.querySelector("#timer").innerHTML;
const stars = document.querySelector(".stars")
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



for (let i=0; i<cardsULs.length; ++i) {
	cardsList.push(cardsULs[i]);
}


createBoard();

function createBoard() {
	const shuffled__cardsList = shuffle(cardsList);

	newBoard.innerHTML = "";
	const newULs = document.createElement("ul");
	newULs.classList.add("deck");
	newBoard.appendChild(newULs);

	
	newDeck.classList.add("deck");
	for (i=0; i<shuffled__cardsList.length; i++) {
		const newLIs = document.createElement("li");
		newLIs.classList.add("card");
		newLIs.innerHTML = shuffled__cardsList[i].innerHTML;
		newULs.appendChild(newLIs);
	}

}




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


function respondToTheClick(evt) {

	showCard(evt.target.classList);

	addCardtoStack(evt.target.innerHTML);

	if ((openCardsList.length>0)) {
		if((timerOn===false)) {
			timerOn = showTimer();
			timerOn = true;
		}
	}

	//checking whether there are two cards in the list
	if (openCardsList.length>0 && openCardsList.length%2 == 0) {
		//if the two cards are equal
		if(openCardsList.filter(item => item == evt.target.innerHTML).length == 2) {
			//lock in the correct cards
			lockCorrectCards(evt.target.childNodes[1]);

			if (openCardsList.length == 16) {
				//If all 16 cards have been guessed, show the congratulations dialog. 
				showDialog();
			}
		} 
		else {
			//If the two cards aren't equal. remove the last two cards from the screen.
			setTimeout(removeCards, 500);
		}
	} 
} //end respondtoClick


function splitClasses(target) {
	return "." + target.getAttribute('class').split(' ')[1] || null;
}

function showCard(card) {
	return card.add("show", "open");
}

function removeCards() {
	//to do here. loop through openCardsList, select class
	for (let i=0; i<openCardsList.length; i++) {
		c = "." + openCardsList[i].split('\"')[1].split(' ')[1];
		nodeList = document.querySelectorAll(c);
		for (let i = 0; i<nodeList.length; i++) {
			if(nodeList[i].parentNode.classList.contains("open")){
				nodeList[i].parentNode.classList.remove("show", "open");
			};
		}
		

	}
	//remove the last two cards from the list
	openCardsList.pop();
	openCardsList.pop();
}

function addCardtoStack(card) {
	// console.log("adding card to stack");
	return openCardsList.push(card);
}

function lockCorrectCards(c) {
	currentClass = splitClasses(c);
	elements = document.querySelectorAll(currentClass);
	for (let i = 0; i < elements.length; i++) {
		elements[i].parentNode.classList.add("match");
	}	
	index__list = [];
}

startListening();

//start listening for events on each card
function startListening() {
	const allCards = Array.prototype.slice.call(document.querySelectorAll(".card"));
	for (let i=0; i<allCards.length; i++) {
		allCards[i].addEventListener("click", respondToTheClick);
	}
	// showTimer();
}



moveCounter();

function moveCounter() {
	const allCards = document.querySelectorAll('.card');
	let counter = 1;
	document.querySelector(".moves").innerHTML = "0";
	for (let i = 0; i < allCards.length; i++) {
		allCards[i].addEventListener('click', function (event) {
			document.querySelector(".moves").innerHTML = counter;
			if (counter == 17) {
				stars.children[0].remove();
			} else if (counter == 24) {
				stars.children[0].remove();
			}
			counter++;
		}, false);
	}
}



function showTimer() {

	let displayTimer = document.querySelector("#timer"),
	start = document.querySelector("#board"),
	restart = document.querySelector(".restart"),
	//to do: stop = the button on modal box. or listen out for modal pop up. 
	seconds = 0, minutes = 0, hours =0,
	t;

	function add() {
		seconds++;
		if(seconds >= 60) {
			seconds = 0;
			minutes++;
			if(minutes >= 60) {
				minutes = 0;
				hours++;
			}
		}

		displayTimer.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

		timer();

	}//close add()

	function timer() {
		t = setTimeout(add, 1000);
		// console.log("hi");
	}

	start.onclick = timer;

	restart.onclick = function() {
		clearTimeout(t);
	    displayTimer.textContent = "00:00:00";
	    seconds = 0; minutes = 0; hours = 0;
	}


}//close showeTimer()


function showDialog() { 
  document.querySelector("#myDialog").innerHTML = "Congratulations! You won. Your skill level is " + 
  stars.children.length + 
  ". It took you " + totalTime + " to complete this game." + 
  ". Press Escape and reload the board to play again.";
  document.querySelector("#myDialog").showModal();
} 


document.querySelector(".restart").addEventListener("click", reloadGame);

function reloadGame() {
	createBoard();
	totalTime.innerHTML = "00:00:00";
	resetStars();
	startListening();
	moveCounter();
}

function resetStars() {
	stars.innerHTML="";
	var str = '';
	for(let i=0; i<3; i++) {
		 str += '<li><i class="fa fa-star"></i></li>';
	}
	stars.innerHTML = str;
}



