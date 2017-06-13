/*
  				na lat rozdíl  0.000009 = 1m		  //	1”  = 30.89 m
				  na lon rozdíl  0.000014 = 1,03m		//	1”  = 20.59 m
*/
/*cloudinary.cloudinary_js_config();
$(function() {
  if($.fn.cloudinary_fileupload !== undefined) {
    $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();
  }
});
cloudinary.uploader.image_upload_tag('image_id', { callback: cloudinary_cors });
*/
var username= "public";

var logr= false;

var vid;


var cntr = 0;
var tags;

var tagsToEdit;
var changeID;

var postType = "text";
var file;

var _minLat, _minLon;
var repoCoords = {};
var newlat; var newlon;

//markers
var userOld, userNew;

//var cam = { "name": "cam","lat": 48.191482, "lon":16.295164, "alt": 0}
var user = undefined;            //= {"lat": undefined, "lon"//: undefined}
user = {}; //user.lat = cam.lat; user.lon = cam.lon; user.alt = cam.alt





$(function() {
  
  if (logr) {$("#xx").html(window.innerHeight + " " +window.innerWidth); $("#xx").fadeOut(3000);}
  
  formatD();    
  
  console.log("hi");
  
  //$("#getLocation").click(function(){ getGPS(null)})
  $("#stop").click(function(){
      
            //vid.pause(); //$("video").remove(); //console.log("vid",window.localStream);
            window.localStream.getTracks().forEach(function(track){ track.stop()});
  })  
  $("#play").click(function(){
      
      //vid.play();
      //$("#video-container").append('<video id="camera-stream" style="border- 1px dashed cyan" autoplay></video>');
      video();
  })
  
  $("#reposition").on('click', function(){
          
        $("#mySettings").hide();
        $("#reposition").hide();
        $("#openKbd").hide();
        $("#addTag").hide();
        
        console.log("click repo```````")//, user.lat, user.lon);
        //console.log("user before @", user)
        $("#repositionMenu").css("display", "flex")
        
    
    
              $("#mapAlt").val(user.alt)
    
        
        /*if (user !== undefined) {
          
              $("#userLat").val(user.lat)
              $("#userLon").val(user.lon)
              $("#userAlt").val(user.alt)
          
        } else if (user === undefined){
          
              $("#userLat").val(cam.lat)
              $("#userLon").val(cam.lon)
              $("#userAlt").val(cam.alt)
        }
        */
        //console.log("user @", user.lat, user.lon);
        map("mapid", user.lat, user.lon, tags)
    
        //console.log ("click finito")
    
  })
  $("#usegps").click(function(){
            
              getGPS("repo", function(){
                
                      map("mapid",user.lat, user.lon)
                      console.log("by gps updated")
                      newlat = user.lat;
                      newlon = user.lon
              })
  })
  $("#openNumeric").click(function(){
          $("#mapAlt").hide()
          $("#mapAltLabel").hide()
          $("#numericDiv").css("display","flex");
          $("#openNumeric").hide();
    
          $("#repositionMenu").css("height","100%");
          $("#mapDiv").css("height", $("#mapDiv").height()*0.75); //"130px");
          $("#mapDiv").css("opacity", 0.65);
    
                $("#userLat").val(user.lat);
                $("#userLon").val(user.lon);
                $("#userAlt").val(user.alt);
    
          $("#latadd3").click(function(){
            
                  var res = parseFloat( $("#userLat").val() )  
                  var meju = parseFloat((3*0.000009).toFixed(7));
                  res += meju; res = res.toFixed(7); console.log("res3+ =", res);
                  $("#userLat").val(res)
            
          })
          $("#latsub3").click(function(){
            
                  var res = parseFloat( $("#userLat").val() )  
                  var meju = parseFloat((3*0.000009).toFixed(7));
                  res -= meju; res = res.toFixed(7); console.log("res3+ =", res);
                  $("#userLat").val(res)
          })
          $("#lonadd3").click(function(){
            
                  var res = parseFloat( $("#userLon").val() )  
                  var meju = parseFloat((3*0.000014).toFixed(7));
                  res += meju; res = res.toFixed(7); console.log("lon res3+ =", res);
                  $("#userLon").val(res)
          })
          $("#lonsub3").click(function(){
            
                  var res = parseFloat( $("#userLon").val() )  
                  var meju = parseFloat((3*0.000014).toFixed(7));
                  res -= meju; res = res.toFixed(7); console.log("lon res3+ =", res);
                  $("#userLon").val(res)
          })
          $("#altadd1").click(function(){
            
                  var res = parseFloat( $("#userAlt").val() )  
                  res += 1.00; res = res.toFixed(2);
                  $("#userAlt").val(res) 
          })
          $("#altsub1").click(function(){
                  
                  var res = parseFloat( $("#userAlt").val() )  
                  res -= 1.00; res = res.toFixed(2);
                  $("#userAlt").val(res) 
            
          })
          
  })
  $("#closeNumericDiv").click(function(){
          
          $("div.adjust").off("click");
          $("#numericDiv").hide();
          $("#openNumeric").show();
          $("#mapAlt").show();
          $("#mapAltLabel").show();
    
          $("#repositionMenu").css("height","75%");
          //$("#mapDiv").css("height","200px");
          $("#mapDiv").css("height", $("#mapDiv").height()/3*4)
          $("#mapDiv").css("opacity", 1);
  
  })
  $("#confirmPosition").click(function(){
    
          if ($("#numericDiv").is(":hidden")) {
            
                      //$("div.adjust").off("click");                                                        
                      //alert("nums hidden");
                      // i have repoCoords
                      repoCoords.alt = parseFloat( $("#mapAlt").val()) //.toFixed(2)  
                      console.log("repoCoords", repoCoords)
                            
                      console.log("user from:   ", user)
                      if (newlat!== undefined) user.lat = newlat;//repoCoords        
                      if (newlon!== undefined) user.lon = newlon;
                      user.alt = parseFloat( $("#mapAlt").val());
                      //var final = localObj; final.unshift(user)
                      console.log("user newly to", user);
                      //repoCoords.lat = user.lat;
                      //repoCoords.lon = user.lon;
                      
            
                          //userOld.remove(); userNew.remove();
            
                      tags.unshift(user);
                      setScene(tags, function(){
                        
                                      $("#repositionMenu").hide();
                        
                                      $("#mySettings").show();
                                      $("#reposition").show()
                                      $("#addTag").show()
                                      $("#openKbd").show()
                                      
                        
                                      //$("#mapid").empty()
                      })
            
          } else if (! $("#numericDiv").is(":hidden")) { console.log("---- nums ----");
                                                        
                          //userOld.remove(); userNew.remove();   
                          //$("div.adjust").off("click");                                                        
                                         
                          user.lat = parseFloat($("#userLat").val());                           
                          user.lon = parseFloat($("#userLon").val());
                          user.alt = parseFloat($("#userAlt").val());
                                                        
                          console.log("user to", user);
                                                        
                          tags.unshift(user); 
                          setScene(tags, function(){
                        
                                      $("#repositionMenu").hide();
                            
                                      $("#mySettings").show();
                                      $("#reposition").show()
                                      $("#addTag").show()
                                      $("#openKbd").show()
                        
                                      //$("#mapid").empty()
                          })
          }
          
    
    
          /*if (user === undefined) user = {}
          user.lat = $("#userLat").val();  user.lon = $("#userLon").val(); user.alt = $("#userAlt").val()
          
          console.log("user new coords:", user)
    
          */
    
  })
  $("#closeRepositionMenu").click(function(){
    
              $("#repositionMenu").hide();
    
              $("#mySettings").show();
              $("#reposition").show();
              $("#addTag").show();
              $("#openKbd").show();
              //repoCoords.lat = user.lat;
              //repoCoords.lon = user.lon;
  })
  $("#addTag").on('click', addTagClick)/*function(){
          
          map("map2", user.lat, user.lon, tags, "add_tag");
    
            //console.log("click ```````");
            $("#settings").hide();
            $("#openKbd").hide();
            $("#addTag").hide();
            $("#reposition").hide();
            $("#imgCaptionLabel").hide();
    
            $("#addtagmenu").css("display", "flex");
    
                  $("#text").val("");
                  $("#author").val(username);
                  $("#author").prop("disabled", true);
                  $("#tagSize").val(1);
    
    
                  $("#tagLat").val(user.lat);
                  $("#tagLon").val(user.lon);
                  $("#tagAlt").val(user.alt);
    
                  //x = parseFloat(parseFloat($("#tagLat").val()).toFixed(7) )
                  //console.log("test lat", typeof x, x)
          */
    //}
  //)
  $("#editSubmit").click(function(){
    
        if (confirm("Change: are you sure you want to?")){
            if ($("#imgUpload").is(":visible")){    console.log("--- img is visible", file)
              
                                                
                                                
                          // if changing the image
                          if (file !== undefined) doUpload(file, function(rslt){
                      
                                            var query = { 
                                                        "_id":     changeID,
                                                        "_type":   "img",
                                                        "text":    $("#text").val(),
                                                        "author":  username,

                                                        "col":     $("#selectColor option:selected").val(),
                                                        "size":    parseFloat( $("#tagSize").val()),
                                                        "width":   rslt.width,
                                                        "height":  rslt.height,

                                                        "lat":     parseFloat(parseFloat($("#tagLat").val()).toFixed(7) ),
                                                        "lon":     parseFloat(parseFloat($("#tagLon").val()).toFixed(7) ), 
                                                        "alt":     parseFloat(parseFloat($("#tagAlt").val()).toFixed(7) ),

                                                        "url":     rslt.secure_url,
                                                 //"userCoords": user
                                            }
                                            console.log("--- tag change: new image. \n update to", query)
                            
                                            submitEdit(query)
                                            })
                        // if changing other things but image stays same
                        else {              // find original data of image (url, w, h) according to changeID
                                            var changeIndex
                                            for (var i = 0; i< tagsToEdit.length; i++){
                                              
                                                      if (tagsToEdit[i]._id === changeID) {changeIndex = i; break; }
                                            }
                          
                          
                          
                                            var query = { 
                                                        "_id":     changeID,
                                                        "_type":   "img",
                                                        "text":    $("#text").val(),
                                                        "author":  username,

                                                        "col":     $("#selectColor option:selected").val(),
                                                        "size":    parseFloat(parseFloat($("#tagSize").val()).toFixed(2)),
                                                        "width":   tagsToEdit[changeIndex].width,
                                                        "height":  tagsToEdit[changeIndex].height,

                                                        "lat":     parseFloat(parseFloat($("#tagLat").val()).toFixed(7) ),
                                                        "lon":     parseFloat(parseFloat($("#tagLon").val()).toFixed(7) ), 
                                                        "alt":     parseFloat(parseFloat($("#tagAlt").val()).toFixed(7) ),

                                                        "url":     tagsToEdit[changeIndex].url,
                                                        //"userCoords": user
                                            }
                                            console.log("--- tag change: image stays. \n update to", query)
                                            //console.log("tag to change", query)
                                            submitEdit(query)
                        }
                        
            } else {
              
                  var query = {
                              "_id":    changeID,
                              "_type":  "text",
                              "text":   $("#text").val(),
                              "author": username,//$("#author").val(),
                              "col":    $("#selectColor option:selected").val(),
                              "size":   parseFloat(parseFloat($("#tagSize").val()).toFixed(2)),
                              "lat":    parseFloat(parseFloat($("#tagLat").val()).toFixed(7) ),
                              "lon":    parseFloat(parseFloat($("#tagLon").val()).toFixed(7) ), 
                              "alt":    parseFloat(parseFloat($("#tagAlt").val()).toFixed(7) )
                              }
                  console.log("--- only text \n update to", query)
                  submitEdit(query)
            }
        }
  })
  $("#closeTagMenu").click(function(){
          
            $("#addtagmenu").hide();
            $("#imgUpload").hide();
            //$("#tagsForEditing").empty();
    
            $("#mySettings").show();
            $("#addTag").show();
            $("#openKbd").show();
            $("#reposition").show();
    
                  $("#postText").hide();
                  $("#postPic").show();
                  $("#textLabel").show();
    
                  postType = "text";
                  //file = undefined;
                  //$("#img").attr("src", undefined)
                  
  })
  $("#submit").click(function(){
    
          //console.log("submit clicked")
          if (postType === "text"){
          postTag(function(){
              $("#addtagmenu").hide();
              
              $("#mySettings").show();
              $("#openKbd").show()
              $("#addTag").show()  
              $("#reposition").show();
          })
            
            
          } else if (postType === "img"){
                console.log("image posted?")
              
                doUpload(file, function(re){
                                
                                  var query = { 
                                                        "_type":   "img",
                                                        "text":    $("#text").val(),
                                                        "author":  username,

                                                        "col":     $("#selectColor option:selected").val(),
                                                        "size":    parseFloat( $("#tagSize").val()),
                                                        "width":   re.width,
                                                        "height":  re.height,

                                                        "lat":     parseFloat(parseFloat($("#tagLat").val()).toFixed(7) ),
                                                        "lon":     parseFloat(parseFloat($("#tagLon").val()).toFixed(7) ), 
                                                        "alt":     parseFloat(parseFloat($("#tagAlt").val()).toFixed(7) ),

                                                        "url":     re.secure_url,
                                                 //"userCoords": user
                                              }
                                          //"lon":    parseFloat( $("#tagLon").val() ),
                                          //"alt":    parseFloat( $("#tagAlt").val() )
                              console.log("test lat", parseFloat( $("#tagLat").val() ).toFixed(7) )

                              $.post("img" , JSON.stringify(query) , function(data, status){
                                                      if (data==="ok") {
                                                              
                                                                getTags()
                                                        
                                                                $("#addtagmenu").hide();
                                                                $("#imgUpload").hide();
                                                                      $("#textLabel").show();
                                                        
                                                                $("#postText").hide();
                                                                $("#postPic").show();
                                                        
                                                                $("#mySettings").show();
                                                                $("#reposition").show();
                                                                $("#openKbd").show();
                                                                $("#addTag").show();  
                                                                
                                                                file = undefined;
                                                      }
                                                      //tags = data;
                                                      console.log(data)//"after image posted - updated tags",tags)
                                                      /*tags.unshift(user)
                                                      setScene(tags, function(){

                                                              console.log("---- posted, scene set to new one")
                                                              //cb()
                                                      })*/
                              })
                })
          }  
          postType = "text";
  })

  video();
  getGPS("repo", function(){
    
                getTags(function(){
                
                        //tags.unshift(user)
                        //setScene(tags)
                });    
  });
  
})//end of Document ready function

function postTag(cb){
  
        var newtag = {
            "_type":  "text",
            "text":   $("#text").val(),
            "author": username,//$("#author").val(),
            "col":    $("#selectColor option:selected").val(),
            "size":   parseFloat( $("#tagSize").val()),
            "lat":    parseFloat( $("#tagLat").val() ),//.toFixed(7),
            "lon":    parseFloat( $("#tagLon").val() ),//.toPrecision(9),
            "alt":    parseFloat( $("#tagAlt").val() )
            }
            /* "name": "tag1" */
            
        
            console.log( "precision " + newtag.lat.toFixed(7) )// newtag.lat.toPrecision(9)   )
            newtag.lat = parseFloat( newtag.lat.toFixed(7)) 
            newtag.lon = parseFloat( newtag.lon.toFixed(7))
            newtag.alt = parseFloat( newtag.alt.toFixed(7))
  
  
        console.log("newtag",newtag)
        
        
        $.post("postTag", JSON.stringify(newtag), function(data, status){

                      console.log("post status", status)
                      console.log("received data", data)
          
                      tags = data;
          
                      tags.unshift(user)
                      setScene(tags, function(){
                        
                              console.log("---- posted, scene set to new one")
                              cb()
                      })
                      
        })

        
}
function getTags(cb){
  
        var tosend = {username: username, userCoords: user}
                    console.log("tosend", tosend, "<")
                          // JSON.stringify
        $.get("getTags", tosend , function(data, status){
          
                      //console.log("status, data", status, typeof data, "array?",Array.isArray(data), data)
                      //console.log("get data:", data.length, data)
          
                      tags = data;
                      console.log("received tags:", tags.length, tags)
          
                      tags.unshift(user)
                      setScene(tags , function(){
                        
                                console.log("--------------------------")
                                console.log("tags after setScene", tags.length, tags)
                        
                                if (cb) cb();
                      })
        })
}
function setScene(obj,cb){
      
  
    if (confirm("face North now")){ 
      
                    
                    $("a-animation").remove();
                    $("a-text").remove();
                    $("a-image").remove();

                    console.log("obj to display:", obj.length, obj)


                    // first just position, rotation later
                    var minLat = obj[0].lat; var minLon = obj[0].lon;
                    var maxLat = obj[0].lat; var maxLon = obj[0].lon;



                    for (var i = 1; i< obj.length; i++){

                          if (obj[i].lat < minLat) {minLat = obj[i].lat; _minLat = minLat}
                          if (obj[i].lon < minLon) {minLon = obj[i].lon; _minLon = minLon}
                          //if (obj[i].lat > maxLat) maxLat = obj[i].lat
                          //if (obj[i].lon > maxLon) maxLon = obj[i].lon

                    } //console.log(minLat, minLon, maxLat, maxLon);
      
      
      
      //    na lat rozdíl  0.000009 = 1m
      //    na lon rozdíl  0.000014 = 1,03m
      
      for (var i = 0; i< obj.length; i++){
        
              if (obj[i].text === "zero point"){ obj[i].pos = "0 0 0"; continue}
        
              // facing north, Z = latitude
              var m= 10000000  
        
                  obj[i].x = (  (  (obj[i].lat - minLat) * m) / (0.000009 * m)).toPrecision(8)       //console.log(  ( ((obj[i].lat - minLat)* m) / (0.000009 * m)).toPrecision(8) )
        
                  obj[i].z = ( ((obj[i].lon - minLon)* m) /  (0.000014 * m)).toPrecision(8) 
        
                  obj[i].pos = obj[i].x + " " + obj[i].alt + " " + obj[i].z
        
              
        
      }
      
      
      
      // create a-text itself
      for (var i = 1; i< obj.length; i++){
        
        
        if(obj[i]._type === "text"){
          
                if (obj[i].size === undefined) var scale = "1.5 1.5 1.5"
                else if (obj[i].size !== undefined) var scale = obj[i].size + " " + obj[i].size + " " + obj[i].size

                $("a-scene").append('<a-text id="' + i + '" value="' + obj[i].text + '" color="'+ obj[i].col + 
                                    '" position="' + obj[i].pos+ '" scale="' + scale + '"' + 
                                    //'transparent="false"' +
                                    'align="center"' + 
                                    'rotation="0 50 0">' +
                                    '<a-animation attribute="rotation" dur="7000" fill="forwards" from="0 50 0" ' +
                                    'to="0 410 0" easing="linear" repeat="indefinite"></a-animation>' +

                                    '</a-text>')

                $("a-scene").append('<a-text id="' + i + '" value="' + obj[i].text + '" color="'+ obj[i].col + 
                                    '" position="' + obj[i].pos+ '" scale="' + scale + '"' + 
                                    //'transparent="false"' +
                                    'align="center"' + 
                                    'rotation="0 -130 0">' +
                                    '<a-animation attribute="rotation" dur="7000" fill="forwards" from="0 -130 0" ' +
                                    'to="0 230 0" easing="linear" repeat="indefinite"></a-animation>' +
                                    '</a-text>')
          } else if (obj[i]._type === "img"){
            
                    var w = obj[i].size 
                    var h = parseFloat((   (obj[i].height/obj[i].width) * obj[i].size).toFixed(2)  )
                    //var h = parseFloat(((400/300) * 12).toFixed(2))
            
                    $("a-scene").append('<a-image src="' + obj[i].url + '" width="'+ w + '" height="'+ h + '"' +
                                        ' position="' + obj[i].pos + '" >' +
                                        '<a-animation attribute="rotation" dur="3000" fill="forwards" from="0 0 0" ' +
                                        'to="0 360 0" easing="linear" repeat="indefinite"></a-animation>' +
                                        '</a-image>')
            
          }
        
      }
      
      $("#cam").attr("position", obj[0].x + " " + obj[0].alt + " " + obj[0].z);
      $("#cam").attr("rotation", "0 -90 0");    // y +90 camera points to S; // -90 = camera points to N
      //$("#cam").attr("fov", 50);
      
      var x = parseFloat(obj[0].x) + 100; console.log(typeof x)
      var y = obj[0].alt + 85;
      var spherePos = x + " " + y + " " + obj[0].z
      console.log("north indicator pos", spherePos);
      $("a-scene").append('<a-sphere position="' + spherePos + '" radius=1 color="red"></a-sphere>')
      
      //$('a-text [value="welcome to Space-tags"]').attr("rotation", "0 0 0");
      //$('#1').attr("rotation", "0 0 0");
      
      tags.shift()
          console.log("tags after setScene", tags.length, tags)
      
      if (cb) cb()
      
      
      
    }
}
function getGPS(req, cb) {
  
    console.log("gps request")
  
    if (logr) $("#pgps").html(" getting gps");
  
    var options = {//enableHighAccuracy: true, 
                   maximumAge: 10000
                  };
  
    
    if (navigator.geolocation) {   if (logr)  $("#pgps").html(" gps" + navigator.geolocation.getCurrentPosition);
                                
                                
        navigator.geolocation.getCurrentPosition(function(position){
              //$("#pgps").html(" gps 44");
            
              /*var date = new Date(position.timestamp)// *1000);
              //date.setTime();
              //date.setHours(date.getHours()+2);
              //var   dateString = date.toUTCString();
                    
              $("p").html("current coords: " + position.coords.latitude + " "+ position.coords.longitude + 
                          "</br> alt " + position.coords.altitude + " accur " + position.coords.accuracy + 
                          " heading " + position.coords.heading + " speed " + position.coords.speed + //'</br>' +
                          //datevalues + 
                          '</br> data from: ' + dateString);
              //cam.lat = position.coords.latitude; cam.lon = position.coords.longitude;
                          */
                            
              if (req === "repo"){
                  user = {}
                  
                  //user = { "lat": 48.191482, "lon":16.295164, "alt": 0}
                  
                  user.lat = parseFloat(position.coords.latitude.toFixed(7));
                  user.lon = parseFloat(position.coords.longitude.toFixed(7));
                  user.alt = parseFloat(position.coords.altitude.toFixed(2));
                  
                  if (user.alt === 0){
                    
                      $.get("elevation", user ,function(data, status){
                        
                            console.log("elevation",data)
                            user.alt = parseFloat(data)
                        
                             $("#mapAlt").val(user.alt)
                              
                            cb()
                      })
                  } else {
                
                      $("#mapAlt").val(user.alt)
                      //console.log("user on gps",user.lon, typeof user.lon);
                      console.log("user @ gps",user);

                      if (logr) var x = $("#pgps").html()
                      if (logr) $("#pgps").html( user.lat + '<br>' + user.lon);
                      if (logr)  setTimeout(function(){ $("#pgps").html(x); $("#pgps").fadeOut(1000) }, 2000)

                      cb()  
                    
                  }
                
              }
          
                    /*$("#userLat").val(user.lat)
                    $("#userLon").val(user.lon)
                    $("#userAlt").val(user.alt)
                    */
          
             // if (cb) cb();
          
        }, function(){
                if (logr) $("#pgps").html("<br> error in navigator");    
        }, options);
      
    } else {
      
          if (logr)  $("#pgps").html("refused nvgtr");
          console.log("|||||||   no navigator!!");
    }
}
function map(divname, ulat, ulon, t, msg){
          //console.log("map?", ulat, ulon, cntr);
          console.log(msg+ ", user at " + user.lat + " , " + user.lon);
          //$("#mapDiv").empty();
          $("#" + divname).replaceWith('<div id="' + divname + '" class="mapid"></div>')  //$("#mapDiv")
          //$("#map").replaceWith('<div id="map" class="mapid"></div>')  //$("#mapDiv")
  
               if (user.lat === undefined) var mymap = L.map(divname).setView([0, 0], 8);          
          else if (user.lat !== undefined) var mymap = L.map(divname).setView([user.lat, user.lon], 17);          

          //var add_tag = L.map('map').setView([0,0], 17);// [user.lat, user.lon]
  
          //if      (layer === undefined) {console.log("layer undefined");}
          //else if (layer !== undefined) {console.log("layer", layer);}
  
          var layer
         // if (msg === undefined){
                    
                    layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
                                { maxZoom: 22,
                                  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',// +
                                  //'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                  //'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                                  id: 'mapbox.streets'
                    }).addTo(mymap); //or removeFrom 
          /*} else if (msg === "add_tag"){
                var layer2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
                            { maxZoom: 22,
                              attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
                              id: 'mapbox.streets'
                }).addTo(add_tag);
          }*/

          repoCoords.lat = user.lat;
          repoCoords.lon = user.lon;
  
        if (userOld !== undefined) userOld.remove()
        if (userNew !== undefined) userNew.remove()
  
    //var
    userOld = L.marker([user.lat, user.lon]).addTo(mymap).bindPopup("GPS says this").openPopup();
  
    for (var i = 0; i< t.length; i++){
      
            if (t[i].name === "zero") continue;
      
            var col, fillOpa;
            if (t[i]._type === "text")     col = t[i].col; else col = "white"
            if (t[i]._type === "text") fillOpa = 0.25; else fillOpa = 0;
      
            var circle = L.circle([t[i].lat, t[i].lon],{
                                                        color: col, 
                                                        fillColor: t[i].col, 
                                                        fillOpacity: fillOpa, 
                                                        radius: 3
            }).addTo(mymap).bindPopup( t[i]._type + " @ " + t[i].alt + " m high");//.openPopup()  //
    }
    //var userNew;
    
    //var popup = L.popup();
    
    
  
    function onMapClick(e) {  //console.log("lat long of click=", e.latlng)
        
                    if (userNew !== undefined) userNew.remove()
                    //userNew.remove()
                    userOld.remove()
      
                    userOld = L.marker([user.lat, user.lon],{opacity: 0.4} ).addTo(mymap).bindPopup("you now").openPopup();
      
                    userNew = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap).bindPopup("go here").openPopup();

                                        //repoCoords.lat 
                    newlat  = parseFloat(e.latlng.lat.toFixed(7));
      
                                        //repoCoords.lon 
                    newlon  = parseFloat(e.latlng.lng.toFixed(7));
      
      
                    console.log("user to?", user.lat, user.lon)

                    /*popup  
                        .setLatLng(e.latlng)
                        .setContent("maybe youre here " + e.latlng.toString())
                        .openOn(mymap);
                    */
    }

    mymap.on('click', onMapClick);
  
    $("#closeRepositionMenu").click(function(){
              //repoCoords.lat = undefined;
              //repoCoords.lon = undefined;
      
              userOld.remove()
              userNew.remove()
              mymap.off('click')
              //$("#closeRepositionMenu").off("click")
              console.log("old markers removed?")
    })      
    $("#confirmPosition").click(function(){
              //userOld.remove() //userNew.remove()
              //repoCoords.lat = newlat;
              //repoCoords.lon = newlon;
              mymap.off('click')
              //console.log(repoCoords);
    })
                  
      //marker.bindPopup("you!").openPopup();
  
}//end of Map fun
function video(){
    
            
            //setScene([cam, tag1, dvur, balkon, zero])
            //$("p").val() +
            var front = false
            var videoOptions = { audio: false,
                                 video: {
                                         facingMode: "environment",// front? "user" : "environment" 
                                         width: {ideal: 500 }, // window.innerWidth
                                         height:{ideal: window.innerHeight } //window.innerHeight + "px"
                                        }
                               }
            
            //console.log(navigator.mediaDevices)
            //console.log(navigator.mediaDevices.getUserMedia)
            //$("p").html($("p").html() + " " + navigator.mediaDevices.toString() + ',<br>getUserMedia: ' + navigator.mediaDevices.getUserMedia)
            if (logr) $("#pvid").html("nav.mediaDevices.getUM>" + navigator.mediaDevices + "<");          
            if (logr) $("#pvid").html( "test x");// + $("#p").html())
  
                      if (navigator.mediaDevices === undefined) {
                        navigator.mediaDevices = {};
                      }
                      else if (navigator.mediaDevices !== undefined) {
                        
                          $(":file").hide()
                      }

                      // Some browsers partially implement mediaDevices. We can't just assign an object
                      // with getUserMedia as it would overwrite existing properties.
                      // Here, we will just add the getUserMedia property if it's missing.
  
                      if (navigator.mediaDevices.getUserMedia === undefined) {
                        
                        if (logr) $("#pvid").html("test A");
                        
                        navigator.mediaDevices.getUserMedia = function(constraints) {

                          //$("#pvid").html("constraints")
                          // First get ahold of the legacy getUserMedia, if present
                          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                          if (logr) $("#pvid").html("still nothing" + navigator.webkitGetUserMedia + " " + navigator.mozGetUserMedia + "<")
                          
                          // Some browsers just don't implement it - return a rejected promise with an error to keep a consistent interface
                          if (!getUserMedia) {
                            
                                $("#camera-stream").replaceWith('<div id="camera-stream" style="' + 
                                                                'margin: 0px; padding: 0px; width:100%; height: 85%; z-index: -1;"></div>')
                            
                            
                            //return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                          } else {
                            if (logr) $("#pvid").html("could work" + "<")
                          }

                          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                             return new Promise(function(resolve, reject) {
                            
                                        getUserMedia.call(navigator, constraints, resolve, reject);
                            
                          });
                        }
                      }
            console.log("video to play")
            navigator.mediaDevices.getUserMedia(videoOptions).then(function(stream){

                        //alert("video")
                        if (logr) $("#pvid").html("sukces video func");
                        if (logr) $("#pvid").fadeOut(5000);
              
                        //var 
                        window.localStream = stream;
                        vid = document.getElementById('camera-stream');
                        vid.src = window.URL.createObjectURL(stream);//.play();
                        vid.play();
                        $("#camera-stream").show();
                        
                        //$("#controls").height($("#video-container").height() - $("#camera-stream").height())
              
                        //$("#camera-stream").css({"position": "relative", "top": "-" + ($("p").height()/2)  })
            }).catch(function(err){ 
              
                        if (logr) $("#pvid").fadeOut(5000);$("#pvid").html(" !! no user media !!"); 
                        if (logr) $("#pvid").fadeOut(5000); $("#pvid").fadeOut(4000);
                        $(":file").fadeOut(4000);
              //alert("no video")
                        $("#camera-stream").hide();
                        
            })
    
            
  }
function formatD(msg){
  
  
  
  
  if (window.innerWidth < 340){
  
    
    
    var fontsize = 13;
      
      
      $("#repositionMenu label").css("font-size", fontsize);   //  $("[href='default.htm']")
      $(".adjust").css("font-size", fontsize);  //
      $("#usegps, #openNumeric, #closeRepositionMenu, #closeNumericDiv").css("font-size", fontsize);
      $(".tagMenuItem").css("font-size", fontsize);  
    
    
    
      $("#mapDiv").css("height","160px");
      //$("input [type='number']").css("font-size", fontsize);
    //$(":text").css("font-size", fontsize);
    
    //alert("small");  
  }
  else {
   // alert("big");
    
    var fontsize = 22;
    
    //$("body").css("fontSize", fontsize + "px");
    
    $("#mapDiv").css("height", "200px");
    
    
    //$("#controls").height($("#video-container").height() - $("#camera-stream").height())
    
  }
  
  //alert(msg);
  //return
}
function register(){

        //var obj = {}
        $.post("register", JSON.stringify({"nick": $("#regName").val(), "email": $("#regMail").val(), 
                                           "pass": $("#regPass").val(), "why": $("#regWhy").val() }), 
               function(data, status){
          
                    console.log("status",status, data);
                    console.log("test")
          
                    if (data === "occupied"){
                      
                            console.log("cant")
                            $("#sendMail").hide()
                            $('<label id="warning">this email is already in use<br>try another one</label>').appendTo($("#regDiv"))
                            setTimeout(function(){
                              
                                    $("#warning").fadeOut(2000, function(){ $("#warning").remove(); $("#sendMail").show();})
                                    
                            }, 4000)
                      
                      
                    } else if (data === "ok"){
                      
                            $("#regDiv").append('<label id="warning">registration successful, check your email, incl. spam</label>')
                            $("#regDiv input, #regDiv div").hide();
                            console.log("alles ok w reg");
                            username = $("#regName").val();
                            console.info("username", username)
                            $("#regAndLogin").fadeOut(4000, function(){
                              
                                  //$("#controls").show();
                                  $("#controls").css("display", "flex");
                              
                            })
                    }
          
        })
}
function login(){
  
              var x = JSON.stringify({nick: $("#loginNick").val(),pass: $("#loginPass").val()})
  
              console.log(x)
              $.post("/login", x, 
                     function(data, status,xhr){

                        //console.log(data)//, status)
                        //console.log("test")
                
                        if (data !== "fail"){
                          
                              //$("#loginDiv").hide();
                              //$("#regDiv").hide();
                              $("#regAndLogin").hide()
                              //alert("| you inlogged |");
                          
                              $("#controls").css("display", "flex");
                              $("#addTag").show();
                          
                              username = $("#loginNick").val().toString()
                              console.log("user logged in:", username);
                          
                              $("#mySettings").attr("class", "button sized");
                              $("#mySettings").click(mySettingsClick)
                              $("#addTag").attr("class", "button sized");
                              $("#addTag").click(addTagClick);
                          
                        } else if (status != "success" || data === "fail") {
                          
                               console.log("user not found")
                              $("#login").html("wrong nick or pass, try again");
                              
                              setTimeout(function(){ $("#login").html("login") }, 3000)
                             
                        
                        }
                    //console.log("d s ",data, status,xhr)

              })
}
function usePublic(){
  
      $("#controls").css("display", "flex");
      //$("#addTag").hide();
  
      $("#loginButton").css("font-size", "17px");
      $("#publicButton").hide();
  
      $("#regAndLogButtons").css({ //"height": "35px",
                                  "display":"flex",
                                  "flex-direction": "row",
                                  "justify-content": "space-around",
                                  "align-items": "center"})
  
      $("#regAndLogin").css({ "position":"absolute", "top": "0px", 
                              "height": "35px",
                              "display":"flex",
                              "flex-direction": "row"});
      
      
      $("#mySettings").attr("class", "button sized disabled");
      //$("#mySettings").off("click");
      $("#addTag").attr("class", "button sized disabled");
      $("#addTag").off("click");

      console.log("disabled?");
      
  
}
function imgChange(){
          //function(){   
          
          
            
            
                    //console.log("upload", this)
                    console.log("files",this.files[0])
                    //console.log("files", this.files)
            
                    if (this.files && this.files[0]) {  console.log("has files")
                      
                              var reader  = new FileReader();
                              console.log(reader)
                              file = this.files[0] //reader.readAsDataURL(...)
                              //console.log("File name: " + file.name);                        
                                          
                              reader.readAsDataURL(this.files[0]);
                                                      
                              console.log("test end", file)
                              var data
                              reader.onload = function(ev) { 
                                
                                    //console.log("redaer")
                                    //var 
                                    data = reader.result//reader.result
                                    //console.log(typeof data, "\n", data )
                                    //var file = reader.readAsDataURL(this.files[0]); //$('#imgToUp').files[0];
                                    
                                    $('#img').attr("src",data);
                                    $('#img').show();
                                    $('#img').css({"width": "100px", "height": "100px"});

                                /*if (file) {
                                   reader.readAsDataURL(file); //reads the data as a URL
                               } else {
                                   preview.src = "";
                               }*/
                              }
                    }
        //})
}
function imgUpload(){
          //console.log("is imgDiv visible?", $("#imgUpload").is(":visible"))
          postType = "img";
          //$("#whatDiv").hide(); $("#whereDiv").hide();
          $("#imgUpload").css("display", "flex");
          $("#imgToUp").show();
          $("#imgCaptionLabel").show();
  
          $("#postText").css("display", "flex");
          $("#postPic").hide();
  
                $("#textLabel").hide();
          
          $('#imgToUp').change(imgChange)
}
var doUpload = function(file, cb){
                                          //var files = document.getElementById("myid").files; 
                    var formData = new FormData();
                    formData.append('file', file);                        //for (file of files) { formData.append('file', file);}
                    formData.append("api_key", 584391114359699);
                    formData.append("upload_preset", "preset1");
  
                    var xhr = new XMLHttpRequest();
                                          xhr.open('POST', "https://api.cloudinary.com/v1_1/okram/image/upload", true);
                                          xhr.onload = function () {
                                              if (xhr.readyState === xhr.DONE) {
                                                  if (xhr.status === 200) {
                                                      var resp = JSON.parse(xhr.responseText)
                                                      console.log("url?",resp.secure_url)
                                                    
                                                      console.log(JSON.parse(xhr.responseText));
                                                      cb(resp)
                                                      file = undefined
                                                  } else {
                                                      console.log("error with uploading");
                                                      file = undefined
                                                  }
                                              }
                                          };
                    xhr.send(formData);
}
function toText(){
  
              $("#imgUpload").hide();
              $("#img").attr("src","")
  
              $("#textLabel").show();
              $("#imgCaptionLabel").hide();
                                                        
              $("#postText").hide();
              $("#postPic").show();
  
  
              postType="text";
}
function mySettingsClick(){
  
          $("#mySettings").hide();
          $("#reposition").hide();
          $("#addTag").hide();
          $("#openKbd").hide();
  
          $("#settingsDiv").show();
}
function addTagClick(){
                  console.log("is imgDiv visible?", $("#imgUpload").is(":visible"))
                  map("map2", user.lat, user.lon, tags, "add_tag");

                  console.log("click ``add tag``");
                  $("#mySettings").hide();
                  $("#openKbd").hide();
                  $("#addTag").hide();
                  $("#reposition").hide();
                  $("#imgCaptionLabel").hide();

                  $("#addtagmenu").css("display", "flex");

                          $("#text").val("");
                          $("#author").val(username);
                          $("#author").prop("disabled", true);
                          $("#tagSize").val(1);


                          $("#tagLat").val(user.lat);
                          $("#tagLon").val(user.lon);
                          $("#tagAlt").val(user.alt);
}
function getMyTags(){
  
          var query = user;
          query.username = username;
  
          $.post("getmytags", JSON.stringify(query), function(data, status){
            
                  tagsToEdit = data;
              
                  $("#tagsForEditing").css("display","flex");
                  $("#tagsForEditing").empty();
            
            
                  tagsToEdit.forEach(function(item, index){
                    
                          if (item._type === "text"){
                    
                                $("#tagsForEditing").append('<div style="display: flex">' + 
                                                                '<div id="tagEdit' + index + '"+ title="' + item._id + '" class="tagToEdit">' + 
                                                                      '<div class="tagText">' + item.text + '</div>' + 
                                                                      '<i class="fa fa-font" aria-hidden="false"></i>' + 
                                                                '</div>' + 
                                                                '<div id="delete' + index + '"><i class="fa fa-trash" aria-hidden="false"></i></div>' +
                                                            '</div>')
                                $("#tagEdit" + index).click(function(){
                                  
                                            console.log("this", this)
                                            editTag(index);
                                            //this.off("click")
                                            $("#tagEdit" + index).off("click")
                                            console.log("test edit", index)
                                })
                                $("#delete" + index).click(function(){
                                            console.log("this", this)
                                            //console.log("delete", index)
                                            //this.off("click")
                                            $("#tagEdit" + index).off("click")
                                            console.log("delete", index)
                                })
                            
                            
                          } else if (item._type === "img"){
                            
                                $("#tagsForEditing").append('<div style="display: flex">' + 
                                                                '<div id="tagEdit' + index + '"+ title="' + item._id + '" class="tagToEdit">' + 
                                                                    '<div class="tagText">' + item.text + '</div>' + 
                                                                    '<i class="fa fa-picture-o" aria-hidden="false"></i>' + 
                                                                '</div>' +
                                                                '<div id="delete' + index + '"><i class="fa fa-trash" aria-hidden="false"></i></div>' +
                                                            '</div>')
                            
                                $("#tagEdit" + index).click(function(){
                                            editTag(index);
                                            console.log("this", this)
                                            this.off("click")
                                })
                                $("#delete" + index).click(function(){
                                            console.log("delete", index)
                                            console.log("this", this)
                                            this.off("click")
                                })
                          }
                    
                  })
            
          })
  
}
function editTag(i){
  
          console.log("tag to edit", i)
  
          $("#tagsForEditing").hide();
          
          
          map("map2", user.lat, user.lon, tags, "add_tag");

                  console.log("click ``add tag``");
                  $("#mySettings").hide();
                  $("#openKbd").hide();
                  $("#addTag").hide();
                  $("#reposition").hide();
                  $("#imgCaptionLabel").hide();
                  
                  $("#settingsDiv").hide();
  
                  $("#submit").hide();
                  $("#editSubmit").show();
  
                  $("#addtagmenu").css("display", "flex");
  
                  //console.log("is imgDiv visible?", $("#imgUpload").is(":visible"))

                          $("#text").val(tagsToEdit[i].text);
                          $("#author").val(tagsToEdit[i].author);
                          $("#author").prop("disabled", true);
                          $("#tagSize").val(tagsToEdit[i].size);

                          var l = $("#selectColor option") ;//console.log("l",l)

                          for (var j=1; j<l.length; j++ ){

                                                        if ( tagsToEdit[i].col === l[j].value) l[j].selected = true  

                                                        else l[j].selected = false  
                                                

                          }
                          $("#imgUpload").hide()
  
                          if (tagsToEdit[i].hasOwnProperty("url")) {
                            
                                    console.log("you wanna edit img tag");
                            
                                    $("#imgUpload").css("display", "flex")
                                    $("#imgUpload input").css("display", "flex")
                            
                                    
                                    //$("#imgToUp").show();  
                                    $("#imgCaptionLabel").show();
                                    $("#textLabel").hide();
                            
                                    $("#img").attr("src", tagsToEdit[i].url)
                                    $("#img").show()
                                    
                          } 

                          $("#tagLat").val(tagsToEdit[i].lat);
                          $("#tagLon").val(tagsToEdit[i].lon);
                          $("#tagAlt").val(tagsToEdit[i].alt);
  
                          changeID = tagsToEdit[i]._id
}
function submitEdit(obj,cb){
  
            $.post("edit", JSON.stringify(obj), function(data, status){
              
                      console.log("",data)
              
                      if (data === "ok") getTags(function(){
                        
                                                  console.log(" - - - tag should be updated now")
                                                  $("#addtagmenu").hide()
                        
                                                  $("#mySettings").show();
                                                  $("#reposition").show();
                                                  $("#openKbd").show();
                                                  $("#addTag").show();  
                                                                
                                                  file = undefined;
                                                                
                                         })
              
            })
  
}