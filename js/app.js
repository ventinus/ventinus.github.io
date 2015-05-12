// window onload, render the menu which contains: 
	// form for player count and game options:
		// bullseye round and timer on/off
	// ul with anchor li's to show information modal for the bullseye round and game rules

// on form submit, render form to enter first player name
// if 2 player was selected
	// on name entry submit, render second name entry

// show for 5 seconds the controls to buzz in. "Player 1, buzz in with z(122). Player 2, buzz in with /(47)"

// if bullseye is turned on
	// fetch a question, display it on top, 
	// start invisible 20 second timer (if it runs out, render a new question)
	// listen for keyboard events: $('body').keydown(function(e){})
	// once keydown, stop timer, show entry field, current player is who buzzed in, 
		// start 15 second timer to enter response

	// until ( (at least 1 answer is gotten && at least 1 incorrect response) || indexOf(answer) === 0 )
		// keep switching between players 

	// if answer is correct
		// show answer and add to the running total of points for the round
		// if (indexOf(answer) === 0) {
			// playOrPass?()
		// } else {
			// switch current player and show entry field, start 15 sec timer
		// }
	// else 
		// set current player to the other, show entry field, start 15 sec timer

// game variables
var gameOptions = { };
var playerOne = {
	name: "",
	score: 0
};
var playerTwo = {
	name: "",
	score: 0
};
var myTimer, question, answers, answersLeft, currentPlayer, currentAnswerIndx;
var incorrectCounter = roundPoints = loggedSubmissions = roundCounter = 0;
var stealOpportunity = false;
var beginningOfRound = true;
var computerNames = ["Gagne Family", "Hoop Family", "Canas Family", "Naff Family", "Romberg Family", 
			"Labombard Family", "Easterwood Family", "Corle Family", "Sappington Family", "Hatch Family", 
			"Tristan Family", "Krasner Family", "Benningfield Family", "Watwood Family", "Mirabito Family", 
			"Hoang Family", "Brickhouse Family", "Gilligan Family", "Livsey Family", "Gullatt Family", 
			"Wine Family", "Bennett Family", "Norgard Family", "Greiner Family", "Hurlbut Family", 
			"Lupien Family", "Darsey Family", "Ballinger Family", "Lafollette Family", "Mikesell Family", 
			"Ancheta Family", "Stonecipher Family", "Lavalle Family", "Winkfield Family", "Silveria Family", 
			"Weiland Family", "Melin Family", "Mennella Family", "Cope Family", "Throckmorton Family"]


// DOM elements for manipulating
var $game = $('#game');
var $mainMenu = $('#main_menu');
var $gameOptionsForm = $('#game_options');
var $namesForm = $('#names') ;
var $answerEntry = $('#response_form');
$answerEntry.append('<input type="text" id="user_guess" name="user_guess" class="user_guess text_box" autofocus><input type="submit">');
var $userGuess = $('#user_guess');
var $questionDiv = $('#question');
var $timer = $('#countdown');
var $board = $('#board');
var $playerTurn = $('#player-turn');
var $body = $('body');
var $nameFormDiv = $('.form');
var $currentPlayerDiv = $('#current_player_info');
var $playOrPassForm = $('<div id="play_pass_form">');
$playOrPassForm.append('<h2>Would you like to </h2><br><button>Play</button><h2> or </h2><button>Pass</button><h2>?</h2>')
$body.append('<div class="overlay" id="strike"></div>');
$overlay = $('.overlay');
var $controlDiv = $('<div id="controls">');
$controlDiv.append('<h1>Controls to buzz in:</h1><br><h2>Player One: "z"</h2><br><h2>Player Two: "/"</h2>')


// Questions and Answers urls by round
var singleURL = "https://dl.dropboxusercontent.com/s/5lw6566u8pb4aew/parsed_single_round.json?dl=0";
var doubleURL = "https://dl.dropboxusercontent.com/s/h08ycvv9pw3b5j2/parsed_double_round.json?dl=0";
var tripleURL = "https://dl.dropboxusercontent.com/s/sge4x15athgjnml/parsed_triple_round.json?dl=0";
var fastMoneyURL = "https://dl.dropboxusercontent.com/s/qqp13i2tbxy54xe/parsed_fast_money.json?dl=0";
var fullGameURLS = [singleURL, singleURL, doubleURL, tripleURL];


// form entry events
$gameOptionsForm.submit(function(e){
	e.preventDefault();
	$mainMenu.remove();
	getFormData($gameOptionsForm, gameOptions);
	promptNameImputs();
})

$namesForm.submit(function(e){
	e.preventDefault();
	playerOne.name = $('#player_one_name').val();
  playerTwo.name = $('#player_two_name').val();
	$nameFormDiv.remove();
  playerOne.name += " Family";
	if (playerTwo.name === undefined) {
		playerTwo.name = computerNames[Math.floor(Math.random() * computerNames.length + 1)];
	} else {
		playerTwo.name += " Family";
	}
	$game.append($controlDiv);
	setTimeout(function(){
		$controlDiv.remove();
		initializeRound(fullGameURLS[roundCounter]);
	},10000)
})

$answerEntry.submit(function(e){
	e.preventDefault();
	$answerEntry.hide();
	var response = $userGuess.val().toLowerCase().split();
	$userGuess.val("");
	clearTimeout(myTimer);
	if (beginningOfRound === true) {
		loggedSubmissions += 1
	}
	checkForCorrectResponse(response);
})

// $('button').click(function(e){
// 	// e.preventDefault();
// 	if (e.target.textContent == "Pass") {
// 		switchPlayer();
// 	}
// 	updateCurrentPlayer(currentPlayer);
// 	$playOrPassForm.remove();
// 	$questionDiv.show();
// 	$board.show();
// 	$answerEntry.show();
// 	startTimer(15);
// })

var getPlayPass = function() {
	if (this.textContent == "Pass") {
		switchPlayer();
	}
	updateCurrentPlayer(currentPlayer);
	$playOrPassForm.remove();
	$questionDiv.show();
	$board.show();
	$answerEntry.show();
	startTimer(15);
}

var getFormData = function(form, obj) {
  var inputs = form.serializeArray();
  $.each(inputs, function(i, input) {
    obj[input.name] = input.value;
  });
  return obj;
}

// functions
var checkIndexOfAnswer = function(answerIndx) {
	if (answerIndx === 0) {
		playOrPass();
	} else if (answerIndx > currentAnswerIndx) {
		switchPlayer();
		playOrPass();
	} else if (answerIndx < currentAnswerIndx) {
		playOrPass();
	} else if (loggedSubmissions >= 2) {
		playOrPass();
	} else {
		promptOpponantGuess();
	}
}

var checkForCorrectResponse = function(response) {
	var result; // stores value of if response is matched with the answer
	$.each(answersLeft, function(i, answer){
		answer.name = answer.name.toLowerCase();
		result = $.inArray(answer.name, response);

		if (result === 0) {
			setTimeout(function(){
				if (stealOpportunity === true) {
					// $answerEntry.hide();
					var answerToDisplay = answers.indexOf(answer);
					currentPlayer.score += roundPoints;
					updateCurrentPlayer(currentPlayer);
					renderAnswer(answerToDisplay + 1);
					// clearTimeout(myTimer);
					setTimeout(function(){
						renderAnswers();
					}, 2000)
				} else {
					renderCorrectResponse(answer)
				}
			}, 2000)
			answersLeft.splice(i, 1);
			return false;
		}
	})

	if (result === -1) {
		setTimeout(function(){
			showIncorrectResponse();
		}, 2000)
	}
}

var renderCorrectResponse = function(answerObj) {
	var answerIToDisplay = answers.indexOf(answerObj);
	translateAnswerVotes(answerObj);
	renderAnswer(answerIToDisplay + 1);
	if (beginningOfRound === true) {
		if (answers.length === answersLeft.length + 1) {
			currentAnswerIndx = answerIToDisplay;
		}
		checkIndexOfAnswer(answerIToDisplay);
	} else {
		if (answersLeft.length === 0) {
			currentPlayer.score += roundPoints;
			updateCurrentPlayer(currentPlayer);
			// $answerEntry.hide();
			setTimeout(function(){
				renderAnswers();
			}, 2000);
		} else {
			startTimer(15);
		}
	}
}

// increases value of points per vote based on the round
var translateAnswerVotes = function(answerObj) {
	if (roundCounter === 2) {
		roundPoints += answerObj.votes * 2; 
	} else if (roundCounter >= 3) {
		roundPoints += answerObj.votes * 3; 		
	} else {
		roundPoints += answerObj.votes;
	}
	return roundPoints;
}

var renderAnswer = function(answerIndx) {
	var $li;
	$li = document.getElementById(answerIndx);
	$($li).html("");
	$($li).append('<div class="group"><div class="answer left"><h3>' + answers[answerIndx - 1].name 
								+ '</h3></div><div class="votes right"><h2>' + answers[answerIndx - 1].votes 
								+ '</h2></div></div>');
}

var showIncorrectResponse = function() {
	console.log('never found it');
	incorrectCounter += 1;
	for (var i=0; i<incorrectCounter; i++) {
		$overlay.append('<img src="images/red-x.png">');
	}
	setTimeout(function(){
		$overlay.html('');
		if (beginningOfRound === true) {
			if (answers.length === answersLeft.length && loggedSubmissions < 4 ) {
				$answerEntry.show();
				promptOpponantGuess();
			} else if (answers.length - 1 === answersLeft.length) {
				switchPlayer();
				playOrPass();
			} else {
				console.log("too many wrong guesses. starting anew");
				setTimeout(function(){
					initializeRound(fullGameURLS[roundCounter]);
				}, 2000)
			}
		} else {
			$answerEntry.show();
			incorrectTracker();
		}
	}, 2000)
}

var incorrectTracker = function() {
	if (incorrectCounter < 3) {
		startTimer(15);
	} else if (incorrectCounter === 3) {
		playerRebuttal();
	} else if (stealOpportunity === true) {
		switchPlayer();
		currentPlayer.score += roundPoints;
		updateCurrentPlayer(currentPlayer);
		setTimeout(function(){
			renderAnswers();
		}, 2000);
	}
}

function playerRebuttal() {
	switchPlayer();
	startTimer(15);
	stealOpportunity = true;
}

function renderAnswers(){
	for (var i=1; i<answers.length + 1; i++) {
		$li = document.getElementById(i);
		$($li).html("");
		$($li).append('<div class="group"><div class="answer left"><h3>' 
			+ answers[i - 1].name + '</h3></div><div class="votes right"><h2>' 
			+ answers[i - 1].votes + '</h2></div></div>');
	}
	setTimeout(function(){
		roundCounter += 1;
		if (roundCounter < fullGameURLS.length) {
			initializeRound(fullGameURLS[roundCounter]);
		} else {
			checkForGameWinner();
		}
	}, 8000);
}

var checkForGameWinner = function() {
	console.log("checking for winner...");
	if (playerOne.score > playerTwo.score) {
		updateCurrentPlayer(playerOne);
	} else {
		updateCurrentPlayer(playerTwo);
	}
	if (currentPlayer.score > 300) {
		playFastMoney(currentPlayer);
	} else {
		endGame(currentPlayer);
	}
}

var playFastMoney = function(player) {
	console.log("alright, " + player.name + "we're gonna play some fast money up in here");
}

var endGame = function(player) {
	if (playerOne.score < 300 && playerTwo.score < 300) {
		renderApologyEnding();
	} else {
		renderCongratulatoryEnding(player);
	}
}

var renderApologyEnding = function() {
	console.log("we're sorry but neither of you are worthy enough to play fast money. better luck next time.");
}

var renderCongratulatoryEnding = function(player) {
	console.log("Congratulations " + player.name + "! way to win.");
}

var playOrPass = function() {
	setTimeout(function(){
		$answerEntry.hide();
		$questionDiv.hide();
		$timer.hide();
		$board.hide();
		beginningOfRound = false;
		incorrectCounter = 0;
		$game.append($playOrPassForm);
		$.each($('button'), function(i, button){
			button.addEventListener("click", getPlayPass);
		})
	}, 2000)
}

var promptNameImputs = function(){
	$nameFormDiv.show();
	$namesForm.append('<input type="text" id="player_one_name" name="p1" placeholder="Your Friendly Name" class="text_box">');
	if (gameOptions.player_amount === "multi_player") {
		$namesForm.append('<input type="text" id="player_two_name" name="p2" placeholder="Your Friendly Name" class="text_box">');
	}
	$namesForm.append('<input type="submit">')
}


var promptOpponantGuess = function() {
	switchPlayer();
	startTimer(15);
}

var retrieveQuestion = function(round) {
	return $.ajax({
		url: round,
		dataType: "json",
		success: function(data){
			var index = Math.floor(Math.random() * data.length + 1);
			question = data[index].Question;
			answers = data[index].Answers;
			answersLeft = answers.slice(0);
		}
	})
}

var initializeRound = function(round) {
	$playerTurn.hide();
	$currentPlayerDiv.hide();
	$questionDiv.html("");
	$board.html("");
	currentPlayer = undefined;
	beginningOfRound = true;
	stealOpportunity = false;
	incorrectCounter = roundPoints = loggedSubmissions = 0;
	$.when(retrieveQuestion(round)).done(function(){
		$questionDiv.html(question);
		renderScoreBoard(2, 6);
		$playerTurn.show();
		$timer.hide();
		$answerEntry.hide();
		// starts listening for keypress event 
		$body.bind("keypress", buzzIn);
	});
}

// event listener for keyboard events to buzz in
var buzzIn = function(e) {
	if ( e.charCode === 122 || e.charCode === 47 ) {
		$body.unbind("keypress", buzzIn);
		clearTimeout(myTimer);
		$timer.show();
		startTimer(15);
	}
	// set current player to whoever buzzed in
	if ( e.charCode === 122 ) { // z
		updateCurrentPlayer(playerOne);
	} else if ( e.charCode === 47 ) { // /
		updateCurrentPlayer(playerTwo);
	}
	$currentPlayerDiv.show();
}

var updateCurrentPlayer = function(player) {
	currentPlayer = player;
	$('.name').html('<h2>' + currentPlayer.name + '</h2>');
	$('.score').html('<h2>Points: ' + currentPlayer.score + '</h2>');
}

var switchPlayer = function() {
	currentPlayer = (currentPlayer == playerOne ? playerTwo : playerOne);
	updateCurrentPlayer(currentPlayer);
}

var renderScoreBoard = function(width, height) {
	var $leftDiv = $('<div class="left"></div>');
	var $rightDiv = $('<div class="right"></div>');
	for (var i=0; i<width; i++) {
		var $ul = $('<ul>');
		if (i === 0) {
			for (var j = 1; j < height + 1; j++) {
				if (j <= answers.length) {
					$ul.append($('<li id="' + j + '"><h1>' + j + '</h1></li>'));
				} else {
					$ul.append($('<li id="' + j + '">'));
				}
			} 
		} else {
			for (var j = height + 1; j < height * 2 + 1; j++) {
				if (j <= answers.length) {
					$ul.append($('<li id="' + j + '"><h1>' + j + '</h1></li>'));
				} else {
					$ul.append($('<li id="' + j + '">'));				
				}
			}
		}
		if (i === 0) {
			$leftDiv.append($ul);
		} else {
			$rightDiv.append($ul);
		}
	}
  $board.append($leftDiv).append($rightDiv);
}

var startTimer = function(num) {
	$timer.html("");
	if (gameOptions.timer != undefined) {
		// setTimeout(function() {
			$timer.show()
			$answerEntry.show();
		  var seconds = num;
		  myTimer = setInterval(function () {
		    $timer.text(":" + seconds);
			  if (seconds <= 0) {
			  	$answerEntry.trigger("submit");
			  }
		    seconds -= 1;
		  }, 1000);
		  if (incorrectCounter >= 4) {
			  clearInterval(myTimer);
		  }
		// }, 2000);
	} else {
		$timer.hide();
		setTimeout(function(){
			$answerEntry.show();			
		}, 2000);
	}
}