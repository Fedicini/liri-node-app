require("dotenv").config();
var command = process.argv[2].replace(/-/g,"_");
var title = "";
for(var k=3;k<process.argv.length;k++){
    title=title.concat(" ",process.argv[k])
}
console.log(title)
var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var actions = {
    my_tweets: function(){
        client.get("statuses/home_timeline", function(err,response){
            //console.log(JSON.stringify(response, null,2));
            for(var i=0; i<response.length; i++){
                console.log("Tweet: \""+response[i].text+"\" Date created: "+response[i].created_at)
            }

        });
    },
    spotify_this_song: function(name){
        if(name==""){
            var name = "The Sign"
        }
        spotify.search({
            type: "track",
            query: name,
            limit: 1
        },function(err,data){
            if(err){
                console.log("Error Occured: "+err)
            }
            var path = data.tracks.items[0]
            //console.log(JSON.stringify(data,null,2))
            console.log("Song Name: "+path.name + "\n Album Name: "+path.album.name+"\n Artist(s): ");
            for(var i=0; i<path.artists.length;i++){
                console.log(path.artists[i].name)
            }
            console.log("Link to song: "+path.external_urls.spotify);
        })
    },
    movie_this: function(name){
        if(name==""){
            var name = "Mr. Nobody"
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";
        request(queryUrl,function(error, response, body){
            if(!error && response.statusCode == 200){
                var parsed = JSON.parse(body)
                console.log("Title: "+parsed.Title+"\n Year: "+parsed.Year+"\n Language: "+parsed.Language+"\n Plot: "+parsed.Plot+"\n Country of Production: "+parsed.Country+"\n Actors: "+parsed.Actors)
                for(var j=0; j<parsed.Ratings.length;j++){
                    if(parsed.Ratings[j].Source=="Rotten Tomatoes"){
                        console.log("Rotten Tomatoes Score: "+parsed.Ratings[j].Value)
                    }
                }
                console.log(parsed.imdbRating)
                
                
            }
        })
    },
    do_what_it_says:function(){
        fs.readFile('movies.txt', 'utf8',function(err,data){
            if(err){
                return console.error(err)
            }
            console.log(data);
            console.log(data.split(','))
        })
    }
}
if(!actions[command]){
    console.log("Invalid");
}
else{
    actions[command](title);
}