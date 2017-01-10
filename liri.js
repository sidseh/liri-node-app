//required items
var fs = require('fs');
var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var client = new Twitter(keys.twitterKeys);

//record node inputs
var optionCheck = process.argv[2];
var movieSong = process.argv[3];

//check which function should be run
function check(){
	switch (optionCheck) {
//do-what-it-says option
		case  'do-what-it-says':
				fs.readFile('./random.txt', 'utf8', function(err, data){
					data = data.split(",");
					optionCheck = data[0].trim();
					movieSong = data[1].replace(/"/g, "");
					movieSong = movieSong.toLowerCase();
				 	// console.log('optionCheck: ' + optionCheck);
				 	// console.log('movieSong: ' + movieSong);
				 	check();
			 	});
		break;
//my-tweets
		case 'my-tweets': 
			var params = {screen_name: 'theAmberJets'};
			client.get('statuses/user_timeline', params, function(error, tweets, response){
			  	if (!error) {
			  		for (var i =0; i<tweets.length; i++){
			  		    console.log(tweets[i].text);

//append log.txt to include tweets		  		    
			  		    fs.appendFile('log.txt', tweets[i].text + '\n', 'utf8', function(err, data){
							if (err) return console.log(err);
							// console.log('the file has been created');
						});
			  		}

			  	}
			});
		break;

//spotify-this-song
		case 'spotify-this-song':

//if song is undefined
			if(movieSong === undefined){
					spotify.search({ type: 'track', query: 'whats my age again' }, function(err, data) {
		    
				    if ( err ) {
				        console.log('Error occurred: ' + err);
				        return;
		    		}

//console.log items for default song
				    	console.log("artist: " + data.tracks.items[0].artists[0].name + "\n" +
				    				"song name: " + data.tracks.items[0].name + "\n" +
				    				"preview link: " + data.tracks.items[0].preview_url + "\n" +
				    				"album name: " + data.tracks.items[0].album.name + "\n");

//append log.txt with spotify default search
				    	fs.appendFile('log.txt', "spotify-this-song: \n" +
				    				"artist: " + data.tracks.items[0].artists[0].name + "\n" +
			    					"song name: " + data.tracks.items[0].name + "\n" +
			    					"preview link: " + data.tracks.items[0].preview_url + "\n" +
			    					"album name: " + data.tracks.items[0].album.name + "\n" 
			    					, 'utf8', function(err, data){
									if (err) return console.log(err);
									// console.log('the file has been created');
								});
					});

//get search item from node and search spotify			
				 } else {
				 	spotify.search({ type: 'track', query: movieSong }, function(err, data) {
				    if ( err ) {
				        console.log('Error occurred: ' + err);
				        return;
		    		}

//loop through results and console.log items
				    for (var i = 0; i < data.tracks.items.length; i++) {
				    	console.log("artist: " + data.tracks.items[i].artists[0].name + "\n" +
				    				"song name: " + data.tracks.items[i].name + "\n" +
				    				"preview link: " + data.tracks.items[i].preview_url + "\n" +
				    				"album name: " + data.tracks.items[i].album.name + "\n");

//append search to log.txt
				    	fs.appendFile('log.txt', "spotify-this-song: \n" +
				    				"artist: " + data.tracks.items[i].artists[0].name + "\n" +
			    					"song name: " + data.tracks.items[i].name + "\n" +
			    					"preview link: " + data.tracks.items[i].preview_url + "\n" +
			    					"album name: " + data.tracks.items[i].album.name + "\n" 
			    					, 'utf8', function(err, data){
									if (err) return console.log(err);
									// console.log('the file has been created');
								});
				    	}
					});

				 }
		break;

//search imdb
//if no term is entered Mr. Nobody is default
		case 'movie-this':
			if (movieSong === undefined) {
				movieSong = 'Mr+Nobody';
			}

//trim extra space from input and replace spaces with +
			var movieChoice = movieSong.trim().replace(/ /g,"+");
			//console.log(movieChoice);
				request('http://www.omdbapi.com/?t='+movieChoice+'&y=&plot=short&r=json', function (error, response, body) {
			 if (!error && response.statusCode == 200) {

//parse result as JSON
			    var json = JSON.parse(body);

//console.log results
			    console.log('Title: '+json.Title + "\n" +
			    			'Year: '+json.Year + "\n" +
			    			'IMDB Rating: '+json.imdbRating + "\n" +
			   				'Country: '+json.Country + "\n" +
			    			'Language: '+json.Language	+ "\n" +
			    			'Plot: '+json.Plot + "\n" +
			    			'Actors: '+json.Actors);
			    //console.log('Rotten Tomatoes Rating: '+json.Title);
			    //console.log('Rotten Tomatoes UrL: '+json.Title);

//append imdb search to log.txt
			    fs.appendFile('log.txt', 'movie-this: \n' +
			    			'Title: '+json.Title + "\n" +
			    			'Year: '+json.Year + "\n" +
			    			'IMDB Rating: '+json.imdbRating + "\n" +
			   				'Country: '+json.Country + "\n" +
			    			'Language: '+json.Language	+ "\n" +
			    			'Plot: '+json.Plot + "\n" +
			    			'Actors: '+json.Actors
			    			, 'utf8', function(err, data){
							if (err) return console.log(err);
							// console.log('the file has been created');
						});
			  }
			})
			
		break;

//if choice does not exist
		default:
		console.log("Sorry, that is not an option");
		fs.appendFile('log.txt', 'Sorry, that is not an option' + '\n', 'utf8', function(err, data){
					if (err) return console.log(err);
							// console.log('the file has been created');
					});

		}
}

//run function
 check();