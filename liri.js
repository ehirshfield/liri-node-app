
var fs = require('fs');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var keys = require('./key.js')

//From Twitter NPM
var twitterUser = new Twitter(keys.twitterKeys);

var userCommand = process.argv[2];
var songOrMovie = process.argv;

//Function to get 20 most recent tweets
var getTweets = function() {
    twitterUser.get('statuses/user_timeline', {screen_name: 'eric_hirshfield',count:20}, function(error, tweets, response) {
        if (error) {
            console.log("Error did not connect");
        }
        else{
            for (i=0; i <= tweets.length - 1; i++){
                console.log("Tweet #" +(parseInt([i])+1));
                console.log("     Tweet: " + tweets[i].text);
                console.log("     Created at: " + tweets[i].created_at);
            }
            
        }
});
}

//function to get spotify info
var getSong = function() {
    var songArray = [];
    for (i=3; i <= songOrMovie.length - 1; i++){
        songArray.push(songOrMovie[i]);
    }
    var prettySong = songArray.join(" ");
    
    if (prettySong === "") {
        prettySong = 'The Sign Ace of Base'
    }

    spotify.search({ type: 'track', query: prettySong }, function(error, data) {
    if (error) {
        console.log('Error occurred: ' + error);
        return;
        }
    else{
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Spotify URL: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album Title: " + data.tracks.items[0].album.name);
    }
    });
}

//OMDB Response
var getMovie = function() {
    var movieArray = [];
    for (i=3; i <= songOrMovie.length - 1; i++){
        movieArray.push(songOrMovie[i]);
    }
    var prettyMovie = movieArray.join(" ");

    if (prettyMovie === "") {
        prettyMovie = 'Mr. Nobody'
    }

    request('http://www.omdbapi.com/?t=' +prettyMovie+ '&y=&plot=short&r=json&tomatoes=true&type=movie' , function (error, response, body) {
        if (!error && response.statusCode == 200) {
            parsedBody = JSON.parse(body); 
            console.log("Title: " + parsedBody.Title);
            console.log("Year: " + parsedBody.Year);
            console.log("IMDB Rating: " + parsedBody.imdbRating);
            console.log("Produced in: " + parsedBody.Country);
            console.log("Language(s): " + parsedBody.Language);
            console.log("Plot: " + parsedBody.Plot);
            console.log("Actors: " + parsedBody.Actors);
            console.log("RT Rating: " + parsedBody.tomatoMeter);
            console.log("RT URL: " + parsedBody.tomatoURL);
        }
    });
}


var doWhatItSays = function(){
    fs.readFile("random.txt", function(error, data){
        if (error) {
            return console.log("Something went wrong, try again");
        }
        else{
            console.log(data);
        }
    });
}

switch (userCommand) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        getSong();
        break;
    case "movie-this":
        getMovie();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default: console.log("Oops try agian!");
}