var fs = require('fs');
var keys = require('./keys.js');

var Twitter = require('twitter');

var client = new Twitter({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
})


switch (process.argv[2]) {
	case 'my-tweets':
		var params = {screen_name: 'KimKardashian'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  		if (!error) {
	  			
	  			for (i=0; i < tweets.length; i++) {
	  				console.log(JSON.stringify(tweets[i].text, null, 2));	
	  				console.log(JSON.stringify(tweets[i].created_at, null, 2));	
	  				console.log('======================================================\n')
	  				if (i == 19) {
	  					break;
	  				}
	  			}
	  		}
	  		else {
	  			console.log(error);	
	  		}
  		});

  		break;

  	case 'spotify-this-song':
  		var spotify = require('spotify');
  		var songArgStr = "";
  		for (i=3; i < process.argv.length; i++) {
  			songArgStr += process.argv[i] + ' ';
  		}

  		if (!process.argv[3]) {
  			console.log('"The Sign" by Ace of Base');
  			return;
  		}


		spotify.search({ type: 'track', query: songArgStr }, function(err, data) {
	    	if ( err ) {
	        	console.error(err);
	        	return;
	    	}
 			
 			else {
 				console.log(data.tracks.items[0].artists[0].name);
 				console.log(data.tracks.items[0].name);
 				console.log(data.tracks.items[0].preview_url);
 				console.log(data.tracks.items[0].album.name);	
 			}
 			
		});

		break;

	case 'movie-this':
		var movieArgStr = "";
		var omdb = require('omdb');

		var movieArgStr = "";
			for (i=3; i < process.argv.length; i++) {
				movieArgStr += process.argv[i] + ' ';
			}

		movieArgStr = movieArgStr.trim();

		if (!process.argv[3]) {
			console.log("Mr. Nobody")
			return;
		}


		omdb.get({ title: movieArgStr}, true, function(err, movie) {
		    if(err) {
		        return console.error(err);
		    }
		 
		    if(!movie) {
		        return console.log('Movie not found!');
		    }
			
			// console.log(movie);		 	
		    console.log('Title: %s ', movie.title + '\n');
	        console.log('Year: %d', movie.year + '\n');
	        console.log('IMDB Rating: %s', movie.imdb.rating + '\n');
	        console.log('Country Produced In: %s', movie.countries[0] + '\n');
	        console.log('Actors: %s', movie.actors + '\n');
	        console.log('Plot: %s', movie.plot);

		});

		break;
	
	case 'do-what-it-says':
		var cmd = require('node-cmd');
		var child_process = require('child_process');
		// read the keys file, store the info into two arguments
		fs.readFile('random.js', function(err, data) {
			if(err) {
				console.log(err);
			}

			// string which will be the new input for the command line
			var str = "node liri.js ";
			// var str = "";
			var arr = data.toString().split(',');
			var arg1 = arr[0];
			var arg2 = arr[1];

			// add the arguments taken from random.js and add them to process arguments array
			process.argv[2] = arg1;
			process.argv[3] = arg2;

			str += process.argv[2] + ' ' + process.argv[3];
			console.log(str);
			child_process.exec(str, function(error, stdout, stderr) {
	  			if (error) {
	  				console.error(error);
	  			}
	  			// command output is in stdout
	  			console.log(stdout);
			});
		});

		break;


	default:
		console.log('Please type a valid command');

	

  		

}		