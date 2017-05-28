/*
  				na lat rozdíl  0.000009 = 1m		  //	1”  = 30.89 m
				  na lon rozdíl  0.000014 = 1,03m		//	1”  = 20.59 m

*/
var logr= false;

var vid;


var cntr = 0;
var tags;

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
      //alert("stopped?");
      //vid.play();
      //$("#video-container").append('<video id="camera-stream" style="border- 1px dashed cyan" autoplay></video>');
      video();
  })
  
  $("#reposition").on('click', function(){
          
        $("#addTag").hide()
        
        console.log("click repo```````")//, user.lat, user.lon);
        //console.log("user before @", user)
        $("#repositionMenu").css("display", "flex")
        $("#reposition").hide()
    
    
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
        map(user.lat, user.lon, tags)
    
        //console.log ("click finito")
    
  })
  $("#usegps").click(function(){
            
              getGPS("repo", function(){
                
                      map(user.lat, user.lon)
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
                                      $("#reposition").show()
                                      $("#addTag").show()
                        
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
                                      $("#reposition").show()
                                      $("#addTag").show()
                        
                                      //$("#mapid").empty()
                          })
          }
          
    
    
          /*if (user === undefined) user = {}
          user.lat = $("#userLat").val();  user.lon = $("#userLon").val(); user.alt = $("#userAlt").val()
          
          console.log("user new coords:", user)
    
          */
    
  })
  $("#closeRepositionMenu").click(function(){
    
              $("#repositionMenu").hide()
              $("#reposition").show()
              $("#addTag").show()
              //repoCoords.lat = user.lat;
              //repoCoords.lon = user.lon;
  })
  $("#addTag").on('click', function(){
          
            console.log("click ```````");
            $("#addTag").hide();
            $("#reposition").hide();
            $("#addtagmenu").css("display", "flex");
    
                  $("#tagLat").val(user.lat)
                  $("#tagLon").val(user.lon)
                  $("#tagAlt").val(user.alt)

  })
  $("#closeTagMenu").click(function(){
          
            $("#addtagmenu").hide();
            $("#addTag").show()
            $("#reposition").show();
  })
  $("#submit").click(function(){
    
            console.log("submit clicked")
    
          postTag(function(){
              $("#addtagmenu").hide();
              $("#addTag").show()  
          })
  })

  //$("#p").html(" aaaaa ");
  getTags();
  
  video();
  
  
  getGPS("repo", function(){
    
                tags.unshift(user)
                setScene(tags)
  });
  
  
})//end of Document ready function

function postTag(cb){
  
        var newtag = {
            "_type":  "text",
            "text":   $("#text").val(),
            "author": $("#author").val(),
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
function getTags(){
  
        $.get("getTags", function(data, status){
          
                      //console.log("status, data", status, typeof data, "array?",Array.isArray(data), data)
                      //console.log("get data:", data.length, data)
          
                      tags = data;
                      console.log("tags:", tags.length, tags)
          
                      tags.unshift(user)
                      setScene(tags , function(){
                        
                                console.log("--------------------------")
                                console.log("tags after setScene", tags.length, tags)  
                      })
        })
}
function setScene(obj,cb){
      
  
    if (confirm("face SOUTH now")){ 
      
                    
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
            
                    $("a-scene").append('<a-image src="' + obj[i].url + '" width="'+ obj[i].width + '" height="'+ obj[i].height + '"' +
                                        ' position="' + obj[i].pos + '" >' +
                                        '<a-animation attribute="rotation" dur="3000" fill="forwards" from="0 0 0" ' +
                                        'to="0 360 0" easing="linear" repeat="indefinite"></a-animation>' +
                                        '</a-image>')
            
          }
        
      }
      
      $("#cam").attr("position", obj[0].x + " " + obj[0].alt + " " + obj[0].z);
      $("#cam").attr("rotation", "0 90 0");    // y +90 camera points to S; // -90 = camera points to N
      
      //$('a-text [value="welcome to Space-tags"]').attr("rotation", "0 0 0");
      //$('#1').attr("rotation", "0 0 0");
      
      tags.shift()
          console.log("tags after setScene", tags.length, tags)
      
      if (cb) cb()
      
      
      
    }
}
function getGPS(req, cb) {
  
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
                
                  user.lat = parseFloat(position.coords.latitude.toFixed(7));
                  user.lon = parseFloat(position.coords.longitude.toFixed(7));
                  user.alt = parseFloat(position.coords.altitude.toFixed(2));
                
                  $("#mapAlt").val(user.alt)
                  //console.log("user on gps",user.lon, typeof user.lon);
                  console.log("user on gps",user);
                  
                  if (logr) var x = $("#pgps").html()
                  if (logr) $("#pgps").html( user.lat + '<br>' + user.lon);
                  if (logr)  setTimeout(function(){ $("#pgps").html(x); $("#pgps").fadeOut(1000) }, 2000)
                  
              }
          
                    /*$("#userLat").val(user.lat)
                    $("#userLon").val(user.lon)
                    $("#userAlt").val(user.alt)
                    */
          
              if (cb) cb();
          
        }, function(){
                if (logr) $("#pgps").html("<br> error in navigator");    
        }, options);
      
    } else {
      
          if (logr)  $("#pgps").html("refused nvgtr");
          console.log("|||||||   no navigator!!");
    }
}
function map(ulat, ulon, t){
          //console.log("map?", ulat, ulon, cntr);
          //console.log("user at " + user.lat + " , " + user.lon);
          //$("#mapDiv").empty();
          $("#mapid").replaceWith('<div id="mapid" class="mapid"></div>')  //$("#mapDiv")
  
               if (user.lat === undefined) var mymap = L.map('mapid').setView([0, 0], 8);          
          else if (user.lat !== undefined) var mymap = L.map('mapid').setView([user.lat, user.lon], 17);          

          //if      (layer === undefined) {console.log("layer undefined");}
          //else if (layer !== undefined) {console.log("layer", layer);}
  
          var layer
          layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', 
                      { maxZoom: 22,
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',// +
                        //'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        //'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        id: 'mapbox.streets'
          }).addTo(mymap); //or removeFrom 
  

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
  
            navigator.mediaDevices.getUserMedia(videoOptions).then(function(stream){

                        if (logr) $("#pvid").html("sukces video func");
                        if (logr) $("#pvid").fadeOut(5000);
              
                        //var 
                        window.localStream = stream;
                        vid = document.getElementById('camera-stream');
                        vid.src = window.URL.createObjectURL(stream);//.play();
                        vid.play();
                        
                        //$("#controls").height($("#video-container").height() - $("#camera-stream").height())
              
                        //$("#camera-stream").css({"position": "relative", "top": "-" + ($("p").height()/2)  })
            }).catch(function(err){ 
              
                        if (logr) $("#pvid").fadeOut(5000);$("#pvid").html(" !! no user media !!"); 
                        if (logr) $("#pvid").fadeOut(5000); $("#pvid").fadeOut(4000);
                        $(":file").fadeOut(4000);
                        
            })
    
            
  }
function formatD(msg){
  
  
  
  
  if (window.innerWidth < 340){
  
    
    
    var fontsize = 15;
      
      
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