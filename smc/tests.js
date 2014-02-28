
var testRT = function(json) {
 var inJ = JSON.stringify(json)
 
 var out = PS.roundTrip(json)
 var outJ = JSON.stringify(out)
 
 if(inJ != outJ) {
     console.log(inJ, "!=", outJ)
     PS.log(inJ + " != " + outJ)
 }
    
}


testRT({null:{ref:["capp", "capp"]}})
testRT({})
testRT({"foo":"bar"})  
testRT({"null":{obj:"foo"}})  
//testRT({"null":{}})  
testRT({null:{ref:"capp"}})
