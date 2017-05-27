// init project
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;

// we've started you off with Express, but feel free to use whatever libs or frameworks you'd like through `package.json`.


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


var url = "mongodb://" + process.env.user + ":" + process.env.pass + "@ds151661.mlab.com:51661/spacetags1"
app.get("/getTags", function (request, response) {
  
        console.log("get request")
  
        mongo.connect(url, function(err, db) {
              if (err) throw err;
              else { console.log("conected to db")
              
          
                    //example for find: var query = { address: "Park Lane 38" };

                    db.collection("_001").find().toArray(function(err, result) {
                                if (err) throw err;
                                //console.log(result.length, result);

                                response.send(result)

                                db.close();
                    });
              }
        });
  
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/postTag", function (request, response) {
      // request.query..
      var wholedata = '';
  
      request.setEncoding('utf8');
      request.on("data", function(data){
        
            wholedata += data//JSON.parse(data)
            console.log("data received",typeof data)
        
      })
      request.on("end", function(){
        
              wholedata = JSON.parse(wholedata)
        
              console.log("received wholedata", typeof wholedata, wholedata)
        
              mongo.connect(url, function(err, db){
                    if (err) throw(err)
                    else{
                      
                      db.collection("_001").insertOne(wholedata,function(er, res){
                        
                        if (er) throw(er)
                        else{
                        
                        
                              //db.close()
                              
                          
                              db.collection("_001").find().toArray(function(error, result){
                                    if (error) throw(error)
                                    else{
                                      
                                      //console.log(result)
                                    //response.sendStatus(200); 
                                    response.send(result)
                                    db.close()
                                    }
                                
                                
                              })
                        }
                      })
                      
                    }
                
              })
        
                    
      })
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
