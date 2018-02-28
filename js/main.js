var rawText = [];
var chatObj = {};
var ignoreWords = ["me", "with", "'", "the", " ", "i", "!", "  ", "a", "to", "it", "is", "and", "?", "if", "you", "in", "that", "of", "they", "them", "she", "he", "on", "or", "for", "i'm", "are", "was", "so", "all", "my", "gonna", "this", "u", "but", "I\'m"];

var UploadChat = function(event) {
	$('#uploader').addClass('hidden');
   	$('#loading-status').addClass('pulse').html('<p class="small">Analyzing chat. Please wait.</p>');
    var input = event.target;
    var text;
    var fileName;

    var reader = new FileReader();
    reader.onload = function(){
      	text = reader.result.substring();
      	LoadChat(text);
    };
    reader.readAsText(input.files[0]);
    GetGroupChatName(input.files[0].name)
};

function LoadChat(textFile) {
  	console.log( "Load was performed." );
  	array = s.lines(textFile);
  	var chatString;
	$.each( array, function(i, l) {
		if (!s.include(l, "<Media omitted>")){
			var trimmed = s.strRight(l, "- ");
			rawText.push(l);
  			chatString = chatString + trimmed;
		}
	});

	GetMembers(rawText);
	GetMessages(rawText);

	SortLeaderboard('member');
	ShowNotableQuotable();
	ShowFavoriteWords();

	BuildTimeline(rawText);

	$('html,body').removeClass('no-scroll');
	$('#preloader').addClass('hidden');

	for (var i = 0; i < Object.keys(chatObj.members).length; i++) {
		//populate word vomit dropdown
		$('#word-vomit-select').append('<option value="' + chatObj.members[i].name + '">' + chatObj.members[i].name + '</option>');

		//populate longest message list
		var longestMessageObj = chatObj.members[i].longest_message();

		$('#longest-messages-list').append('<li class="card"><div class="card-header"><h4>' + chatObj.members[i].first_name() + '</h4></div><div class="card-body"><p>' + longestMessageObj[1] + '</p><p class="small example italic">' + longestMessageObj[0] + ' characters</p></div></li>');
	}
}

function LoadDemoChat() {
	$.get( "chat-03.txt", function( data ) {
	  	console.log( "Load was performed." );
	  	array = s.lines(data);
	  	var chatString;
		$.each( array, function(i, l) {
			if (!s.include(l, "<Media omitted>")){
				var trimmed = s.strRight(l, "- ");
				rawText.push(l);
	  			chatString = chatString + trimmed;
			}
		});

		GetGroupChatName('with Star Wars group chat.txt');
		GetMembers(rawText);
		GetMessages(rawText);

		SortLeaderboard('member');
		ShowNotableQuotable();
		ShowFavoriteWords();

		BuildTimeline(rawText);

		$('html,body').removeClass('no-scroll');
		$('#preloader').addClass('hidden');

		for (var i = 0; i < Object.keys(chatObj.members).length; i++) {
			//populate word vomit dropdown
			$('#word-vomit-select').append('<option value="' + chatObj.members[i].name + '">' + chatObj.members[i].name + '</option>');

			//populate longest message list
			var longestMessageObj = chatObj.members[i].longest_message();

			$('#longest-messages-list').append('<li class="card"><div class="card-header"><h4>' + chatObj.members[i].first_name() + '</h4></div><div class="card-body"><p>' + longestMessageObj[1] + '</p><p class="small example italic">' + longestMessageObj[0] + ' characters</p></div></li>');
		}
	});
}

var ShowFavoriteWords = function() {
	for (var i = 0; i < Object.keys(chatObj.members).length; i++) {
		var faveWordObj = chatObj.members[i].favorite_word();
		var mem = chatObj.members[i].first_name();
		var word = faveWordObj.word;
		var usage = faveWordObj.amount;
		var example = faveWordObj.example;

		percentage = ((usage / chatObj.members[i].messages.length) * 100).toFixed(0);
		$('#fave-words-list').append('<li class="card"><div class="card-header"><h4>' + mem + ' said <span class="text-highlight-purple">' + word + '</span> ' + usage + ' times.</h4></div><div class="card-body"><p class="small">Appears in ' + percentage + '% of messages</p><div class="percent-bar"><div class="percent" style="width:' + percentage + '%;"></div></div></div><div class="card-footer"><p class="small">For example:</p><p class="small example italic">' + example + '</p></div></li>');
	}
}

var ShowNotableQuotable = function() {
	var quoteArray = RandomQuote();
	$('.notable-quotables #quote').text('"' + quoteArray[0] + '"').linkify();
	$('.notable-quotables #attribution').text(quoteArray[1] + ' - ' + quoteArray[2]);
}

var SortLeaderboard = function(sortType) {
	$('#memberList').html('<li class="label" data-sort="member">Member</li>');
	$('#messagesSentList').html('<li class="label" data-sort="message count">Messages</li>');
	$('#wordsSentList').html('<li class="label" data-sort="word count">Words</li>');
	$('#wpmList').html('<li class="label" data-sort="wpm">WPM</li>');

	var namesArray = SortMembers(sortType);

	for (var i = 0; i < namesArray.length; i++) {
		$('#memberList').append('<li>'+ namesArray[i][0] + '</li>');
		$('#messagesSentList').append('<li>'+ namesArray[i][2] + '</li>');
		$('#wordsSentList').append('<li>'+ namesArray[i][1] + '</li>');
		$('#wpmList').append('<li>'+ (namesArray[i][1] / namesArray[i][2]).toFixed(2) + '</li>');
	}	
}

var SortMembers = function(sortType) {
	var members = chatObj.members;
	var sortable = [];
	for (var member in members) {
		if (members[member].name) {
	    	sortable.push([members[member].first_name(), members[member].word_count, members[member].messages.length]);
	    }
	}

	if (sortType == 'word count') {
		sortable.sort(function(a, b) {
			return b[1] - a[1];
		});
	} else if (sortType == 'message count') {
		sortable.sort(function(a, b) {
			return b[2] - a[2];
		});
	} else if (sortType == 'wpm') {
		sortable.sort(function(a, b) {
			return (b[1]/b[2]) - (a[1]/a[2]);
		});
	} else {
		sortable.sort();
	}

	return sortable;
}

var GetGroupChatName = function(fileName) {
	groupChatName = s.strRight(fileName, "with ");
    groupChatName = s.strLeft(groupChatName, ".txt");
	chatObj["title"] = groupChatName;
	$('#group-chat-name').text(chatObj.title);
}

var GetMembers = function(text) {
	var members = [];
	$.each( text, function(i, l) {
		if (s.include(l, "M - ") && s.include(l, ": ")) {
			var memberName = s.strRight(l, "M - ");
			memberName = s.strLeft(memberName, ":");
			members.push(memberName);
		}
	});

	var memberNames = [];

	for (var i = 2; i < members.length; i++) {
		memberNames.push(members[i]);
	}

	var memberList = [];
	chatObj["members"] = {};
	var memberNumber = 0;
	//TO DO: figure out a better way to filter out strings that happen to have a ':' that aren't names
	for (var i = 0; i < memberNames.length; i++) {
		var detectedName = memberNames[i];
		if (memberList.indexOf(detectedName) < 0) {
			memberList.push(memberNames[i]);
			chatObj.members[memberNumber] = {
				'name': memberNames[i],
				'messages': [],
				'word_vomit': '',
				'word_count': 0,
				'longest_message': function() {
					var messageLength = 0;
					var messageText = '';
					for (var i = 0; i < this.messages.length; i++) {
						if (messageLength < this.messages[i].length) {
							messageLength = this.messages[i].length;
							messageText = this.messages[i];
						}
					}
					messageText = s.strRight(messageText, '] ');
					return [messageLength, messageText];
				},
				'first_name': function() {
					return s.strLeft(this.name, ' ');
				},
				'last_name': function() {
					return s.strRight(this.name, ' ');
				},
				'favorite_word': function() {
					var faveWordObj = {
						'word': '',
						'amount': 0,
						'example': ''
					};
					var wordCounts = {};
					var words = this.word_vomit.split(" ");

					for(var i = 0; i < words.length; i++) {
				    	wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1;
				    }
				    
				    var sortable = [];
					for (var word in wordCounts) {
					    sortable.push([word, wordCounts[word]]);
					}

					sortable.sort(function(a, b) {
					    return b[1] - a[1];
					});

					for (var i = 0; i < sortable.length; i++) {
						if (ignoreWords.indexOf((sortable[i][0]).toLowerCase()) == -1) {
							faveWordObj.word = sortable[i][0];
							faveWordObj.amount = sortable[i][1];
							break;
						}
					}

					$.each(this.messages, function(i,l) {
						if (s.include(l, faveWordObj.word)) {
							faveWordObj.example = s.strRight(l, "] ");
						}
					});

					return faveWordObj;
				}
			};
			memberNumber++;
		}
	}
}

var GetMessages = function(text) {
	for (var i = 0; i < Object.keys(chatObj.members).length; i++) {
		var memberNum = i;
		var wordVomit = '';
		$.each(text, function(i,l){
			if (s.include(l, chatObj.members[memberNum].name) && !s.include(l, ' created group ') && !s.include(l, ' added you')) {
				var dateSent = s.strLeft(l, " - ");
				var messageText = s.strRight(l, chatObj.members[memberNum].name + ": ");
				chatObj.members[memberNum].messages.push("[" + dateSent + "] " + messageText);

				if (wordVomit == '') {
					wordVomit = messageText;
				} else {
					wordVomit = wordVomit + ' ' + messageText;
				}

				//TO DO: convert date sent into something
			}

			chatObj.members[memberNum].word_vomit = wordVomit;
			
			//TO DO these take too long. find a different way.
			chatObj.members[memberNum].word_count = GetWordCount(chatObj.members[memberNum].word_vomit);
		});
	}
}

var BuildTimeline = function(text) {
	chatObj["timeline"] = {};
	var dateNumber = 0;
	var dateList = [];

	$.each( text, function(i, l) {
		if (s.include(l, '/')){
			dateList.push(s.strLeft(l, ', '));
		}
	});

	console.log(dateList);

	// for (var i = 0; i < memberNames.length; i++) {
	// 	var detectedName = memberNames[i];
	// }
}

var GetTotalCharacters = function(string) {
	//currently counts all characters before stripping out extra stuff
	return string.length;
}

var GetWordCount = function(string) {
	return string.split(" ").length;
}

var RandomNum = function(max) {
	return Math.floor(Math.random() * max);
}

var RandomNumExclusive = function(num, max) {
	if (num) {
		do {
		  var randomNum = Math.floor(Math.random() * max);
		} while (randomNum == num);
	} else {
		num = -1;
		max = 1;
		var randomNum = Math.floor(Math.random() * max);
	}
	return randomNum;
}

var RandomQuote = function(member) {
	var quoteArray = [];
	if (member) {
		for (var i = 0; i < Object.keys(chatObj.members).length; i++) {
			if (chatObj.members[i].name == member) {
				var randomNum = Math.floor(Math.random() * Math.floor(chatObj.members[i].messages.length));
				var quoteString = s.strRight(chatObj.members[i].messages[randomNum], '] ');
				var dateString = s.strRight(chatObj.members[i].messages[randomNum], '[');
				dateString = s.strLeft(dateString, ']');
				var memberName = chatObj.members[i].name;

				quoteArray.push(quoteString, memberName, dateString);

				return quoteArray;
			}
		}
	} else {
		var randomNum = Math.floor(Math.random() * Math.floor(Object.keys(chatObj.members).length));
		var randomNum2 = Math.floor(Math.random() * Math.floor(chatObj.members[randomNum].messages.length));

		var quoteString = s.strRight(chatObj.members[randomNum].messages[randomNum2], '] ');
		var dateString = s.strRight(chatObj.members[randomNum].messages[randomNum2], '[');
		dateString = s.strLeft(dateString, ']');
		var memberName = chatObj.members[randomNum].name;

		quoteArray.push(quoteString, memberName, dateString);

		return quoteArray;
	}
}

$('body').on('change', '#word-vomit-select', function() {
	var member = $('#word-vomit-select').val();
	if (member != 'none') {
		for (var i = 0; i < Object.keys(chatObj.members).length; i++) {
			if (chatObj.members[i].name == member) {
				$('#word-vomit-text-container').text(chatObj.members[i].word_vomit).linkify();
				//$('#word-vomit-text-container').linkify();
			}
		}
	} else {
		$('#word-vomit-text-container').text('Please select a member');
	}
});

$('.notable-quotables .content').click(function(){
	ShowNotableQuotable();
});

$('body').on('click', '.label', function() {
    var sorting = ($(this).data('sort'));
    SortLeaderboard(sorting);
});

$('body').on('click', '#mini-games-list .card', function() {
    var game = $(this).data('game');
    LaunchMiniGame(game);
    console.log(game);
    $('html,body').scrollTop(0).addClass('no-scroll');
    $('.popup-container').removeClass('hidden');
});

$('body').on('click', '.btn-close-popup', function() {
    $('.popup-container').addClass('hidden');
    $('.popup-body').html('');
	$('.popup-footer').html('');
	$('.popup-header').html('');
    $('html,body').removeClass('no-scroll');
});

$('.section-label').click(function() {
	$(this).next().toggleClass('hidden');
	$(this).find('[data-fa-i2svg]').toggleClass('fa-plus').toggleClass('fa-minus');
});