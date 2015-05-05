var scenes = [
	{
		name: "mainMenu",
		backgroundImage: "red",
		divElements: [$('#main_menu')]
	}, {
		name: "fullView",
		backgroundImage: "red", //"url('http://www.consoleclassix.com/info_img/Family_Feud_SNES_ScreenShot1.jpg')"
		divElements: []
	}, {
		name: "bullseye",
		backgroundImage: "green", //"url('http://www.gamefabrique.com/storage/screenshots/genesis/family-feud-03.png')"
		divElements: []
	}, {
		name: "team1",
		backgroundImage: "purple", //"url()"
		divElements: [$('#question'), $('#response')]
	}, {
		name: "team2",
		backgroundImage: "blue", //"url()"
		divElements: [$('#question'), $('#response')]
	}, {
		name: "scoreBoard",
		backgroundImage: "orange", //"url()"
		divElements: []
	}, {
		name: "fastMoney",
		backgroundImage: "yellow", //"url()"
		divElements: []
	}, 
]

// function removeScene(scene) { 
// 	scene.css('display', 'none');
// }

// function addScene(scene) {
// 	scene.css('display', 'block');
// }

function changeScene(str) {
	currentScene.removeScene();
	currentScene = str;
}

function promptNameImputs(){
	$('.form').show();
	$('#names').append('<input type="text" id="player_one_name" name="p1" placeholder="Your Friendly Name" class="text_box">');
	if (formObj.player_amount === "multi_player") {
		$('#names').append('<input type="text" id="player_two_name" name="p2" placeholder="Your Friendly Name" class="text_box">');
	}
	$('#names').append('<input type="submit">')
}

function showMenu() {
	$('#game').css('backgroundImage', "url('http://www.consoleclassix.com/info_img/Family_Feud_SNES_ScreenShot1.jpg')");
	$('#main_menu').show();
}

function hideDivs(objs) {
	$.each(objs, function(i, val){
		val.hide();
	})
}

function promptPlayerTurn() {
	$('#player-turn').show();
	// grabQuestion(singleURL);
	$.when(grabQuestion(singleURL)).done(function(){
		$('#question').html(question);
		renderScoreBoard(2,6);
		startTimer();
		roundPoints = 0;
		incorrectCounter = 0;
		stealOpportunity = false;
	});
	$('#response_form').append('<input type="text" id="user_guess" name="user_guess" class="user_guess text_box" autofocus><input type="submit">');
}

function renderScoreBoard(width, height) {
	var $board = $('#board');
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

function renderAnswers(){
	for (var i=1; i<answers.length + 1; i++) {
		$li = document.getElementById(i);
		$($li).html("");
		$($li).append('<div class="group"><div class="answer left"><h3>' + answers[i - 1].name + '</h3></div><div class="votes right"><h2>' + answers[i - 1].votes + '</h2></div></div>');
	}
	setTimeout(function(){
		$('#player-turn').hide();
		$('#question, #board,  #response_form').html("");
		promptPlayerTurn();
	}, 8000);
}

function renderAnswer(answerNum){
	var $li;
	$li = document.getElementById(answerNum);
	$($li).html("");
	$($li).append('<div class="group"><div class="answer left"><h3>' + answers[answerNum - 1].name + '</h3></div><div class="votes right"><h2>' + answers[answerNum - 1].votes + '</h2></div></div>');
}

function showIncorrectResponse() {
	incorrectCounter += 1;
	for (var i=0; i<incorrectCounter; i++) {
		$('.overlay').append('<img src="images/red-x.png">');
	}
	setTimeout(function(){
		$('.overlay').html('');
		$('#response_form').show();
	}, 2000);

	if (incorrectCounter < 3) {
		startTimer();
	} else if (incorrectCounter === 3) {
		playerRebuttal();
	} else if (stealOpportunity === true) {
		if (currentPlayer == playerOne) {
			currentPlayer = playerTwo;
		} else {
			currentPlayer = playerOne;
		}
		currentPlayer.score += roundPoints;
		showCurrentPlayer(currentPlayer);
		setTimeout(function(){
			renderAnswers();
		}, 2000);
		$('#response_form').hide();
	}
}

function showCurrentPlayer(player) {
	currentPlayer = player;
	$('.name').html('<h2>' + currentPlayer.name + '</h2>');
	$('.score').html('<h2>Points: ' + currentPlayer.score + '</h2>');
}