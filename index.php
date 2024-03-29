<!-- 
/*
 * 
 *                  xxxxxxx      xxxxxxx
 *                   x:::::x    x:::::x 
 *                    x:::::x  x:::::x  
 *                     x:::::xx:::::x   
 *                      x::::::::::x    
 *                       x::::::::x     
 *                       x::::::::x     
 *                      x::::::::::x    
 *                     x:::::xx:::::x   
 *                    x:::::x  x:::::x  
 *                   x:::::x    x:::::x 
 *              THE xxxxxxx      xxxxxxx TOOLKIT
 *                    
 *                  http://www.goXTK.com
 *                   
 * Copyright (c) 2012 The X Toolkit Developers <dev@goXTK.com>
 *                   
 *    The X Toolkit (XTK) is licensed under the MIT License:
 *      http://www.opensource.org/licenses/mit-license.php
 *
 * LESSON 13 - I want 2D!
 */
-->

<html>
<head>
<title>MotionView demo</title>	

<script type="text/javascript" src="leap-manager.js"></script>
<script type="text/javascript" src="leap.min.js"></script>

<link rel="stylesheet" type="text/css" href="css/dark-glass/sidebar.css" /> 
<script src="js/jquery-1.10.2.js"></script>
<script src="js/jquery-ui-1.10.4.custom.js"></script>
<script type="text/javascript" src="js/xtk_edge.js"></script>

<script type="text/javascript" src="jquery.sidebar.js"></script>
<script type="text/javascript" src="jquery.cookie.js"></script>
<script type="text/javascript" src="jquery.nouislider.js"></script>
<link rel="stylesheet" type="text/css" href="switch.css"/>
<script type="text/javascript" src="demo.js"></script>

<link rel="stylesheet" type="text/css" href="demo.css">
<link rel="stylesheet" href="toggle-switch.css">
<link href="jquery.nouislider.css" rel="stylesheet">
<link href="jquery.toggleslider.css" rel="stylesheet">

<link rel="stylesheet" type="text/css" href="css/leap-manager.css">

<style type="text/css">
        .button {
            color:white;
            display:inline-block;
            background-color: #000000;
            transition-duration: 1s;
        }

        .button.hover {
            background-color: #000000;
        }

        ul {
            padding: 0px;
           }
    </style>


</head>

<body>

<div id="blacklogo" >
<img src="logo.jpg" width="80%" height="80%">
</div>
<ul id="menu" >

      <li><a href="#" class="button leap-interactive" onClick="t1_press()"><img src="./thumbnails/th1x.jpg" alt="" title="T1" width="60%" height="22%"/> T1 <br/> &nbsp;</a></li>
      <li><a href="#" class="button leap-interactive" onClick="t2_press()"><img src="./thumbnails/th2x.jpg" alt="" title="T2" width="60%" height="22%" />T2<br/> &nbsp;</a></li> 
      <li><a href="#" class="button leap-interactive" onClick="st_press()"><img src="./thumbnails/th3x.jpg" alt="" title="SD" width="60%" height="22%" />FL<br/>&nbsp;</a></li>
      <li><a href="#" class="button leap-interactive" onClick="td_press()"> <img src="./thumbnails/th4x.jpg" alt="" title="FL" width="60%" height="22%" />T1SE<br/> &nbsp;</a></li>

</ul>

<ul id="consents_menu" >
      <li><a href="index.php" class="button leap-interactive"><img src="./thumbnails/pdf1.jpg" alt="" title="Consent Form 1" width="600px" height="90%"/><br/> &nbsp;</a></li>
</ul>

<!-- the container for the renderers -->
<!--<div id="3d"
  style="background-color: #000; width: 100%; height: 70%; margin-bottom: 2px;"></div>-->
<!-- <div id="pid"
  style="border-top: 2px #000; background-color: #333333; width: 100%; height: 5%; float: left; ">
  <font size="3" color="white">Patient XYZ</font><br/><font size="3" color="white">DOB xx/xx/xxxx</font>
</div>  -->




<div id="outer">
<div id="inner">
	<ul id="bar">
		<li id="patient_info" style="float:left"> John Doe <br/> 9/25/1946</li>
		<li id="series_type"></li>
		<li id="indicator" style="float:right">  
				<div class="switch-wrap" >
					<input id="toggleLights" type="checkbox" />
					<label for="toggleLights" class="switch">
						<div class="slide-wrap">
							<div class="slide">
								<div class="slider"></div>
							</div>
						</div>
					</label>
					<!--font color="white">Frame lock status</font-->

			  </div>


		</li>	  

	</ul>
</div>

  <div id="bar-inner" class="noUiSlider" ></div>

</div>

<script type="text/javascript">
        var buttons = document.querySelectorAll("div.button");
        var output  = document.querySelector("div.output");
        var count   = 0;

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function(e){
                output.innerHTML += count ;
                count++;
            });
        };

        LeapManager.init({
            maxCursors:1                                 
         });
    </script>  

<script type="text/javascript">
    var controller = new Leap.Controller();

controller.on('connect', function() {
  console.log("Successfully connected.");
});

controller.connect();

    </script>



<div id="sliceZ"
  style="border-top: 2px #000; background-color: #000; width: 100%; height: 100%; float: left;">

</div>

  <script type="text/javascript">
$("ul#consents_menu").sidebar({
            position:"right"
        });
$("ul#menu").sidebar({
            position:"left"
        });
</script>     





</body>
</html>