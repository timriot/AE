$(function() {
  var txtVal;
  var txtMin;
  var txtMax;
    var fontVal;
    
    var panelWidth;
    
    $('#colorIndicatorFill').colpick({
        layout:'hex',
        submit:0,
        colorScheme:'dark',
        onChange:function(hsb,hex,rgb,el,bySetColor) {
            $(el).css('background-color','#'+hex);
            // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
            if(!bySetColor) $(el).val(hex);
        }
    }).keyup(function(){
        $(this).colpickSetColor(this.value);
    });
    
    $('#colorIndicatorStroke').colpick({
        layout:'hex',
        submit:0,
        colorScheme:'dark',
        onChange:function(hsb,hex,rgb,el,bySetColor) {
            $(el).css('background-color','#'+hex);
            // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
            if(!bySetColor) $(el).val(hex);
        }
    }).keyup(function(){
        $(this).colpickSetColor(this.value);
    });
    

    
	$("#scale-slider").change(function() {
    txtVal = $("#scale-slider").val()+"px";
    fontVal = $("#scale-slider").val() * .5;
    panelWidth =  $("#scale-slider").val() * 10; 
        
        
    $("ul#a li img").width(txtVal);

    $("input#scale-text").val(txtVal);
    $("input#scale-font").val(fontVal); 
        
    $("#triple").html("Triple Down: " + $("#triple").css('font-size'));   
    $("#double").html("Double Down: " + $("#double").css('font-size'));   
    $("#innovate").html("Innovate: " + $("#innovate").css('font-size'));              
        
    $("html").css('font-size', fontVal);        

	});
    
    
  $("#alpha").change(function() {
    txtVal = $("#scale-text").val();
  });

    
    
      $("#right_panel_slider").change(function() {
            $("#rightside").width($("#right_panel_slider").val());     
  });
    

    $("#vis").click(function() {
        $("#vis").addClass("dimmer");
    });
    
});



