var formObj = {};
var playerOne = {
	name: "",
	score: 0
};
var playerTwo = {
	name: "",
	score: 0
};

var question, answers, answersLeft, myTimer, currentPlayer;
var incorrectCounter = 0;
var roundPoints = 0;
var stealOpportunity = false;
var computerNames = ["Gagne Family", "Hoop Family", "Canas Family", "Naff Family", "Romberg Family", "Labombard Family", "Easterwood Family", "Corle Family", "Sappington Family", "Hatch Family", "Tristan Family", "Krasner Family", "Benningfield Family", "Watwood Family", "Mirabito Family", "Hoang Family", "Brickhouse Family", "Gilligan Family", "Livsey Family", "Gullatt Family", "Wine Family", "Bennett Family", "Norgard Family", "Greiner Family", "Hurlbut Family", "Lupien Family", "Darsey Family", "Ballinger Family", "Lafollette Family", "Mikesell Family", "Ancheta Family", "Stonecipher Family", "Lavalle Family", "Winkfield Family", "Silveria Family", "Weiland Family", "Melin Family", "Mennella Family", "Cope Family", "Throckmorton Family"]

$('#game_options').submit(function(e){
	e.preventDefault();
	$('#main_menu').hide();
	getFormData($('#game_options'), formObj);
	promptNameImputs();
})

$('#names').submit(function(e){
	e.preventDefault();
	$('#names').hide();
	playerOne.name = $('#player_one_name').val();
  playerTwo.name = $('#player_two_name').val();
  playerOne.name += " Family";
	if (playerTwo.name === undefined) {
		playerTwo.name = computerNames[Math.floor(Math.random() * computerNames.length + 1)];
	}
	if (formObj.bullseye === undefined) {
		showCurrentPlayer(playerOne);
		promptPlayerTurn(singleURL);
	} else {
		showCurrentPlayer(playerOne);
		promptPlayerTurn(singleURL);
	}
})

$('#response_form').submit(function(e){
	e.preventDefault();
	clearTimeout(myTimer);
	$('#response_form').hide();
	var response = $('#user_guess').val().toLowerCase();
	// getThesaurus(response);
	$('#user_guess').val("");
	checkWords([], response);
})


showMenu();
