


var keyBoxPos = $(".timeline-animation").position();
var keyBoxDim = $(".timeline-animation").width();
var timeBarKeyframe; // for use gathering timeline position offsets when dragging selected bar

$('#playBack').click(function(){
  playBack(); 
  
});

$( ".timeline-marker" ).draggable({ 
  //helper: "clone" 
  axis : "x",
  containment : "parent",
  drag: function() {
    setMarkerTime();
    setMarkerTimeDisplay();
    setCurrentFrameProperties();
  },
  stop: function() {	
    setMarkerTime();
    setCurrentFrameProperties();
    setCurrentFrameProperties();
  }
});

//
function setMarkerTime()
{
  var timeAll = $('#timeline-time').val();
  var timeWidth = $('.timeline-animation-marker').width();
  var timelineMarker = Math.round($('.timeline-marker').position().left);
  var fullTime = timelineMarker / timeWidth * timeAll;
  var seconds = Math.floor(fullTime) < 10 ? "0"+Math.floor(fullTime) : Math.floor(fullTime);
  var decimalTime = Math.round(((fullTime- Math.floor(fullTime))*30)) < 10 ? "0"+Math.round(((fullTime- Math.floor(fullTime))*30)) : Math.round(((fullTime- Math.floor(fullTime))*30));
  $('.marker-time').html(seconds + ":" + decimalTime)
}

//
function setMarkerTimeDisplay()
{
  var timeWidth = $('.timeline-animation-marker').width();
  var timelineMarker = $('.timeline-marker').position().left;
  var mark = $('.marker-time');
  if(timeWidth-timelineMarker < 40)
  {
    mark.addClass('left')
  }else if(mark.hasClass('left')){
    mark.removeClass('left')
  }
  $('#timeline-fullmarker').css('height', $('.timeline-animation-element').length*23+"px")

}

//
$('#timeline-time').keyup(function(e)
{
    if (/\D/g.test(this.value))
    {
        // Filter non-digits from input value.
        this.value = this.value.replace(/[^0-9.]/, '');
    }
    setMarkerTime();
    createTimelineTicks();
});

// Dragging a single keyframe
$( ".icon-keyframe" ).draggable({
      axis:"x",
      containment: [keyBoxPos.left+2, 0, keyBoxDim+keyBoxPos.left-20, 23],
      start: function() {
		},
		drag: function() {
       setLayerSelection($(this))
			trackKeyDrag($(this), true);
		},
    stop: function() {	
      setLayerSelection($(this))
      trackKeyDrag($(this), false);
  }
});

// Adding dragging to the layer bar
$( ".timeline-animation-element" ).draggable({
    axis:"x",
    containment: 'parent',
    drag: function() {
      setLayerSelection($(this))
      trackBarDrag($(this), true);
    },
    start: function() {
       timeBarKeyframe = getRelativeKeyframesPositionX($(this));
    },
    stop: function() {	
      setLayerSelection($(this))
      trackBarDrag($(this), false);
    }
});

// Dragging the layer Bar
function trackBarDrag(obj, start)
{
   switch(start)
  {
    case true:
      timelineKeyframeObject(obj, obj.position().left); 
      setCurrentFrameProperties()
    break;
    case false:
      timelineKeyframeObject(obj, obj.position().left); 
      setCurrentFrameProperties()
    break;
  }
};

// Dragging a Keyframe
function trackKeyDrag(obj, start)
{  
  switch(start)
  {
    case true:
      setTimelineKeyframeObject(obj);
      setCurrentFrameProperties()
    break;
    case false:
      setTimelineKeyframeObject(obj);
      setCurrentFrameProperties()
    break;
  }
}

// Position the keyframes while dragging the bar
function timelineKeyframeObject(obj, originalX)
{
  var count = 0;
  obj.parent().children(".icon-keyframe").each(function()
  {
    $(this).css('left', originalX+timeBarKeyframe[count])
    count ++;
  });
};

function setTimelineKeyframeObject(obj)
{
  var par = obj.parent();
  var keys = obj.siblings(".icon-keyframe").length;
  var l=99999999999, r=0;
  for(var f = 0; f < keys+1; f ++)
  {
    var tmp = obj.parent().children(".icon-keyframe:eq(" + f + ")").position().left;
    l = tmp < l ? tmp : l;
    r = tmp > r ? tmp : r;
  }
    par.children('.timeline-animation-element').css({
      left:l,
      width:r-l+18
  });
};

// PLAY BACK
function playBack()
{
  // 
  $('#timeline-time').attr("disabled",'disabled');
  $('#playBack').attr("disabled",'disabled');
  
  // check time
  var nIntervId;
  var count = 1;
  var timeAll = $('#timeline-time').val();
  var timelineMarker = Math.round($('.timeline-marker').position().left);
  
  $('.timeline-marker').css('left', 0)
  setMarkerTime();
  setMarkerTimeDisplay()
  createPlayback();
  createNewStylesheet(createAnimationCSS());
  
  function createPlayback() {
    nIntervId = setInterval(moveMarker, 33.3333333);
  }
 
  function moveMarker() {
    var killit = count >= timeAll*30 ? stopPlayback() : "";
    // 90 frames = 3 seconds
    // 1000 millisec = 33.3333 per frame
    var posCount = 100/($('#timeline-time').val()*30) * count;
    $('.timeline-marker').css('left', posCount + "%");
    setMarkerTime();
    setMarkerTimeDisplay();
    count ++
  }
  function stopPlayback() {
    $('#playBack').attr("disabled", false);
    $('#timeline-time').attr("disabled",false);
    $('.timeline-object').each(function()
    {
      var tmpName = $(this).attr('id').replace('t-',''); 
      $("#"+tmpName).removeClass('a-'+tmpName+'');
    });
    setCurrentFrameProperties()
    clearInterval(nIntervId);
  }
  
  $('.timeline-object').each(function()
  {
    var tmpName = $(this).attr('id').replace('t-',''); 
    $("#"+tmpName).attr('style',"").addClass('a-'+tmpName+'');
  });
}

function setCurrentFrameProperties()
{
  var count = 1;
  var timeAll = $('#timeline-time').val();
  // playhead at the time
  var currentTime = ($('.timeline-marker').position().left / keyBoxDim * 100);

  $('.timeline-object').each(function(){  //$('.timeline-animation-element')
    var arr = getKeyframesPercentageX($(this).children('.timeline-animation').children('.timeline-animation-element'));
    var tmpName = "#" + $(this).attr('id').replace('t-',''); 
    var base = arr[0];
    for(var i =0; i < arr.length; i++)
    {
      var ave = (currentTime-base)/(arr[i]-base);
      if(currentTime >= base && currentTime < arr[i])
      {
        $(tmpName).attr('style', '').css({
          width:(50+50*ave)+'px',
          height:(50+50*ave)+'px'
        })
      }else if(currentTime > arr[i]){
        $(tmpName).attr('style', '').css({
          width:'100px',
          height:'100px'
        })
      }else{
        $(tmpName).attr('style', '');
      }
      base = arr[i];
      //$('p').append("B: "+arr + "<br>") 
    }
    //$('p').append("C: "+arr + "<br>") 
  });
}


// Get the offset of all keyframes relative to their bar for use in dragging the bar
function getRelativeKeyframesPositionX(obj)
{
  var arr = [];
  var parX = obj.parent().children(".timeline-animation-element").position().left;
  
  obj.parent().children(".icon-keyframe").each(function()
  {
    var posX = $(this).position().left*1;
    arr.push(posX - parX);
  });
  return arr;
}

// Get the position of all keyframes
function getKeyframesPositionX(obj)
{
  var arr = [];  
  obj.parent().children(".icon-keyframe").each(function()
  {
    var posX = $(this).position().left*1;
    arr.push(posX);
  });
  return arr;
}

// Get the percentage of all keyframes
function getKeyframesPercentageX(obj)
{
  var arr = [];  
  obj.parent().children(".icon-keyframe").each(function()
  {
    var posX = Math.round($(this).position().left/$(this).parent().width()*100);
    arr.push(posX);
  });
  arr.sort(function(a,b) { return a - b; });
  return arr;
}

// The Rulah
function createTimelineTicks() {
  var svgitem = "";
  var frame = 0;
  var timeAll = $('#timeline-time').val();
  var timeWidth = $('.timeline-animation-marker').width();
  var timelineMarker = Math.round($('.timeline-marker').position().left);
  var fullTime = timelineMarker / timeWidth * timeAll;
  var tickNumber = timeAll * 30;
  
  if(timeAll < 10)
  {
    tickNumber = timeAll * 30;
  }else if(timeAll < 20 )
  {
    tickNumber = timeAll * 15;
  }else if(timeAll < 30 )
  {
    tickNumber = timeAll * 2;
  }else{
    tickNumber = timeAll * 5;
  }
  for (var x = 0; x < tickNumber; x ++)
  {
    var p = Math.round(keyBoxDim/tickNumber*x);
    frame ++;
    var h = frame % 20 == 1 ? 0 : 12;
    var currentTime = x/tickNumber*timeAll;
    var seconds = Math.floor(currentTime) < 10 ? "0"+Math.floor(currentTime) : Math.floor(currentTime);
    var decimalTime = Math.round(((fullTime- Math.floor(fullTime))*30)) < 10 ? "0"+Math.round(((fullTime- Math.floor(fullTime))*30)) : Math.round(((fullTime- Math.floor(fullTime))*30));
    
    svgitem += "<polyline fill='rgba(255, 255, 255, 0.08)' points='"+(p)+",22 "+(p+1)+",22 "+(p+1)+","+h+" "+(p)+","+h+" '/>";
    svgitem += frame % 60 == 1 ? '<text x="'+(p+3)+'" y="10" fill="rgba(255, 255, 255, 0.15)">'+seconds+":"+ decimalTime + '</text>' : "";
    
    frame++;
  }
  $('#timeline-ruler').html( svgitem );
}

// Set the selected layer with the 'selected' class
function setLayerSelection(obj)
{
  $(".icon-keyframe").each(function() { 
    if($(this).parent().parent().index() === obj.parent().parent().index())
    {
      $(this).parent().parent().addClass('selected');
    }else{
      $(this).parent().parent().removeClass('selected');
    }
  });
}

// Create new animation css with time and properties for a layer
function createAnimationCSS()
{
     $('p').html("")
  // set overall time
  var timeAll = $('#timeline-time').val()*1000;
  var txtCSS = '';
  $('.timeline-animation-element').each(function(){
    var idname = $(this).parent().parent().attr('id');
    var idname = $(this).parent().parent().attr('id').replace('t-', 'a-');
    var tmp = getKeyframesPercentageX($(this));
    var delayed = tmp[0]/100*timeAll;
    
    txtCSS += '.'+idname+'{-webkit-animation: '+idname+'-cycle '+(timeAll)+'ms '+';}\r';
    txtCSS += '@-webkit-keyframes '+idname+'-cycle {\r';
    
    txtCSS += tmp[0] > 0 ? '0% {  height: "50px";width: "50px";}\r' : "";
    for(var i =0; i < tmp.length; i++)
    {
      var first = i == 0 ? "50" : "100";
      txtCSS += "  "+tmp[i]+'%';
      txtCSS += '{  height: '+first+'px;width: '+first+'px;}\r';
    }
    txtCSS += tmp[tmp.length-1] < 100 ? '100% {  height: 100px;width: 100px;}\r' : "";
    txtCSS += '}';
     //$('p').append("<br>" + tmp)
  });
  //$('p').append("<hr>" + txtCSS)
   return txtCSS;
}

function createNewStylesheet(data){
  if(document.getElementById ('animationStyles')){
    var node = document.getElementById("animationStyles");
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  //document.getElementsByTagName('head')[0].removeChild('animationStyles');
  var style = document.createElement('style');
  style.type = 'text/css';
  style.id = "animationStyles";
  style.innerHTML = data;
  document.getElementsByTagName('head')[0].appendChild(style);
}
/*
//example animation css:
-webkit-animation: cycle 1000ms;

@-webkit-keyframes cycle {
   0% {fill: cyan;}
  25% {fill: magenta;} 
  75% {fill: yellow;} 
  100% {fill: cyan;} 
}
*/

// BASE SETUP: create the ruler, set random keyframes to show what the hell happens

$(".icon-keyframe").each(function() {
  $(this).click(function(){
    setLayerSelection($(this))
  });
 $(this).siblings('.timeline-animation-element').click(function(){
   setLayerSelection($(this));
 });
  var max = $(this).parent().width()-23;
  var min = 0;
  $(this).css('left',( Math.random() * (max - min) + min));
  setTimelineKeyframeObject($(this));
});

createTimelineTicks();
setMarkerTime();
setMarkerTimeDisplay()
setCurrentFrameProperties();
 /*var data  = [
   {
       "object": "object A", 
       "label": "Object A", 
       "type": "box",
       "keyframes" : 
         { 
           "time":0,
           "height": 500,
           "top": 100
         },
         { 
           "time":1000,
           "height": 200,
           "top": 0
         }
       }
     }   
 ];*/