const express         = require("express");
const app             = express();
const mongoose        = require("mongoose");
const bodyParse       = require("body-parser");
const methodOverride     = require("method-override");


const PORT =   process.env.PORT || 5500;

const URL  = process.env.DATABASEURL  || "mongodb://localhost:27017/website-app" ; 

// app config


mongoose.connect(URL, {useNewUrlParser: true});
app.use(bodyParse.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));



// datebase config

const gamesSchema = new mongoose.Schema({
	title              : String,
	genre              : Array,
	image              : String,
	url                : String,
	requirement        : String,
	description        : String,
	date               : {type: Date, default: Date.now},
	img1               : String,
	img2               : String,
	img3               : String,
	
});

// this text is part is used to find complete data using a single word and help in search and genre part

gamesSchema.index({
	title : 'text',
	genre : 'text'
});

const Game = mongoose.model("Game", gamesSchema);




app.get("/",function(req, res){
	res.redirect("/games");
});



 



                    





         //      Index Route   (RESTful Route-1) 

app.get("/games",function(req,res){
	Game.find({}, function(error, game){
		if(error){
			console.log(error);
		}
		else{
			res.render("index.ejs", {game:game});
		}
	});
});







         //      New Route   (RESTful Route-2)

app.get("/games/new",function(req,res){
	res.render("new.ejs");
});






         //       Create Route (RESTful Route-3)

app.post("/games", function(req,res){
	
	
	Game.create(req.body.game,function(error, newGame){
		if(error){
		    console.log(error);     
	    }
	    else{
			res.redirect("/games");
		}	 
   });
});





         //      Show Route (RESTful Route-4)

app.get("/games/:id", function(req,res){
	Game.findById(req.params.id, function(error, foundgame){
		if(error){
			console.log(error);
		}
		else{
			res.render("show.ejs", {game: foundgame});
		}
	});
});




         //       Edit Route (RESTful Route-5)

app.get("/games/:id/edit", function(req,res){
	Game.findById(req.params.id, function(error, editgame){
		if(error){
			console.log(error);
		}
		else{
			res.render("edit.ejs", {game: editgame});
		}
	});
});



         //       Update Route  (RESTful Route-6)

app.put("/games/:id", function(req,res){
	Game.findByIdAndUpdate(req.params.id, req.body.game, function(error, updategame){
		if(error){
			console.log(error);
		}
		else{
			res.redirect("/games/" + req.params.id);
		}
	});
});




         //         Delete Route (RESTful Route-7)

app.delete("/games/:id", function(req,res){
	Game.findByIdAndDelete(req.params.id, function(error){
		if(error){
			console.log(error);
		}
		else{
			res.redirect("/games");
		}
	});
});








		   // search Route
		   
app.get('/games/s/:title', function(req,res){
	
	 
	const find = req.query.title.toLowerCase()
	Game.find({$text: { $search: find }}, function(error, game){
      if(error){
		  console.log(error);
	  }
	  else{
		  res.render("index.ejs" , {game:game});
	  }
	});
});





app.get('/games/g/:genre', function(req,res){
	
	 
	const find = req.params.genre;
	Game.find({$text: { $search: find }}, function(error, game){
      if(error){
		  console.log(error);
	  }
	  else{
		  res.render("index.ejs" , {game:game});
	  }
	});
});











app.listen(PORT,function(){
	console.log("Server is Running");
});