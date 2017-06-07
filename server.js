// init project
//var http = require('http');
var fs = require('fs')
var request = require("request");
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;

var nodemailer = require('nodemailer');
var sendmail = require('sendmail')();
var cloudinary = require('cloudinary');

// we've started you off with Express, but feel free to use whatever libs or frameworks you'd like through `package.json`.


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


//var url = "mongodb://" + process.env.me + ":" + process.env.mypass + "@ds151661.mlab.com:51661/spacetags1"
/*app.get("/getTags", function (request, response) {
  
        console.log("get request")
  
        mongo.connect(url, function(err, db) {
              if (err) throw err;
              else { console.log("conected to db")
              
          
                    //example for find: var query = { address: "Park Lane 38" };

                    db.collection("_001").find().toArray(function(err, result) {
                                if (err) throw err;
                                //console.log(result.length, result);

                                response.send(result);
                                response.end()

                                db.close();
                    });
              }
        });
  
});*/
app.get("/elevation", function(req, res){
  
          console.log("elevation req",req.query)
          //console.log(process.env.gmps)
  
          var url = "https://maps.googleapis.com/maps/api/elevation/json?locations=" + req.query.lat + "," + req.query.lon + "&key=" + process.env.gmps
          var options = {
                          host: 'maps.googleapis.com',
                          //port: 80,                                // req.query.stringify({"q":place})
                          path: '/maps/api/elevation/json?locations='+ req.query.lat + ","+ req.query.lon + 
                                '&key=' + process.env.gmps
                                //'&output=json&oe=utf8/&sensor=false&key=' + process.env.gmps
                        };
          
          request(url, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      body =JSON.parse(body);
                      //console.log(response,"---- ", body)
                      //console.log(body.results[0].elevation );
                      res.end(body.results[0].elevation.toFixed(2) )
                  }
                  else {
                      // The request failed, handle it
                  }  
          })  

})

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
        
              var url = "mongodb://public" + ":" + process.env.publicpass + "@ds151661.mlab.com:51661/spacetags1"
              mongo.connect(url, function(err, db){
                    if (err) throw(err)
                    else{
                      console.log("connected");
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
                                    response.end()
                                    db.close()
                                    }
                                
                                
                              })
                        }
                      })
                      
                    }
                
              })
        
                    
      })
  
});




/*  cloudinary.config({ 
      cloud_name: 'okram', 
      api_key:     process.env.cloudinaryapik, 
      api_secret:  process.env.cloudinarysecret
    });*/
app.post("/img", function(req,res){
  
      console.log("img post")
      var imgdata = "";
      
      req.setEncoding("utf8")
      req.on("data", function(data){
        
          imgdata += data
          console.log("dt",data)
        
      })
      req.on("end", function(){
            //console.log(req)
            //var toUpl=req.query.author
            imgdata = JSON.parse(imgdata)
            console.log("imgdata", typeof imgdata, imgdata)
            //console.log("toUpl", typeof toUpl, toUpl);
            //console.log("end of file receiving");console.log("img>",imgdata)
            
            var url = "mongodb://public" + ":" + process.env["publicpass"] + "@ds151661.mlab.com:51661/spacetags1"
            mongo.connect(url, function(er, db){
                    if (er) throw(er)
                    else{
                            console.log("img upload db connect")
                      
                            db.collection("_001").insertOne(imgdata,function(er, rslt){
                        
                                        if (er) throw(er)
                                        else{ res.send("ok")
                                              res.end();
                                              db.close()

                                              //db.close()


                                              /*db.collection("_001").find().toArray(function(error, result){
                                                    if (error) throw(error)
                                                    else{

                                                          /*filterByDistance(result, req.query.userCoords, 5, function(rslt){

                                                                    //console.log(rslt)
                                                                    res.send(rslt);
                                                                    res.end()

                                                                    db.close();

                                                          });
                                                      
                                                          //console.log(result)
                                                          //response.sendStatus(200); 
                                                          /*res.send(result)
                                                          res.end()
                                                          db.close()
                                                    }
                                              })*/
                                        }
                              })
                    }
            })
               /* //var img=
                  fs.writeFile("public/test.txt", "hi omg", function(err){
                  if (err) throw (err)
                  else console.log("file has been done")
                  })
        
                cloudinary.uploader.upload("https://cdn.glitch.com/0b27cb66-047a-466b-af36-c13c15d87775%2FScreen%20Shot%202017-03-04%20at%2000.04.06.png?1490654070488", function(result) { 
            
                                console.log("img upload result",result)                 
                });*/
      })
   
})

app.post("/register", function(req, res){
  
              var newUser = '';
  
              //console.log("data sent?",req.query)
              req.setEncoding('utf8');
              req.on("data", function(data){
                
                  newUser += data
                  //console.log(typeof newUser, newUser);
                  
              })
              req.on("end", function(){
                
                      newUser = JSON.parse(newUser)
                      console.log("newuser",typeof newUser, newUser);
                
                  var url = "mongodb://public" + ":" + process.env["publicpass"] + "@ds151661.mlab.com:51661/spacetags1"
                  mongo.connect(url, function(er, db){
                    
                          if (er) throw(er)
                          else{
                            console.log("db pass connect");
                            var query = {//"nick": newUser.nick, 
                                         "email": newUser.email}
                            
                            db.collection("users_001").find(query).toArray(function(er, result){
                                    if (er) throw (er)
                                    else{
                                      
                                        console.log("result",typeof result, result)
                                      
                                        if (result.length !== 0){  // credentials already in use
                                          
                                              res.end("occupied")
                                              console.log("cant register w these credentials")
                                          
                                        } else if (result.length === 0){   // welcome 
                                            
                                              console.log("no such man on board. welcome");
                                                
                                            try {
                                              
                                                db.collection("users_001").insertOne(newUser, function(){
                                                  console.log("inserted")
                                                  
                                                  sendmail({
                                                                from: 'no-reply@spacetagz.com',
                                                                to: newUser.email,
                                                                subject: '✔ your Space-tagz registration info ✔', // Subject line
                                                                //text: 'text Hello word text', // plain text body
                                                                html: '<p>you requested registration at spacetagz.com</p><br/>' + 
                                                                      '<p>your nick: ' + newUser.nick + '</p>' + 
                                                                      '<p>reg. mail: ' + newUser.email + '</p>' + 
                                                                      '<p>your pass: ' + newUser.pass + '</p>' +
                                                                      '</br>' + '<p>enjoy</p>' ,
                                                                }, 
                                                                function(err, reply) {
                                                                if (err) {
                                                                            res.sendStatus(500);

                                                                            console.log(err && err.stack);

                                                                } else {

                                                                  console.dir(reply);
                                                                  //res.sendStatus(200);
                                                                  res.send("ok")
                                                                }
                                                  });
                                                  informMarko(newUser)
                                                  
                                              })
                                              } catch (e) {
                                                 //print (e);
                                              };
                                              
                                        }
                                    }
                              
                                  
                            }) 
                          }
                  })
                                        // setup email data with unicode symbols
                                        /*var mailOptions = {
                                            from: '"Fred Foo 👻" <okram@tuta.io>', // sender address
                                            to: 'okram@protonmail.ch',  //, baz@blurdybloop.com', // list of receivers
                                            subject: 'Hello ✔ Word', // Subject line
                                            text: 'Hello word', // plain text body
                                            html: '<b>Hello world html</b>' // html body
                                        };*/
                        
                })  
})
app.post("/login", function(req, res){
  
        console.log("login")
  
        var all = '';
        req.setEncoding('utf8')
        req.on("data", function(data){
          
              all += data;
        })
        req.on("end", function(){
          
              all = JSON.parse(all)
          
              console.log("all", all, typeof all)
          
              var url2 = "mongodb://public" + ":" + process.env.publicpass + "@ds151661.mlab.com:51661/spacetags1"
              console.log(process.env.otherspass)
              mongo.connect(url2, function(err, db){
                    if (err) {throw(err); res.sendStatus(404)}
                    else{
                
                          //{  nick: "nick", email: "email",pass: "pass"}
                      
                          //result = 
                          db.collection('users_001').find({"nick": all.nick, "pass": all.pass}).toArray(function(er, result){ 
                            
                                    if (er) {throw (er); res.sendStatus(404), res.end();}
                                    else {
                                        console.log("er", er); 
                                        console.log("result",typeof result, result, result.length);
                                      
                                        if      (result.length > 0) {res.sendStatus(200); console.log("sukces")}
                                      
                                        else if (result.length === 0) {
                                            console.log("fail")
                                          
                                            //res.status(404).send("fail"); 
                                            //res.end();
                                            res.end("fail"); 
                                            console.log("fail 2")
                                            }
                                      
                                        
                                    }
                          })
                          //console.log(typeof result)
                          //console.log(result)
                    }
              })
        })
        
})


app.get("/getTags", function (req, res) {
  
        console.log("get request by", req.query)
        
        var d = '';
  
        req.setEncoding('utf8');
        req.on("data", function(data){
          
            //d+=data
            //console.log("d", data);
        })
        req.on("end", function(){
          
          
                //d = req.query
                
          
                if (req.query.username !== "public") req.query.username = "registereduser"
                console.log("user", req.query)
          
                var url = "mongodb://" + req.query.username + ":" + process.env[req.query.username + "pass"] + "@ds151661.mlab.com:51661/spacetags1"
                mongo.connect(url, function(err, db) {
                      if (err) throw err;
                      else { console.log("conected to db")


                            //example for find: var query = { address: "Park Lane 38" };

                            db.collection("_001").find().toArray(function(err, result) {
                                        if (err) throw err;
                                        
                                        else{
                                            //console.log(result.length, result);  
                                          
                                                                                        // km of radius to include
                                            filterByDistance(result, req.query.userCoords, 5, function(rslt){
                                              
                                                      //console.log(rslt)
                                                      res.send(rslt);
                                                      res.end()

                                                      db.close();
                                              
                                            });
                                          
                                            
                                        }
                            });
                      }
                });
        })
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('listening on port ' + listener.address().port);
});



function filterByDistance(initialArray, user, dist, cb){
  
     // console.log("---ok?") 
     // console.log(user.lat, user.lon)
         
  
      var result = [];
      
      initialArray.forEach(function(tag, index){
        
              
        
              if (distanceInKm(user.lat, user.lon, tag.lat, tag.lon) <= dist) result.push(tag)
        
              if (index === initialArray.length-1) cb(result)
        
      })
  


      function distanceInKm(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2-lat1);
        var dLon = degreesToRadians(lon2-lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        
        return earthRadiusKm * c;
      }
      function degreesToRadians(degrees) {
          return degrees * Math.PI / 180;
      }
  
}
function informMarko(newuser){
  
          sendmail({
                    from: 'admin@spacetagz.com',
                    to: "okram@protonmail.ch",
                    subject: 'new user registered ✔', // Subject line
                    text: 'text Hello word text', // plain text body
                    html: '<p>new user is</p>' + 
                    '<p>nick: ' + newuser.nick + '</p>' + 
                    '<p>reg. mail: ' + newuser.email + '</p>' + 
                    '<p>why: ' + newuser.why + '</p>'
                    }, 
                    function(err, reply) {
                    if (err) {
                    //res.sendStatus(500);

                    console.log(err && err.stack);

                    } else {

                    console.dir(reply);
                    //res.sendStatus(200);
                    //res.send("ok")
                    }
          });
  
}