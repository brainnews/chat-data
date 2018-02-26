var gameObj = {};

var LaunchMiniGame = function(game) {
	switch(game) {
	    case "who said it":
	        WhoSaidit();
	        break;
	    default:
	        //code block
	}
	
}

var WhoSaidit = function() {
	$('.popup-body').html('<p class="quiz-question text-white"></p><form class="quiz-choices" action="#"></form>');
	$('.popup-footer').html('<button class="btn btn-standard">Answer</button>');
	$('.popup-header').html('<h3>Who said it?</h3>');

	gameObj = {
		'type': 'who said it',
		'questions': {
		}
	}

	for (var i = 0; i < 5; i++) {
		gameObj.questions[i] = {
			'message': [],
			'correct_answer': '',
			'incorrect_answers': [],
			'totalChoices': function() {
				return this.incorrect_answers.length + 1;
			}
		};

		do {
			var message = RandomQuote();
			if (message[0].length > 30) {
				gameObj.questions[i].message = message[0];
				gameObj.questions[i].correct_answer = message[1];
			}
		} while (gameObj.questions[i].message.length < 1);
	}

	for (var i = 0; i < Object.keys(gameObj.questions).length; i++) {
		for (var member in chatObj.members) {
			if (chatObj.members[member].name == gameObj.questions[i].correct_answer) {
				var incorrectMembers = [];
				var incorrectMember;

				do {
					var incorrectMemberNum = RandomNumExclusive(member, Object.keys(chatObj.members).length);
					if (incorrectMembers.indexOf(chatObj.members[incorrectMemberNum].name) < 0) {
						incorrectMembers.push(chatObj.members[incorrectMemberNum].name);
					}
				} while (incorrectMembers.length < 3);
				
				gameObj.questions[i].incorrect_answers = incorrectMembers;
			}
		}
	}

	console.log(gameObj);

	$('.quiz-question').text('"' + gameObj.questions[0].message + '"').linkify();

	for (var i = 0; i < gameObj.questions[0].incorrect_answers.length; i++) {
		var name = gameObj.questions[0].incorrect_answers[i];
		$('.quiz-choices').append('<p><input type="radio" id="' + name + '" name="radio-group"><label for="' + name +'">' + name + '</label></p>');
	}

	$('.quiz-choices p').eq(RandomNum(3)).before('<p><input type="radio" id="' + gameObj.questions[0].correct_answer + '" name="radio-group"><label for="' + gameObj.questions[0].correct_answer + '">' + gameObj.questions[0].correct_answer + '</label></p>');
}