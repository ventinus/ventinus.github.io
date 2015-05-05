
var $bullseyeText = $("<h1>The Bullseye:</h1><p>The game first starts off with the Bullseye Round. The goal of the Bullseye Round is to determine how much money each family could be eligible to receive if they win the whole game. If the option for the Bullseye Round was set to 'No', then this round will be skipped, and each family will only be eligible to receive a maximum of $5000 dollars after winning the game.</p><br><p>Each family member will have a face-off one-by-one, starting from the captain and ending with the last one in the line. At the face-off stand a surveyed question will be asked and either of the contestants have to ring-in in order to be able to answer. A contestant can ring-in from the time the box is blank in the game to a few seconds after the question has been fully asked. If no one rings-in to answer the question and the timer buzzer goes off, the game will ignore the face-off and continue on to the next step. If a contestant rings-in and answers correctly, they have won the match. If the answer was wrong, the other contestant will have the opportunity to answer. If they answer correctly, they won the match, but if both contestants get a wrong answer, the game will continue on to  the next step.</p><br><p>Upon winning a match, the winning family member's family will be eligible to receive a greater amount of money. The first match is worth $1000, the second match is worth $2000, the third worth $3000, the fourth worth $4000, and the final match worth $5000. The maximum amount either family can receive upon being the first ones to successfully answer each question is $20,000.</p>");

var $rulesText1 = $("<ul><li><h1>Rules:</h1><h3>Single Round</h3><p>The first actual round required to play, and what helps on determining who will be the winner of the game is the Single Round. The round starts off similarly of how the Bullseye Round face-offs are. For detailed rules about the face-off in this round and future rounds, visit the Face-Off subsection. The family member who wins the face-off has the option to 'pass or play' the question. If the winning family member chooses to pass the question to the other family, the other family must answer the question due to being the playing family. If play was chosen, the family member's family will be the ones who're answering the question.</p><br><p>The playing family order begins from the family member who comes after the member who was in the face-off last (example: if the third member was the last one to be asked a question in the Bulls-Eye Round then the fourth member begins the Single Round). For every answer a family member gets incorrect, the family will receive a strike. In sequential order each family member has an opportunity to answer the question until three strikes have been received, or until all available answers are have been exhausted. If the family receives three strikes, the other family has the opportunity to steal the points that are in the bank. The stealing family has one opportunity to answer the question, with the captain required to give the answer (NOTE: Originally on the television game show the stealing family would 'huddle up' before the playing family has three strike to determine the best answer to say). If the stealing family says a correct answer that has not already been said they receive the points. Ff they are wrong the playing family receives the points from the bank. If the playing family can provide all answers on the board before receiving three strikes, they receive the points from the bank.</p></li>");

var $rulesText2 = $("<li><h3>Double Round</h3><p>The Double Round plays similarly as how the Single Round plays, but with a few differences:</p><ul><li>There are a fewer amount of answers available for the questions</li><li>The amount of points from each answer doubles when going into the bank</li><li>The family member after who did the face-off in the Bulls Eye Round will be the next one to face-off</li></ul><p>Everything else in the round will play equally as it did in the Single Round.</p><h3>Triple Round</h3><p>The Triple Round plays similarly as how the Double Round plays, but has a few more changes to accommodate it being the last competition round:</p><ul><li>There are more frequently fewer answers possible than the Double Round, though that is not always the case</li><li>The amount of points from each answer triples when going into the bank</li></ul><p>After the Triple Round has completed, a family must reach 300 points or more in order to be the one who moves on to the Fast Money Round. If no family reaches 300 points or more this round will be continuously played until a family does reach 300 points. Once a family reaches 300 points or more, they will be the winning family and will move on to the Fast Money Round. The family who lost will be finished playing the game and will not win anything.</p></li>");

var $rulesText3 = $("<li><h3>Fast Money Round</h3><p>The family who will only play this round is who has at least 300 points after completing the Triple Round. They will be eligible to receive the amount of money that was specified before the Single Round started. Since one family is not in the game anymore, this round is less of a competition and more concentrated on your ability to provided quick responses to the asked survey questions, and try to have the answers said be the ones worth the most points.</p><p>This round is the only time where there will be questions asked containing answers with numbers. As it is impossible to input numbers for questions asking a non-numerical number, this will also be the only round where numerical answers can be entered. If a question requires a number to be used as an answer, the cursor will be on the number zero by default, and the ability to enter letters will be disabled (although blank spaces can still be entered).</p><p>This round requires two family members to play. By default the game will choose the first two members in the line-up (NOTE: In the television game show any two members of the family can play the round).</p><p>The first family member will approach the face-off stand while the other would be put in the isolation booth (not shown in this game, although in the television game show the other family member who is also in Fast Money Round must not know what answers that is on the board). Five questions will be asked, and there will be one minute and 40 seconds to answer all of them if the timer was enabled in the options menu. There are no pauses in the timer after the first question has been asked.</p><p>The question can always be passed by leaving the answer box blank and by pressing Start or going to 'End' and pressing the confirm button on the controller. Once all five questions are answered or if time runs out, the answers will be displayed on the board. Once all of the answers are displayed, it will be time for the other family member to approach the face-off stand to play the round (but remember, they ARE NOT suppose to know the answers that are already on the board!). The same questions will be asked again in the same order, and two minutes will be given this time to answer all of the with the timer enabled.</p><p>No answer on the board that gave points can be answered again, though any answer that was said previously and gave no points is fine to say (normally in the television game show even if the answer previously said resulted in no points, it could not be said again). Once all questions have been answered or if time runs out, the board will display the rest of the answers given and the points they result.</p><p>If 200 points or more have been accumulated as the total, then the family has won the whole game! The family will receive the amount of money that was mentioned before the Single Round. If the total is less than 200 points, the family will receive the amount of money based on this formula:<p>[Total Points for the Round] * 5 = [Total Amount of Money Received]</p><p>The minimum amount that can be received if the family lost the game is $0, and the maximum amount they can receive if they also loss would be $995 (199 points). If a player made it to the Fast Money Round, a password will be provided along with displaying the total final amount of money the family has after the family has been congratulated on the amount they have won (even if it was nothing! (BFHKMP)). The option to continue or start a new game will also be provided if a player won. By continuing, the game will be played through again, with everything the same except for each individual round. By starting a new game, you will be back at the title screen.</p></li>");