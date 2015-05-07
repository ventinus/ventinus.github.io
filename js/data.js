var singleURL = "https://dl.dropboxusercontent.com/s/5lw6566u8pb4aew/parsed_single_round.json?dl=0";
var doubleURL = "https://dl.dropboxusercontent.com/s/h08ycvv9pw3b5j2/parsed_double_round.json?dl=0";
var tripleURL = "https://dl.dropboxusercontent.com/s/sge4x15athgjnml/parsed_triple_round.json?dl=0";
var fastMoneyURL = "https://dl.dropboxusercontent.com/s/qqp13i2tbxy54xe/parsed_fast_money.json?dl=0";

var allUrls = [singleURL, doubleURL, tripleURL, fastMoneyURL];
var allQuestions = [];

function getQuestions() {
	$.each(allUrls, function(i, url){
		return $.ajax({
			url: url,
			dataType: "json",
			success: function(data){
				allQuestions.push(data);
				console.log('questions got');
			}
		})
	})
}

function grabQuestion(round) {
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


function getThesaurus(query) {
	// this is with the words.bighugelabs.com thesaurus api
	var baseURL = "http://words.bighugelabs.com/api/2/"
	var key = "8d835c4a71607efe435cf48155dde022/"
	var fullQuery = baseURL + key + query + "/json"

	return $.ajax({
		url: fullQuery,
		dataType: 'jsonp',
		success: function(data){
			console.log(data);
			checkWords(data, query);
		}
	});
};



// function searchStringInArray (str, strArray) {
// 	for (var j=0; j<strArray.length; j++) {
//     if (strArray[j].match(str)) return j;
// 	}
// 	return -1;
// }



// $( document ).ajaxError(function( event, request, settings ) {
//   console.log(event, request, settings)
// });

// $(function() {
//     $.ajaxSetup({
//         error: function(x, status, error) {
//             if (x.status === 0) {
//                 alert('Not connected.\n Verify Network.');
//             } else if (x.status == 404) {
//                 alert('Requested word not found.');
//             } else {
//                 alert('Uncaught Error.\n' + error);
//             }
//         }
//     });
// });



// check query and thesaurus results to the answer 
function checkWords(searchResults, word) {
	var allPossibleWords = [word];

	if (searchResults["noun"] != undefined) {
		var nounResults = searchResults["noun"]["syn"];
		allPossibleWords = allPossibleWords.concat(nounResults);
	}
	if (searchResults["verb"] != undefined) {
		var verbResults = searchResults["verb"]["syn"];
		allPossibleWords = allPossibleWords.concat(verbResults);
	}
	if (searchResults["adjective"] != undefined) {
		var adjResults = searchResults["adjective"]["syn"];
		allPossibleWords = allPossibleWords.concat(adjResults);
	}


	// to check the two arrays against each other, if the number returned is ever != -1, 
	// they duplicate and can break
	var result;
	$.each(answersLeft, function(j, answer){
		answer.name = answer.name.toLowerCase();
		result = $.inArray(answer.name, allPossibleWords);
		if (result === 0) {
			for (var i=0; i < answersLeft.length; i++) {
				if (answersLeft[i].name == allPossibleWords[result]){
					var correctAnswer = answersLeft[i];
					var answerToDisplay = answers.indexOf(answersLeft[i]);
					setTimeout(function(){
						renderAnswer(answerToDisplay + 1);
						roundPoints += correctAnswer.votes;
						if (stealOpportunity === true) {
							renderAnswers();
							currentPlayer.score += roundPoints - correctAnswer.votes;
							showCurrentPlayer(currentPlayer);
						} else if (stealOpportunity === false) {
							if (answersLeft.length > 0) {
								startTimer(15);
							} else if (answersLeft.length === 0) {
								renderAnswers();
								currentPlayer.score += roundPoints;
								showCurrentPlayer(currentPlayer);
							}
						}
					}, 2000);

					// console.log("correct! that answer had " + correctAnswer.votes + " votes.");
					answersLeft.splice(i, 1);
					return ( false );
				}
			}
		}
	})
	if (result === -1) {
		setTimeout(function(){
			showIncorrectResponse();
		}, 2000)
	}
};

function playerRebuttal() {
	if (currentPlayer == playerOne) {
		currentPlayer = playerTwo;
	} else {
		currentPlayer = playerOne;
	}
	showCurrentPlayer(currentPlayer);
	startTimer(15);
	stealOpportunity = true;
}

function getFormData(form, obj) {
  var inputs = form.serializeArray();
  $.each(inputs, function(i, input) {
    obj[input.name] = input.value;
  });
  return obj;
}

function startTimer(num) {
	if (formObj.timer != undefined) {
		setTimeout(function() {
			$('#response_form').show();
		  var seconds = num;
		  $('#countdown').html("");
		  myTimer = setInterval(function () {
		    $('#countdown').text(":" + seconds);
			  if (seconds === 0) {
			    clearInterval(myTimer);
			    $('#response_form').hide();
			  	var response = $('#user_guess').val().toLowerCase();
					checkWords([], response);
			    // showIncorrectResponse();
			  }
		    seconds -= 1;
		  }, 1000);
		  if (incorrectCounter >= 4) {
			  clearInterval(myTimer);
		  }
		}, 2000);
	} else {
		$('#countdown').hide();
		setTimeout(function(){
			$('#response_form').show();			
		}, 2000);
	}
}

