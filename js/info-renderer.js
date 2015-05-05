// var addDiv = function(){
// 	$('#game').append('<div id="something">This is something</div>');
// }

// figure out how to have a modal appear with each containing content. better to have it in one function that listens to 'this'

$('body').append('<div class="overlay" id="strike"></div>');
var $bullseye = $('<div class="overlay" id="bullseye_content"></div>');
var $rules = $('<div class="overlay" id="rules_content"></div>');

$bullseye.append($bullseyeText);
$rules.append($rulesText1);
// $rules.append($rulesText2);
// $rules.append($rulesText3);


$('#bullseye_info').click(function(e){
	$('body').append($bullseye);
	$bullseye.show();
})

$('#rules').click(function(e){
	$('body').append($rules);
	$rules.show();
	// need a multi-page modal for this one to show each round on a page
	// two arrows on the top, one left and one right, that will navigate through. remove back arrow if at the beginning and right arrow if at the end
	// maybe pages will be li tags that i can navigate by previous and next siblings

})

$bullseye.click(function(){
	$bullseye.hide();
})

$rules.click(function(){
	$rules.hide();
})