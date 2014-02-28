

onPSEvent = function(command,params) {
 
    var fn = eventHandlers[command]
    if(fn) fn(params)
//    console.log(command)
//    console.log(command,params)
    
}

eventHandlers = {
 slct:  function(params) {

    var target = params.null
     var ref = target.ref

     if(ref == "Lyr ") {
        console.log("selected layer", params.null.name)
        return;
     } 
     
     var brush = Commands.getBrush()
     
     if(brush.Tool.enumType == ref) {
      console.log("selected tool", ref, brush.CrnT);   
      return;
     }
  
     
//    console.log(JSON.stringify(params,null," "))
 }
    
    
    
}


/*
if(!PS) {
    PS = {}
    PS.call = function() {}
    PS.log = function(txt) { console.log(txt);}
    PS.get = function() { return {msg:"PS not connected"}};
    PS.simpleGet = PS.get;
}
*/

try {PS.log("we have been called!");} catch(e) {console.log("PS not available yet")}


try { Wacom.active = true; console.log(Wacom.device); } catch (e) { console.log("no wacom", e)}

attachedDevice = function(device) {
    console.log(device)

    var state = PS.state || {}
    state.latest = device;
    PS.state = state
    
    window.currentWacom = device

    
}

//origin = {x:0,y:0}
// screen = {x:0, y:0, wd:0, ht:0}   

//screenBounds = function(x,y,wd,ht) {
// screen = {x:x, y:y, wd:wd, ht:ht}   
//// console.log("screen", JSON.stringify(screen))
//}

deviceAdded = function() { alert("device added") }


document.addEventListener("touchBegin", function(e) {
    console.log(e)
})

onPacket = function(touches) {
    touches.forEach(function(touch) {
        var event = new CustomEvent(touch.state, {detail: touch})
        var x = touch.x
        var y = touch.y// - origin.y
        var target = document.elementFromPoint(x,y)

//        event.initEvent(touch.state, true,true,window
//                             ,0,0,0,x,y)
        target.dispatchEvent(event);
        
    if(touch.state == "touchBegin")
                 console.log(target)
   
        
        // manually dispatch clicks
        if(touch.state == "touchEnd") {
            var event = new MouseEvent()
             event.initMouseEvent('click', true,true,window
                                 ,0,0,0,x,y)
            target.dispatchEvent(event);
        }
    })
}

var makeMapWithFn = function(arr,fn) {
    var rval = {}
    forEach(arr,function(elt) {
        console.log("'",elt,"'")
     rval[fn(elt)] = elt    
    })
    return rval
}

var forEach = function(arrayLike,fn) {
    for(var i = 0; i < arrayLike.length; i++)
        fn(arrayLike[i],i,arrayLike)
}

var filter = function(arrayLike,fn) {
    var rval = []
    for(var i = 0; i < arrayLike.length; i++) {
        var elt = arrayLike[i];
        if(fn(elt,i,arrayLike))
            rval.push(elt)
            }
    return rval
}

var map = function(arrayLike,fn) {
    var rval = []
    for(var i = 0; i < arrayLike.length; i++) {
        var elt = arrayLike[i];
        rval.push(fn(elt,i,arrayLike))
    }
    return rval
}

var getExtension = function(str) {
    console.log(str)
    return str.substring(str.lastIndexOf('.')+1)   
}
var allExtensions = function(arr) {

    return makeMapWithFn(arr, getExtension)  
}

var imgtypes = {png:1, svg:1, jpg:1}
var isImagePath = function(path) {
    return getExtension(path) in imgtypes 
}
var isCSSLink = function(link) { return link.rel === "stylesheet"}

onFilesChanged = function(arr) {
    console.log("!!!")
    console.log(arr.length, "filesChanged")
    var types = allExtensions(arr)
   console.log(types)
   if(types.js) {
        console.log("js changed. time to reload")
        location.reload();  
        console.log("do we still get called?")
        console.log("yes, yes we do")
   } else if (types.png || types.svg || types.jpg) {
       console.log("image changed")
       reloadImages(arr.filter(isImagePath))
   } else if (types.css) {
       reloadCSS(arr)
   } else if (types.html) {
      location.reload()
   }
}

//var keyFromUrl = function(url) {
// for(var key in url) {
//     console.log("url",url)
//    return key
// }
//}


var stripMunge = function(str) {
 var idx = str.indexOf('?')
 return idx == -1 ? str : str.substring(0,idx) + ')'
}
var mungeCounter = 0
var mungeUrl = function(str) {
    mungeCounter++
    return str.substring(0,str.length-1) + '?'+mungeCounter+ ')';
     
}

var reloadImages = function (arr) {
    console.log("input",arr)
    var urlMap = makeMapWithFn(arr, function(elt) { return "url(file://"+elt+")"})
    console.log(urlMap)

    
    
//    forEach(document.styleSheets,function(sheet) {
//        forEach(sheet.cssRules, function(rule){
//            var img = rule.style.backgroundImage
//            if(img.lenth > 0)
//                console.log(rule)
//        })
//    })

  //  console.log(document.all.length)
    forEach(document.all, function(elt) {
 //       console.log(elt.tagName, elt.style)
//        var img = keyFromUrl(elt.style.backgroundImage)
      var img = elt.style.backgroundImage + ""
      if(img.length == 0) img = window.getComputedStyle(elt).backgroundImage + ""
      if(img.length == 0 || img == "none")
          return
        
          
        img = stripMunge(img)
          console.log(img)
        
        if(img in urlMap) {
    //    if(urls.indexOf(img) != -1) {
            console.log("found it")
            // elt.style.setProperty("backgroundImage",)
            elt.style.backgroundImage  = mungeUrl(img)  
            console.log("ELT",elt)
            console.log("STYLE",elt.style)
            console.log("CSS",elt.style.cssText)
            console.log(" elt.style.backgroundImage  = '"+newImage+"'")
          //  elt.style.cssText = "backgroundImage:"+ newImage + ';'
            console.log(elt.style.backgroundImage)
        }
    })
    
//    reloadCSS(arr)   // cheap but slow -- should just run through and update the styles
}

reloadCSS = function(arr) {
    location.reload()
//    var links = document.getElementsByTagName("link")
//    var cssLinks = filter(links,isCSSLink)
//    var log = console.log
//    var cb = function(link) { 
//        console.log(link)
//        var temp = link.href
//        link.href = ""
//        link.href = temp + "?"
//    }
//    console.log(links)
//    forEach(cssLinks,cb)
}

Commands = {
    
    getCurrent: function(className) {
        return PS.get(C.target(className))
    },
    crop: function(x,y,wd,ht,leaveOpen,unit,angle) {
   
        if(typeof x == 'undefined') 
        {
         PS.call("Crop")
         return
        }
        
        angle = angle || 0    
    unit = unit || "#Pxl"    
    var args = {
         "CnsP" : 0,
  "Angl" : {
    "value" : angle,
    "unit" : "#Ang"
  },
  "cropAspectRatioModeKey" : {
    "value" : "pureAspectRatio",
    "enumType" : "cropAspectRatioModeClass"
  },
  "T   " : {
    "obj" : "Rctn",
    "Left" : {
      "value" : x,
      "unit" : unit
    },
    "Top " : {
      "value" : y,
      "unit" : unit
    },
    "Btom" : {
      "value" : wd,
      "unit" : unit
    },
    "Rght" : {
      "value" : ht,
      "unit" : unit
    }
  },
  "Dlt " : 1
    }
        
    if(leaveOpen) 
        PS.call("Crop",args,"always")
    else 
        PS.call("Crop",args)
    },
   getBrush: function() {return Commands.getTool()},
   getTool: function() { return PS.get([{ref:"capp",value:"Trgt",enumType:"Ordn"}, {ref:'Prpr', property:"_tool"}])},
   setTool: function(toolName,options,forceNotify) {
     PS.call("slct",{"null":{ref:toolName}, forceNotify:forceNotify})

     if(options) { 
         options.obj = options.obj || "null"
         PS.call("setd", { "null": {ref:toolName}, to:options})
     }
   },
    selectTool: function(name,options,forceNotify) { 
        console.warn("Commands.selectTool is deprecated. please use Commands.setTool instead")
        Commands.setTool(name,options,forceNotify)
    }
}

Commands.Noun = {
layerCount:"NmbL"
}

Commands.Verbs = {
    select: "slct",
    make: "MK  "
}

var Inner = {
}

Inner.CallSimple = function(verb,noun) {
    PS.call(verb,{"null":{ref:noun}})
}


Commands.magicWand = function(mode,radius,tolerance,aa,contig,allLayers) {
    Commands.setToolWithOptions("magicWandTool",       
                            {"WndT":tolerance,"WndA":aa,"Cntg":contig,"Slct":mode,"WndS":allLayers,"EyDr":radius || 0})
}
var auxLasso = function(tool,mode,feather,aa) {
    
//{"CrnT":{"Slct":0,"Cntg":1,"obj":"CrnT","DrwR":{"value":0,"unit":"#Pxl"},"DrwA":1},"Tool":{"value":"Trgt","enumType":"lassoTool"}}
   
    var args = {Slct: mode || 0, 
                DrwA : aa || false}
    if(feather && feather > 0) {
     args.DrwR = Unit.px(feather)   
    }
    Commands.setToolWithOptions(tool, args)
}

Commands.polyLasso = function(mode,feather,aa) { auxLasso("polySelTool",mode,feather,aa) }
Commands.lasso = function(mode,feather,aa) { auxLasso("lassoTool",mode,feather,aa) }


Commands.moveTool = function (opts) {
    opts = opts || {}
    Commands.selectTool("moveTool",  {
            ASGr: opts.groups || 0,
            Abbx: opts.transform || 0,
            AtSl: opts.autoSelect || 0
    })
}

C = {
 setd:function(lhs, rhs) {
    PS.call('setd', {"null":lhs, to:rhs})   
 },
    
   target: function(className) { 
    return {ref:className, enumType:"Ordn", value:"Trgt"}   
}
}


Commands.make = function(noun) {
    Inner.CallSimple("Mk  ",noun);
}

Commands.makeLayer = function() {
    Commands.make("Lyr ");
}

Commands.layerCount = function (docID) {
    var ref = {  property:"NmbL",
                  id:{ "Dcmn":docID}
    }
    var result = get(ref);
    
    PS.log(JSON.stringify(result));
}

Commands.selectLayer = function(name) {
    try {
    PS.call("slct",
            {
                "MkVs":0,
                "null":{ name :name, ref:"Lyr "}
            });
    } catch (e) {
        PS.log('select layer '+ e);
    }
}
Commands.hasLayer = function(name) {
  var l = PS.get({ref:'Lyr ', name:name})
  return typeof l == "object";
}

Commands.renameLayer = function(name) {
PS.call('setd',{
  "T   " : {
    "obj" : "Lyr ",
    "Nm  " : name
  },
  "null" : {
    "ref" : "Lyr ",
    "value" : "Trgt",
    "enumType" : "Ordn"
  }
})
}


Commands.selectFrontLayer = function () {
    PS.call('slct',{
  "MkVs" : 0,
  "null" : {ref:"Lyr ",
                        value:"Frnt",
                        enumType:"Ordn"}
})
}

Commands.selectBackLayer = function () {
    PS.call('slct',{
  "MkVs" : 0,
  "null" : {ref:"Lyr ",
                        value:"Back",
                        enumType:"Ordn"}
})
}
Commands.moveFrontLayerToBack = function () {
    Commands.selectFrontLayer();
    Commands.moveSelectedLayerToBack();
}

Commands.moveBackLayerToFront = function () {
    Commands.selectBackLayer();
    Commands.moveSelectedLayerToFront();
}
Commands.moveSelectedLayerToFront = function () {
    PS.call("move",{"null":{ref:"Lyr ",
                            value:"Trgt",
                            enumType:"Ordn"},
                    to:{ref:"Lyr ",
                        value:"front",
                        enumType:"Ordn"}
                   }
           ); 
}

Commands.moveSelectedLayerToBack = function () {
    PS.call("move",{"null":{ref:"Lyr ",
                            value:"Trgt",
                            enumType:"Ordn"},
                    to:{ref:"Lyr ",
                        value:"Back",
                        enumType:"Ordn"}
                   }
           ); 
}


Commands.moveNamedLayerToFront = function (name) {
    
    PS.call("move",{ 'null':{ref:"Lyr ",name:name}, 
                    to:{ref:"Lyr ",value:"front",enumType:"Ordn"}
                   }); 
}


Unit = {

 px: function(val) { return {unit:"#Pxl", value:val} },
 percent: function(val) { return {unit:"#Prc", value:val} },
 angle: function(val) { return {unit:"#Ang", value:val} }
}




Commands.setBrush = function (diam, hard, angle,round,spacing) {
    
    PS.call("setd", {"null": C.target("Brsh"), 
                     to: {
                         obj:"computedBrush",
                         Dmtr:Unit.px(diam), 
                         Hrdn:Unit.percent(hard || 100), 
                         Angl:Unit.angle(angle || 0),
                         Rndn:Unit.percent(round || 100),
                         Spcn:Unit.percent(spacing || 1)
                        } })
    
}


Commands.moveSelectedLayerTo = function (idx) {
    
PS.call("move",
  {
    "Vrsn" : 5,
    "Adjs" : 0,
    "T   " : {
      "ref" : "Lyr ",
      "index" : idx
    },
    "null" : {
      "ref" : "Lyr ",
      "value" : "Trgt",
      "enumType" : "Ordn"
    }
  }
)
}

Commands.bluePencil = function() {
    try {
    Commands.selectTool("PbTl");
    if(Commands.hasLayer("blue pencil")) {
        Commands.selectLayer("blue pencil");
    } else {
      Commands.makeLayer();
      Commands.renameLayer("blue pencil");
    }
    Commands.moveSelectedLayerToFront();
        
    Commands.setBrush(2)
    Commands.setForegroundColor(65,179,225);
    } catch (e) {
        PS.log(e+'');
    }
    
}

Commands.redPencil = function() {
    try {
    Commands.selectTool("PbTl");
    if(Commands.hasLayer("red pencil")) {
        Commands.selectLayer("red pencil");
    } else {
      Commands.makeLayer();
      Commands.renameLayer("red pencil");
    }
    Commands.moveSelectedLayerToFront();

    Commands.setBrush(15)
    Commands.setForegroundColor(200,0,0);
    } catch (e) {
        PS.log(e+'');
    }
    
}

Commands.setVisSets = function(classic, notClassic) {
    try {
    PS.log(classic ? "going classic" : "going custom");

    Owl.tools = Owl.controls = Owl.tabs = classic;
    } catch (e) {}
    Commands.setVisibility("tools",notClassic);
    Commands.setVisibility("properties",notClassic);
//    Commands.setVisibility("goClassic",notClassic);
//    Commands.setVisibility("goCustom",classic);
}

Commands.setClassic = function(classic) {
    Commands.setVisSets(classic,!classic)
    document.getElementById("toggle").className = classic ? "classic" : "custom"
    document.body.className = classic ? "classic" : "custom"
}


Commands.showBoth = function() {
    Commands.setVisSets(true,true)
    document.getElementById("toggle").className = "dev"
    document.body.className = "dev"

}

Commands.toggleIconMess = function() {
    var className = document.getElementById("lotsoftools").className;
    
    if(className == "hidden") className = "showing";
    else className = "hidden"
    
    
    document.getElementById("lotsoftools").className = className;
    
}


Commands.setVisibility = function(id,show) {
    var elt = document.getElementById(id)
    if(elt)
        elt.style.visibility = show?"inherit":"hidden";
}

Commands.getForegroundColor = function() {
 try {
 //   var json = PS.query({ref:'FrgC', enumType:"Ordn", value:'Trgt', property:'capp'})
    var json = PS.get({ref:'capp', enumType:"Ordn", value:'Trgt', property:'FrgC'})
    PS.log(JSON.stringify(json,null,'\t'));
 } catch (e) {
    PS.log(e+'')   
 }
}

Commands.makeFillLayer = function(r,g,b) {

    if(arguments.length == 0) return Commands.makeFillLayer(255,255,255);
    else if(arguments.length == 1) return Commands.makeFillLayer(r >> 16, (r >> 8) & 255, r & 255);
    
 PS.call('Mk  ',{
  "Usng" : {
    "obj" : "contentLayer",
    "Type" : {
      "obj" : "solidColorLayer",
      "Clr " : {
        "Grn " : g,
        "Rd  " : r,
        "obj" : "RGBC",
        "Bl  " : b
      }
    }
  },
  "null" : {
    "ref" : "contentLayer"
  }
})
   
}


Commands.advanceSlideshow= function() {
    Commands.moveFrontLayerToBack();
    Commands.moveFrontLayerToBack();
}

Commands.backupSlideshow= function() {
    Commands.moveBackLayerToFront();
    Commands.moveBackLayerToFront();
}

Commands.getDocID = function(idx) {
 try {
    var json = PS.query({ref:'Dcmn', index:idx, property:'DocI'})
    PS.log(JSON.stringify(json,null,'\t'));
 } catch (e) {
    PS.log(e+'')   
 }
     
}

Commands.getDocCount = function(idx) {
 try {
    var json = PS.get({ref:'capp',  property:'NmbD'})
    PS.log(JSON.stringify(json,null,'\t'));
 } catch (e) {
    PS.log(e+'')   
 }
     
}
Commands.setForegroundColor = function(r,g,b) {
  
    PS.call("setd",{
         "Srce" : "colorPickerPanel",
         "T   " : {
            "Grn " : g,
            "Rd  " : r,
            "obj" : "RGBC",
            "Bl  " : b
         },
         "null" : {"ref" : "Clr ","property" : "FrgC"}
            })
}

Commands.target = function(x) { return {ref:x, enumType:'Ordn', value:"Trgt"}}

// PS.call("set",{null:{ref:"Color", property:"foregroundColor"}, to:{obj:"RBGColor", red:0, green:0, blue:0}, source: "swatchesReplace"})

Commands.toggleLayer = function(idx, show) {
    var cmd = show ? "show":"hide"
    PS.call()

        }
    
/*
// new ref coding, shorter still
refClass=   {ref:"Lyr "}  || "Lyr " (only if context unambiguously indicates a reference) 
refProperty={ref:"Lyr " , property:"foo"}
refEnum =   {ref:"Lyr " , enumType:"t", value:""}
refID    =  {ref:"Lyr " , id:123}
refIndex =  {ref:"Lyr " , index:123 }
refName =   {ref:"Lyr " , name:"blue line" }
refOffset=  {ref:"Lyr " , offset:123 }
refChain=   {ref:[ {}, {}, ...]}
*/
