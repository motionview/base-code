
 
function t1_press()
{
$.cookie("fname",'T1.mgh')
$.cookie("Series_type",'Series: T1')
location.reload();
}  

function t2_press()
{
$.cookie("fname",'T2.mgh')
$.cookie("Series_type",'Series: T2')
location.reload();  
}


function st_press()
{
$.cookie("fname",'FL.mgh')
$.cookie("Series_type",'Series: FL')
location.reload();  
}


function td_press()
{
$.cookie("fname",'SOUS.mgh')
$.cookie("Series_type",'Series: T1SE')
location.reload();  
}



window.onload = function() {
  //
  // try to create the 3D renderer
  //
  _webGLFriendly = true;
  
  
  $("#series_type").text($.cookie("Series_type")).css('color','white').css('font-size','30').css('font-family','Arial')
  $("#patient_info").css('color','white').css('font-size','20').css('font-family','Arial')
  $("#framelock").text('Frame lock status').css('color','white').css('font-size','20').css('font-family','Arial')

  try {
    // try to create and initialize a 3D renderer
    threeD = new X.renderer3D();
    threeD.container = '3d';
    threeD.init();
  } catch (Exception) {
    
    // no webgl on this machine
    _webGLFriendly = false;
    
  }
  
  //
  // create the 2D renderers
  // .. for the X orientation
  sliceZ = new X.renderer2D();
  sliceZ.container = 'sliceZ';
  sliceZ.orientation = 'Z';
  sliceZ.init();
  
  
  //
  // THE VOLUME DATA
  //
  // create a X.volume
  volume = new X.volume();
  // .. and attach the single-file dicom in .NRRD format
  // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
  // formats like MGH/MGZ
  volume.file=$.cookie("fname");
  console.log(volume.file);
  
  // add the volume in the main renderer
  // we choose the sliceX here, since this should work also on
  // non-webGL-friendly devices like Safari on iOS
  sliceZ.add(volume);
  // start the loading/rendering
  sliceZ.render();
  sliceZ.onShowtime=function(){
  $('.noUiSlider').noUiSlider({

           range: [1,2*volume.indexZ-1]
          ,handles:1
          ,start: volume.indexZ
          ,connect: "lower"
        });
 $('#toggleLights').each(function(){ this.checked = false; });
// $('#toggleLights').each(function(){ this.checked = true; }); 


volume.windowLow = 0;
    volume.windowHigh = 400;
    maxZoomOut = 40;
    maxZoomIn = 40;
    zstep = 0.01;

    deltazoom = 3;
    zoomin = 0;
    zoomout = 0;

    maxPanX = 30;
    panleft = 0;
    panright = 0;

    panup = 0;
    pandown = 0;

    maxPanY = 30;
    panStep = 0.5;

    //define distance (mm) variables for zoom, panX and panY
    panX_d = 60;
    panY_d = 60;

    deltapan = panX_d / maxPanX; // = 4mm in this case...distance per pan step

    grey = 4;

    do_nothing = true;
    $('#toggleLights').each(function(){ this.checked = true; });
    firstinstance = true;

};

sliceZ.render()

// LEap code goes here...

  controller.on('frame', function(frame) {

    if (frame.valid) {

      framehistory = 60;
      lastFrame = controller.frame(framehistory);

      // the frame is valid and ready to be processed 

      /*
    1) Process the leap frame first during every browser animation frame
    2) identify status...w/wo pointables in the frame
    3) if #pointables == 0 but hands == 1...zoom and pan
    4) else circle gesture for contrast
    5) some other gesture for slices.
    */

      // if this is a gesture frame then do not process position data
      if (frame.gestures.length > 0) {

        //loop through all the gestures we see
        for (var i = 0; i < frame.gestures.length; i++) {

          var gesture = frame.gestures[0];
          //Per gesture code goes here

        }

        //  console.log(gesture);
        if ((frame.hands.length == 1) && (frame.pointables.length <= 5)) {
          // Switch to correct function call
          var type = gesture.type;
          switch (type) {

            case "keyTap":
              if (do_nothing == false) {
                do_nothing = true;
                //tempAlert("Frame Lock On ! ", 1000);
                $('#toggleLights').each(function(){ this.checked = true; });
                LeapManager.cursorManager.cursorContainer.setStyle({
                    zIndex: 1,
                    position: "fixed",
                    top: "0px",
                    left: "0px"
                });
                //LeapManager.init({maxCursors:1});
                //document.getElementById("leap-pointable-cursor").style.visibility="visible" ;
                
              } else {
                do_nothing = false;
                //tempAlert("Frame Lock Off ! ", 1000);
                $('#toggleLights').each(function(){ this.checked = false; });
                  LeapManager.cursorManager.cursorContainer.setStyle({
                      zIndex: -100,
                      position: "fixed",
                      top: "0px",
                      left: "0px"
                  });
                //LeapManager.init({maxCursors:0});
                  //$(document.LeapElement.getID()).css('visibility','hidden');
                //document.getElementById("leap-pointable-cursor").style.visibility="hidden";                
              }
              //console.log(do_nothing);
              break;

            case "circle":
              if (frame.pointables.length == 1) {
                if (do_nothing == false) {
                  onCircle(gesture);
                }
              }
              break;
              //case "swipe":
              //onSwipe(gesture);
              //break;

              //case "screenTap":
              // onScreenTap(gesture);
              //   break;


          }

        }
      }
      // if ONLY ONE open hand is visible and the previous frame was a valid frame
      // process the frame for scroll data
      else if ((frame.hands.length == 1) && (frame.pointables.length == 0) && lastFrame.valid && (do_nothing == false)) {

        // define variables for changing slices
        min_distance = 90; //(in mm)
        max_distance = 270; //(in mm)
        slicerange = volume.dimensions[2];
        console.log(slicerange);
        slice_incr = (max_distance - min_distance) / slicerange;

        var handPos = frame.hands[0].palmPosition;
        handPosX = handPos[0];
        handPosY = handPos[1];
        handPosZ = handPos[2];

        var current_distance = Math.sqrt((handPosX * handPosX) + (handPosY * handPosY) + (handPosZ * handPosZ));
        //console.log(current_distance);

        // compute the slice number form the current distance
        if ((current_distance > min_distance) && (current_distance < max_distance)) {

          slice_no = Math.floor((current_distance - min_distance) / slice_incr);
          //console.log(slice_no);
          volume.indexZ = slice_no;
          $('.noUiSlider').val(volume.indexZ);

        }

      }
      //The zoom and pan gesture is initiated when both hands are in front of the camera and are closed      
      else if ((frame.hands.length == 1) && (frame.pointables.length >= 3) && lastFrame.valid && (do_nothing == false)) {

        if (lastFrame.hands[0].valid) {

          rhPos = lastFrame.hands[0].palmPosition;
          // zoom and pan is controlled by the right hand
          rhPosZref = rhPos[2];

          rhPos = frame.hands[0].palmPosition;
          rhPosZ = rhPos[2];

          rhPosZ_change = rhPosZ - rhPosZref;

          // zoom in and out

          if (rhPosZ_change < 0 && Math.abs(rhPosZ_change) >= deltazoom && zoomin <= maxZoomIn) {
            sliceZ.camera.view[14] += zstep;
            zoomin += 1;
            zoomout -= 1;
            //console.log(zoomin);
          } else if (rhPosZ_change > 0 && Math.abs(rhPosZ_change) >= deltazoom && zoomout <= maxZoomOut) {
            sliceZ.camera.view[14] -= zstep;
            zoomout += 1;
            zoomin -= 1;
          }
          /*
        // pan left and right: panX
        if (rhPosX_change < 0 && Math.abs(rhPosX_change) >= deltapan && panright <= maxPanX) {
          sliceX.camera.view[12] -= panStep;
          panright += 1;
          panleft -= 1;

        } else if (rhPosX_change > 0 && Math.abs(rhPosX_change) >= deltapan && panleft <= maxPanX) {
          sliceX.camera.view[12] += panStep;
          panleft += 1;
          panright -= 1;

        }


        // pan up and down: panY
        if (rhPosY_change < 0 && Math.abs(rhPosY_change) >= deltapan && panup <= maxPanY) {
          sliceX.camera.view[13] -= panStep;
          panup += 1;
          pandown -= 1;
        } else if (rhPosY_change > 0 && Math.abs(rhPosY_change) >= deltapan && pandown <= maxPanX) {
          sliceX.camera.view[13] += panStep;
          pandown += 1;
          panup -= 1;

        }

       */
        }
      }

    }


  });

 
  function onCircle(gesture) {

    // Figure out the direction of the gesture
    var clockwiseness = -1;

    if (gesture.normal[2] <= 0) {

      clockwiseness = 1;
    }

    //Adjusting histogram 
    volume.windowHigh = volume.windowHigh + (clockwiseness * grey);
  }


  function tempAlert(msg, duration) {
    var el = document.createElement("div");
    el.setAttribute("style", "position:absolute;top:30%;left:10%;background-color:white;");
    el.innerHTML = msg;
    setTimeout(function() {
      el.parentNode.removeChild(el);
    }, duration);
    document.body.appendChild(el);
  }

  function onSwipe(gesture) {

    console.log("Swipe!")

  }



};


