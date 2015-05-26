
// at the start, render first question and $finalForm.
// on submit, render the next quesiton and append the response to the li
	// if a player passes on a question, push that into emptyAnswers (maybe index value since theyre all related that way) 
	// to call it again until emptyAnswers is empty
// when all the questions have been read, check to make sure emptyAnswers is empty
	// if not, read those questions in order again
// when emptyAnswers is empty, render each response individually with 2 second delay for 
		// the amount of votes associated with taht response. have counter at top with running total
		// 2 more seconds until the next response is rendered with same timing
// start the whole process again.
// at tiem of rendering, show old answers in table on teh left half and new table on the right
	// same process for rendering
// if running total at top exceeds 200, award 7000 points to the player score
	// else currentPlayer.score *= 5
// render congratulations
// option to have password as a returning champ containing score. formula based

var FMQuestions = FMAnswers = FMAnswersLeft = emptyAnswers = [];

$responseDiv = $('#response');
$finalForm = $('<form id="fast_money_input"></form>')
$finalForm.append('<input type="text" id="final_guesses" name="user_guess" class="user_guess text_box" autofocus><input type="submit">');
$finalGuesses = $('#final_guesses');


$finalForm.submit(function(e){
	e.preventDefault();
	var response = $finalGuesses.val().toLowerCase().split();
	$finalGuesses.val("");
	appendResponse(response);
	checkForRespondedAll();
})



var playFastMoney = function() {
	alert("alright, " + currentPlayer.name + "we're gonna play some fast money up in here");
	$answerEntry.remove();
	$playerTurn.hide();
	$currentPlayerDiv.hide();
	$questionDiv.html("");
	$board.html("");
	$.when(retrieveFastMoneyQuestions()).done(function(){
		console.log("questions retrieved");
		startRound();
	})
}

var renderCongratulatoryEnding = function() {
	alert("Congratulations " + currentPlayer.name + "! way to win.");
}

var retrieveFastMoneyQuestions = function() {
	$.ajax({
		url: fastMoneyURL,
		dataType: "json",
		success: function(data){
			var a, b, c, d, e;
			var randomIndices = [a,b,c,d,e];
			$.each(randomIndices, function(i, val){
				val = Math.floor(Math.random() * data.length + 1);
				FMQuestions.push(data[val].Question);
				FMAnswers.push(data[val].Answers);
				FMAnswersLeft.push(FMAnswers[i].slice(0));
			})
		}
	})
}

var startRound = function() {
	startTimer(60);
	$responseDiv.append($finalForm);
	$questionDiv.html(FMQuestions[0]);
}

var checkForRespondedAll = function() {
	var emptyAnswers = [];
}

var askQuestions = function(){
	$.each(FMQuestions, function(i, val) {
		$questionDiv.html(val)
	})
}

var appendResponse = function(response) {
	var $li = ''
}