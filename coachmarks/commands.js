
onPSEvent = function(command, params) {

    var fn = eventHandlers[command]
    if (fn) fn(params)
    //    console.log(command)
    //    console.log(command,params)
}

eventHandlers = {

 slct:  function(params) {

    var target = params.null
     var ref = target.ref
     if(typeof ref === 'object') { //If more than one thing is selected
        Commands.displayPropertiesName(ref.length + " Layers Selected");
        Commands.displayPropertiesClearAll();
     }
     //console.log(target.ref)
     if(ref == "Lyr ") {
        var layerCache = PS.get("Lyr ");
        console.log("Name: ", target.name);
        console.log("Opacity: ", layerCache["Opct"]);
        console.log("Kind: ", layerKindMap(layerCache.layerKind));
        console.log("Layer ID: ", layerCache.LyrI);
        console.log("Layer Order: ", layerCache.ItmI);
        console.log("Blendmode: ", layerCache["Md  "]["value"]);
        console.log("Visibility: ", layerCache["Vsbl"]);
        // Optional Attributes ---------------------------------------------------------------------
        switch(layerKindMap(layerCache.layerKind))
        {
          case "type": 
            Commands.displayProperties(layerCache);
            try { console.log("Typeface: ", layerCache['Txt ']['Txtt'][0]['TxtS']["fontPostScriptName"]);
            } catch (e) { console.log("No type here") }
            break;
          case "vector":
            Commands.displayProperties(layerCache);
            console.log("Fill R:", layerCache.Adjs[0]["Clr "]["Rd  "],
                            " G:", layerCache.Adjs[0]["Clr "]["Grn "],
                            " B:", layerCache.Adjs[0]["Clr "]["Bl  "] 
                            );
            try { 
            console.log("Stroke R:", layerCache.AGMStrokeStyleInfo["strokeStyleContent"]["Clr "]["Rd  "] ,
                            " G:", layerCache.AGMStrokeStyleInfo["strokeStyleContent"]["Clr "]["Grn "] ,
                            " B:", layerCache.AGMStrokeStyleInfo["strokeStyleContent"]["Clr "]["Bl  "] 
                            );
            } catch (e) { console.log("No stroke here") }
            console.log("Stroke Width: ", layerCache.AGMStrokeStyleInfo["strokeStyleLineWidth"]["value"]);
            break;
          case "pixel":
            Commands.displayProperties(layerCache);
          break;
          case "smartobject":
            //Commands.displayProperties(layerCache);
            console.log("SmartObjectFile: ", PS.get("Lyr ")["smartObject"]['FilR']);
            break;
          case "group":
            //Commands.displayProperties(layerCache);
            console.log("SmartObjectFile: ", PS.get("Lyr ")["smartObject"]['FilR']);
            break;
      }
        return;
     }  
     if (ref == "HstS") { //detect Undo / Redo (actually walking through history stack, but good enough)

        console.log(target.value);
        Commands.displayToolOverlay(target.value)
        //switch(params.)

     }
     var brush = Commands.getBrush()
     
     if(brush.Tool.enumType == ref) {
      console.log("selected tool", ref, brush.CrnT);
      var mappedTool = toolMap(ref);
      //console.log(mappedTool);
      Commands.displaySelectedTool(mappedTool);
      return;
     }



//console.log(JSON.stringify(params,null," "))

 },

 setd: function(params) { // Detect change in most elements
  console.log("setd",params);
  //console.log(params["T   "]["Grn "]);
  if(params.Srce === "eyeDropperSample") { 
        Commands.setFillColor(params["T   "]["Rd  "], params["T   "]["Grn "], params["T   "]["Bl  "]) 
  };
 },

 changePathDetails: function(params) { // Detect change in shape
  console.log("changePathDetails",params);
 },

 'Shw ': function(params) { // Show Layerg
  console.log("Shw ",params);

 },

 'Hd  ': function(params) { // Hide Layer
  console.log("Hd  ",params);

 },

 move: function(params) { // Hide Layer

  //console.log(Commands.getAllLayers());

 },

'Opn ': function(params) { // Hide Layer

  console.log(Commands.getAllLayers());

 },

selectNoLayers: function(params) { // Hide Layer

  console.log("Layers Deselected");
  Commands.displayProperties(PS.get("document"));

 },

    
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

try {
    PS.log("we have been called!");
} catch (e) {
    console.log("PS not available yet")
}

/*
try {
    Wacom.active = true;
    console.log(Wacom.device);
} catch (e) {
    console.log("no wacom", e)
}

attachedDevice = function(device) {
    console.log(device)

    var state = PS.state || {}
    state.latest = device;
    PS.state = state

    window.currentWacom = device


}
*/
//origin = {x:0,y:0}
// screen = {x:0, y:0, wd:0, ht:0}   

//screenBounds = function(x,y,wd,ht) {
// screen = {x:x, y:y, wd:wd, ht:ht}   
//// console.log("screen", JSON.stringify(screen))
//}

deviceAdded = function() {
    alert("device added")
}


document.addEventListener("touchBegin", function(e) {
    console.log(e)
})

onPacket = function(touches) {
    touches.forEach(function(touch) {
        var event = new CustomEvent(touch.state, {
            detail: touch
        })
        var x = touch.x
        var y = touch.y // - origin.y
        var target = document.elementFromPoint(x, y)

        //        event.initEvent(touch.state, true,true,window
        //                             ,0,0,0,x,y)
        target.dispatchEvent(event);

        if (touch.state == "touchBegin") console.log(target)


        // manually dispatch clicks
        if (touch.state == "touchEnd") {
            var event = new MouseEvent()
            event.initMouseEvent('click', true, true, window, 0, 0, 0, x, y)
            target.dispatchEvent(event);
        }
    })
}

var makeMapWithFn = function(arr, fn) {
    var rval = {}
    forEach(arr, function(elt) {
        console.log("'", elt, "'")
        rval[fn(elt)] = elt
    })
    return rval
}

var forEach = function(arrayLike, fn) {
    for (var i = 0; i < arrayLike.length; i++)
    fn(arrayLike[i], i, arrayLike)
}

var filter = function(arrayLike, fn) {
    var rval = []
    for (var i = 0; i < arrayLike.length; i++) {
        var elt = arrayLike[i];
        if (fn(elt, i, arrayLike)) rval.push(elt)
    }
    return rval
}

var map = function(arrayLike, fn) {
    var rval = []
    for (var i = 0; i < arrayLike.length; i++) {
        var elt = arrayLike[i];
        rval.push(fn(elt, i, arrayLike))
    }
    return rval
}

var getExtension = function(str) {
    console.log(str)
    return str.substring(str.lastIndexOf('.') + 1)
}
var allExtensions = function(arr) {

    return makeMapWithFn(arr, getExtension)
}

var layerKindMap = function(arr) {
   var layerMap = [];
    layerMap[1] = "pixel";
    layerMap[2] = "adjustment"; // also gradient / solid color / pattern
    layerMap[3] = "type";
    layerMap[4] = "vector";
    layerMap[5] = "smartobject";
    layerMap[7] = "group";
    layerMap[13] = "/endofgroup";

  return layerMap[arr];
}

var toolMap = function(arr) {
   //console.log("toolmap: " + arr);
   var mappedTool;
   switch(arr) {

    case "moveTool":
        mappedTool = "Move"
    break;
    case "roundedRectangleTool":
        mappedTool = "Rounded Rectangle"
    break;
    case "rectangleTool":
        mappedTool = "Rectangle"
    break;
    case "ellipseTool":
        mappedTool = "Ellipse"
    break;
    case "penTool":
        mappedTool = "Path"
    break;
    case "PbTl":
        mappedTool = "Paintbrush"
    break;
    case "eyedropperTool":
        mappedTool = "Eyedropper"
    break;
    case "typeCreateOrEditTool":
        mappedTool = "Type"
    break;
    case "lassoTool":
        mappedTool = "Lasso"
    break;
    case "cropTool":
        mappedTool = "Crop"
    break;
    case "Blue Pencil":
        mappedTool = "Blue Pencil"
    break;
    default:
        mappedTool = arr;
   }

   return mappedTool;

   // Can't get this damn thing to work as an object for some reason
   // var toolMapList = {  "moveTool": "Move",
   //                  "roundedRectangleTool": "Rounded Rectangle",
   //                  "rectangleTool": "Rectangle",
   //                  ellipseTool: "Ellipse",
   //                  penTool: "Path",
   //                  PbTl: "Paint Brush",
   //                  eyedropperTool: "Eyedropper",
   //                  typeCreateOfEditTool: "Text",
   //                  lassoTool: "Lasso",
   //                  cropTool: "Crop",
   //                };
   //  console.log(toolMapList.arr);
}


var imgtypes = {
    png: 1,
    svg: 1,
    jpg: 1
}
var isImagePath = function(path) {
    return getExtension(path) in imgtypes
}
var isCSSLink = function(link) {
    return link.rel === "stylesheet"
}

onFilesChanged = function(arr) {
    console.log("!!!")
    console.log(arr.length, "filesChanged")
    var types = allExtensions(arr)
    //console.log(types)
    if (types.js) {
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
    return idx == -1 ? str : str.substring(0, idx) + ')'
}
var mungeCounter = 0
var mungeUrl = function(str) {
    mungeCounter++
    return str.substring(0, str.length - 1) + '?' + mungeCounter + ')';

}

var reloadImages = function(arr) {
    console.log("input", arr)
    var urlMap = makeMapWithFn(arr, function(elt) {
        return "url(file://" + elt + ")"
    })
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
        if (img.length == 0) img = window.getComputedStyle(elt).backgroundImage + ""
        if (img.length == 0 || img == "none") return


        img = stripMunge(img)
        console.log(img)

        if (img in urlMap) {
            //    if(urls.indexOf(img) != -1) {
            console.log("found it")
            // elt.style.setProperty("backgroundImage",)
            elt.style.backgroundImage = mungeUrl(img)
            console.log("ELT", elt)
            console.log("STYLE", elt.style)
            console.log("CSS", elt.style.cssText)
            console.log(" elt.style.backgroundImage  = '" + newImage + "'")
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
    crop: function(x, y, wd, ht, leaveOpen, unit, angle) {

        if (typeof x == 'undefined') {
            PS.call("Crop")
            return
        }

        angle = angle || 0
        unit = unit || "#Pxl"
        var args = {
            "CnsP": 0,
            "Angl": {
                "value": angle,
                "unit": "#Ang"
            },
            "cropAspectRatioModeKey": {
                "value": "pureAspectRatio",
                "enumType": "cropAspectRatioModeClass"
            },
            "T   ": {
                "obj": "Rctn",
                "Left": {
                    "value": x,
                    "unit": unit
                },
                "Top ": {
                    "value": y,
                    "unit": unit
                },
                "Btom": {
                    "value": wd,
                    "unit": unit
                },
                "Rght": {
                    "value": ht,
                    "unit": unit
                }
            },
            "Dlt ": 1
        }

        if (leaveOpen) PS.call("Crop", args, "always")
        else PS.call("Crop", args)
    },
    getBrush: function() {
        return Commands.getTool()
    },
    getTool: function() {
        return PS.get([{
            ref: "capp",
            value: "Trgt",
            enumType: "Ordn"
        }, {
            ref: 'Prpr',
            property: "_tool"
        }])
    },
    setTool: function(toolName, options, forceNotify) {
        PS.call("slct", {
            "null": {
                ref: toolName
            },
            forceNotify: forceNotify
        })

        if (options) {
            options.obj = options.obj || "null"
            PS.call("setd", {
                "null": {
                    ref: toolName
                },
                to: options
            })
        }
        var mappedTool = toolMap(toolName);
        Commands.displaySelectedTool(mappedTool)
    },
    selectTool: function(name, options, forceNotify) {
        console.warn("Commands.selectTool is deprecated. please use Commands.setTool instead")
        Commands.setTool(name, options, forceNotify)
    }
}

Commands.Noun = {
    layerCount: "NmbL"
}

Commands.Verbs = {
    select: "slct",
    make: "MK  "
}

var Inner = {}

Inner.CallSimple = function(verb, noun) {
    PS.call(verb, {
        "null": {
            ref: noun
        }
    })
}


var globalFontList = []
var globalLayerRef
var prevGlobalLayerRef

Commands.magicWand = function(mode, radius, tolerance, aa, contig, allLayers) {
    Commands.setToolWithOptions("magicWandTool", {
        "WndT": tolerance,
        "WndA": aa,
        "Cntg": contig,
        "Slct": mode,
        "WndS": allLayers,
        "EyDr": radius || 0
    })
}
var auxLasso = function(tool, mode, feather, aa) {

    //{"CrnT":{"Slct":0,"Cntg":1,"obj":"CrnT","DrwR":{"value":0,"unit":"#Pxl"},"DrwA":1},"Tool":{"value":"Trgt","enumType":"lassoTool"}}

    var args = {
        Slct: mode || 0,
        DrwA: aa || false
    }
    if (feather && feather > 0) {
        args.DrwR = Unit.px(feather)
    }
    Commands.setToolWithOptions(tool, args)
}

Commands.polyLasso = function(mode, feather, aa) {
    auxLasso("polySelTool", mode, feather, aa)
}
Commands.lasso = function(mode, feather, aa) {
    auxLasso("lassoTool", mode, feather, aa)
}


Commands.moveTool = function(opts) {
    opts = opts || {}
    Commands.selectTool("moveTool", {
        ASGr: opts.groups || 0,
        Abbx: opts.transform || 0,
        AtSl: opts.autoSelect || 0
    })
}

C = {
    setd: function(lhs, rhs) {
        PS.call('setd', {
            "null": lhs,
            to: rhs
        })
    },

    target: function(className) {
        return {
            ref: className,
            enumType: "Ordn",
            value: "Trgt"
        }
    }
}


Commands.make = function(noun) {
    Inner.CallSimple("Mk  ", noun);
}

Commands.makeLayer = function() {
    Commands.make("Lyr ");
}

Commands.layerCount = function(docID) {
    var ref = {
        property: "NmbL",
        id: {
            "Dcmn": docID
        }
    }
    var result = get(ref);

    PS.log(JSON.stringify(result));
}

Commands.selectLayer = function(name) {
    try {
        PS.call("slct", {
            "MkVs": 0,
            "null": {
                name: name,
                ref: "Lyr "
            }
        });
    } catch (e) {
        PS.log('select layer ' + e);
    }
}
Commands.hasLayer = function(name) {
    var l = PS.get({
        ref: 'Lyr ',
        name: name
    })
    return typeof l == "object";
}

Commands.getRectRadii = function(layerRef) {

    return;

}

Commands.setRadius = function(radTopLeft, radTopRight, radBottomLeft, radBottomRight) {
    if (arguments.length === 1 || arguments.length === 4) {
      try {
      PS.call('changePathDetails',{
        "keyOriginRRectRadii" : {
          "bottomRight" : {
            "value" : (radBottomRight || radTopLeft),
            "unit" : "#Pxl"
          },
          "topRight" : {
            "value" : (radTopRight || radTopLeft),
            "unit" : "#Pxl"
          },
          "obj" : "radii",
          "unitValueQuadVersion" : 1,
          "topLeft" : {
            "value" : radTopLeft,
            "unit" : "#Pxl"
          },
          "bottomLeft" : {
            "value" : (radBottomLeft || radTopLeft),
            "unit" : "#Pxl"
          }
        },
      "keyOriginType" : 1
      })
      } catch (e) {
          PS.log(e);
      }
    } else {
          PS.log("setRadius accepts 1 (set all radii) or 4 (set individual radii) arguments");
    }
}

Commands.setStrokeWidth = function(idx) {
  PS.call('setd',{
    "T   " : {
      "obj" : "shapeStyle",
      "strokeStyle" : {
        "obj" : "strokeStyle",
        "strokeEnabled" : 1,
        "strokeStyleVersion" : 2,
        "strokeStyleLineWidth" : {
          "value" : idx,
          "unit" : "#Pxl"
        }
      }
    },
    "null" : {
      "ref" : "contentLayer",
      "value" : "Trgt",
      "enumType" : "Ordn"
    }
  })
}

Commands.setFillColor = function(theR, theG, theB) {
  PS.call('setd',{
    "T   " : {
      "obj" : "shapeStyle",
      "FlCn" : {
        "obj" : "solidColorLayer",
        "Clr " : {
          "Grn " : theG,
          "Rd  " : theR,
          "obj" : "RGBC",
          "Bl  " : theB
        }
      },
      "strokeStyle" : {
        "obj" : "strokeStyle",
        "fillEnabled" : 1,
        "strokeStyleVersion" : 2
      }
    },
    "null" : {
      "ref" : "contentLayer",
      "value" : "Trgt",
      "enumType" : "Ordn"
    }
  }) 

}

Commands.setStrokeColor = function(theR, theG, theB) {
PS.call('setd',{
  "T   " : {
    "obj" : "shapeStyle",
    "strokeStyle" : {
      "strokeStyleContent" : {
        "obj" : "solidColorLayer",
        "Clr " : {
          "Grn " : theG,
          "Rd  " : theR,
          "obj" : "RGBC",
          "Bl  " : theB
        }
      },
      "obj" : "strokeStyle",
      "strokeEnabled" : 1,
      "strokeStyleVersion" : 2
    }
  },
  "null" : {
    "ref" : "contentLayer",
    "value" : "Trgt",
    "enumType" : "Ordn"
  }
}) 
}


   // arry = [ //for testing
    //         {"order":1,"id":14,"name":"Top","kind":"group","visible":1},
    //         {"order":2,"id":382,"name":"Hi there","kind":"text","visible":1},
    //         {"order":3,"id":214,"name":"Middle","kind":"group","visible":1}, 
    //         {"order":4,"id":382,"name":"Rectangle 3","kind":"vector","visible":1},
    //         {"order":5,"id":314,"name":"Bottom","kind":"group","visible":1},
    //         {"order":6,"id":382,"name":"Rectangle 4","kind":"vector","visible":1},
    //         {"order":7,"id":251,"name":"</Layer group>","kind":"/endofgroup","visible":1},
    //         {"order":8,"id":251,"name":"</Layer group>","kind":"/endofgroup","visible":1},
    //         {"order":9,"id":251,"name":"</Layer group>","kind":"/endofgroup","visible":1},
    //         {"order":10,"id":470,"name":"Latest Product News","kind":"group","visible":1},
    //         ]

function buildTree(branch, list) {
  //recursively builds tree from list with parent-child dependencies
  if (typeof branch == 'undefined') return null;
  var tree = [];
  for(var i=0; i<branch.length; i++)      
    tree.push( {
      item: branch[i],
      children: buildTree( list[ branch[i].id ], list)
    });
  return tree;
}

// if type is group, create another {} and then dump layers, stop when we see '/endofgroup'
          /*
        {
            {
                "name" : MyGroup,
                ...
                "kind" : group,
                ...
                "children" : {
                        {
                        "name" : Layer1, 
                        ..
                        },
                        {
                        "name" : Layer2, 
                        ..
                    }
                },
                {
                  "name" : Layer3, 
                  ...
                  "kind" : group,
                  ...   
                  "children" : null
                },
            }
        }

          */ 
// var createNodeRecursive = function (order, id, name, kind, visible, children) {
//     var numberOfLayers = PS.get("document")["NmbL"];
//     var layerNames = [];
//       for (var i=0;i<numberOfLayers+1;i++) { 
//           var layerRef = PS.get({ref:"Lyr ", index:i});
//           if (layerRef === (undefined || null)) continue;
//           layerNames[Commands.getLayerOrder(layerRef)] = createNodeRecursive( Commands.getLayerOrder(layerRef), 
//                                                                               Commands.getLayerID(layerRef),  
//                                                                               Commands.getLayerName(layerRef), 
//                                                                               Commands.getLayerKind(layerRef), 
//                                                                               Commands.getLayerVisibility(layerRef),
//                                                                               {}
//                                                                             )
//         }

//     if (kind === '/endofgroup') {
//             return;
//     }
    
// }

// Commands.getAllLayers2 = function() {

//       createNodeRecursive();
      
//       return JSON.stringify(layerNames.reverse()); //last one on top
// }

Commands.getAllLayers = function() {

      var numberOfLayers = PS.get("document")["NmbL"];
      var layerNames = [];
      for (var i=0;i<numberOfLayers+1;i++) { 
          var layerRef = PS.get({ref:"Lyr ", index:i});
          if (layerRef === (undefined || null)) continue;
          layerNames[Commands.getLayerOrder(layerRef)] = {
                                                        order: Commands.getLayerOrder(layerRef),
                                                        id: Commands.getLayerID(layerRef), 
                                                        name: Commands.getLayerName(layerRef), 
                                                        kind: Commands.getLayerKind(layerRef), 
                                                        visible: Commands.getLayerVisibility(layerRef),
                                                        };
        }
      return JSON.stringify(layerNames.reverse()); //last one on top
}


Commands.getLayerName = function(layerRef) {

        return layerRef["Nm  "];

        //return PS.get({ref:"Lyr ", index:index})["Nm  "];

}

Commands.getLayerOrder = function(layerRef) {

        return layerRef["ItmI"];

        //return PS.get({ref:"Lyr ", index:index})["ItmI"];

}

Commands.getLayerID= function(layerRef) {

        return layerRef["LyrI"];

        //return PS.get({ref:"Lyr ", index:index})["ItmI"];

}

Commands.getLayerVisibility = function(layerRef) {
        return layerRef["Vsbl"];

      //return PS.get({ref:"Lyr ", index:index})["Vsbl"];

}

Commands.getLayerKind = function(layerRef) {
        return layerKindMap(layerRef.layerKind);

       //return PS.get({ref:"Lyr ", index:index}).layerKind
}

Commands.getFontList = function() {
    var appFonts = PS.get('capp');
    var fontDisplayNames = appFonts["fontList"]["FntN"];
    var fontPostScriptNames = appFonts["fontList"]["fontPostScriptName"];
    var fontList = [];
    for (i=0;i<fontDisplayNames.length;i++) {

        fontList[i] = {displayName: fontDisplayNames[i], postScriptName: fontPostScriptNames[i]};

    }

    return fontList;
}


Commands.displayPropertiesName = function(name) {

    document.getElementById("current-object").innerHTML = name;

}

Commands.displayPropertiesFill = function(layerRef) {
    if(typeof layerRef == 'undefined') {layerRef = PS.get("Lyr ")}
    //console.log(layerRef)
    var normalizedRGB = "rgb(" + 
                            Math.round(layerRef.Adjs[0]["Clr "]["Rd  "])
                            + ", " + 
                            Math.round(layerRef.Adjs[0]["Clr "]["Grn "])
                            + ", " + 
                            Math.round(layerRef.Adjs[0]["Clr "]["Bl  "])
                            + ")";
    //console.log(Math.round(layerRef.Adjs[0]["Clr "]["Rd  "]));
    console.log("Fill: " + normalizedRGB);
    document.getElementById("current-fill-color").style.backgroundColor = normalizedRGB;
    document.getElementById("text-fill-color").value = normalizedRGB;
}

Commands.displayPropertiesStroke = function(layerRef) {
    try { 
        var normalizedRGB = "rgb(" + 
                                Math.round(layerRef.AGMStrokeStyleInfo["strokeStyleContent"]["Clr "]["Rd  "])
                                + ", " + 
                                Math.round(layerRef.AGMStrokeStyleInfo["strokeStyleContent"]["Clr "]["Grn "])
                                + ", " + 
                                Math.round(layerRef.AGMStrokeStyleInfo["strokeStyleContent"]["Clr "]["Bl  "])
                                + ")";
        var normalizeStroke = Math.round(layerRef.AGMStrokeStyleInfo["strokeStyleLineWidth"]["value"]);
    } catch (e) {
        var normalizeStroke = "0";
        var normalizedRGB = "none";
    }
    //console.log("Stroke: " + normalizeStroke);
    document.getElementById("current-border-color").style.backgroundColor = normalizedRGB;
    document.getElementById("text-border-color").value = normalizedRGB;
    document.getElementById("current-border-width").value = normalizeStroke;
    document.getElementById("toggle-border-width").value = normalizeStroke;
    document.getElementById("current-border-width").value = normalizeStroke;
    document.getElementById("toggle-border-width").value = normalizeStroke;

}

Commands.displayPropertiesTypeFont = function(layerRef) {
    //console.log(layerRef['Txt ']['Txtt'][0]['TxtS']["fontPostScriptName"]);
    document.getElementById("current-type-font").options.namedItem("replaceMe").value = layerRef['Txt ']['Txtt'][0]['TxtS']["fontPostScriptName"];
    document.getElementById("current-type-font").options.namedItem("replaceMe").innerHTML = layerRef['Txt ']['Txtt'][0]['TxtS']["fontPostScriptName"];

    return layerRef['Txt ']['Txtt'][0]['TxtS']["fontPostScriptName"]
}

Commands.displayPropertiesTypeColor = function(layerRef) {
    console.log(layerRef['Txt ']['Txtt'][0]['TxtS']["Clr "]["Rd  "]);
    var normalizedRGB = "rgb(" + 
                            Math.round(layerRef['Txt ']['Txtt'][0]['TxtS']["Clr "]["Rd  "])
                            + ", " + 
                            Math.round(layerRef['Txt ']['Txtt'][0]['TxtS']["Clr "]["Grn "])
                            + ", " + 
                            Math.round(layerRef['Txt ']['Txtt'][0]['TxtS']["Clr "]["Bl  "])
                            + ")";
    document.getElementById("current-type-color").style.backgroundColor = normalizedRGB;
    document.getElementById("text-type-color").value = normalizedRGB;
}

Commands.displayTypeFontList = function() {
    var appFonts = PS.get('capp');
    var fontDisplayNames = appFonts["fontList"]["FntN"];
    var fontPostScriptNames = appFonts["fontList"]["fontPostScriptName"];
    //console.log(fontPostScriptNames);
    globalFontList = [];
    globalFontList[0] = "<option name=\"" + "replaceMe" + "\" value=\"" + "replaceMe" + "\">" + "replaceMe" + "</option>";
    globalFontList[1] = "<option disabled>------------------------</option>";
    for (i=2;i<fontDisplayNames.length;i++) {

         globalFontList[i]= "<option name=\"" + fontPostScriptNames[i] + "\" value=\"" + fontPostScriptNames[i] + "\">" + fontPostScriptNames[i] + "</option>";

    }
    //console.log(globalFontList);
    
    document.getElementById("current-type-font").innerHTML = globalFontList;
}

Commands.displayPropertiesDimensions = function(layerRef) {
    // console.log("H: " + layerRef.bounds.Hght.value);
    // console.log("W: " + layerRef.bounds.Wdth.value);
    document.getElementById("current-dimension-width").value = layerRef.bounds.Wdth.value;
    document.getElementById("current-dimension-height").value = layerRef.bounds.Hght.value;
}

Commands.displayPropertiesDocuments = function(layerRef) {
    // console.log("H: " + layerRef.bounds.Hght.value);
    // console.log("W: " + layerRef.bounds.Wdth.value);
    document.getElementById("current-document-resolution").value = layerRef.Rslt.value;
    document.getElementById("current-document-layerNumber").value = layerRef.NmbL;
}

Commands.displayPropertiesClearAll = function(){
    document.getElementById("dimensions-field").style.display = "none";
    document.getElementById("vector-field").style.display = "none";
    document.getElementById("type-field").style.display = "none";
    document.getElementById("pixel-field").style.display = "none";

}

Commands.displayProperties = function(layerRef) {
    //console.log(layerRef)
    if(layerRef["Ttl "]) { //if we're dealing with a document, instead of a layer
        Commands.displayPropertiesDocuments(layerRef);
        Commands.displayPropertiesName(layerRef["Ttl "]);
        document.getElementById("dimensions-field").style.display = "none";
        document.getElementById("vector-field").style.display = "none";
        document.getElementById("type-field").style.display = "none";
        document.getElementById("pixel-field").style.display = "none";
        document.getElementById("document-field").style.display = "";
        return
    }

    Commands.displayPropertiesName(layerRef["Nm  "]);
    Commands.displayPropertiesDimensions(layerRef);

    var layerKind = (layerKindMap(layerRef.layerKind));
    
    //console.log(layerKind);

    switch(layerKind) {
    case "vector": 
        Commands.displayPropertiesFill(layerRef);
        Commands.displayPropertiesStroke(layerRef);
        document.getElementById("dimensions-field").style.display = "";
        document.getElementById("vector-field").style.display = "";
        document.getElementById("type-field").style.display = "none";
        document.getElementById("pixel-field").style.display = "none";
        document.getElementById("document-field").style.display = "none";
    break;
    case "type":
        if(globalFontList[0] === undefined) { Commands.displayTypeFontList() }; //this should be relocated to the place where we do initialization
        Commands.displayPropertiesTypeFont(layerRef);
        Commands.displayPropertiesTypeColor(layerRef);
        document.getElementById("dimensions-field").style.display = "";
        document.getElementById("vector-field").style.display = "none";
        document.getElementById("type-field").style.display = "";
        document.getElementById("pixel-field").style.display = "none";
        document.getElementById("document-field").style.display = "none";
    break;
    case "pixel":
        document.getElementById("dimensions-field").style.display = "";
        document.getElementById("vector-field").style.display = "none";
        document.getElementById("type-field").style.display = "none";
        document.getElementById("pixel-field").style.display = "";
        document.getElementById("document-field").style.display = "none";
    break;
    }
}

Commands.displaySelectedTool = function(toolName) {
        var mappedTool = toolMap(toolName); 
        if (document.getElementsByClassName("selected")[0]) document.getElementsByClassName("selected")[0].className='';
        document.getElementsByName(toolName)[0].className='selected'
        Commands.displayToolOverlay(toolName);

}

Commands.displayToolOverlay = function(toolName) {

        //console.log(elementToFade);
        try {  

            var element = document.getElementsByClassName("overlay")[0]; 
            
        } catch (e) { console.log("no opacity for you") };

        element.innerHTML = toolName;


        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.009){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.display = '';
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 55); // interval


        // var opacityDec = (10/speed);
        //         if(!elem.style.opacity){elem.style.opacity = 1;}
        //         setInterval(function() {
        //                 elem.style.opacity -= opacityDec;              
        //         }, 10);                

}

Commands.renameLayer = function(name) {
    PS.call('setd', {
        "T   ": {
            "obj": "Lyr ",
            "Nm  ": name
        },
        "null": {
            "ref": "Lyr ",
            "value": "Trgt",
            "enumType": "Ordn"
        }
    })
}


Commands.selectFrontLayer = function() {
    PS.call('slct', {
        "MkVs": 0,
        "null": {
            ref: "Lyr ",
            value: "Frnt",
            enumType: "Ordn"
        }
    })
}

Commands.selectBackLayer = function() {
    PS.call('slct', {
        "MkVs": 0,
        "null": {
            ref: "Lyr ",
            value: "Back",
            enumType: "Ordn"
        }
    })
}
Commands.moveFrontLayerToBack = function() {
    Commands.selectFrontLayer();
    Commands.moveSelectedLayerToBack();
}

Commands.moveBackLayerToFront = function() {
    Commands.selectBackLayer();
    Commands.moveSelectedLayerToFront();
}
Commands.moveSelectedLayerToFront = function() {
    PS.call("move", {
        "null": {
            ref: "Lyr ",
            value: "Trgt",
            enumType: "Ordn"
        },
        to: {
            ref: "Lyr ",
            value: "front",
            enumType: "Ordn"
        }
    });
}

Commands.moveSelectedLayerToBack = function() {
    PS.call("move", {
        "null": {
            ref: "Lyr ",
            value: "Trgt",
            enumType: "Ordn"
        },
        to: {
            ref: "Lyr ",
            value: "Back",
            enumType: "Ordn"
        }
    });
}


Commands.moveNamedLayerToFront = function(name) {

    PS.call("move", {
        'null': {
            ref: "Lyr ",
            name: name
        },
        to: {
            ref: "Lyr ",
            value: "front",
            enumType: "Ordn"
        }
    });
}


Unit = {

    px: function(val) {
        return {
            unit: "#Pxl",
            value: val
        }
    },
    percent: function(val) {
        return {
            unit: "#Prc",
            value: val
        }
    },
    angle: function(val) {
        return {
            unit: "#Ang",
            value: val
        }
    }
}




Commands.setBrush = function(diam, hard, angle, round, spacing) {

    PS.call("setd", {
        "null": C.target("Brsh"),
        to: {
            obj: "computedBrush",
            Dmtr: Unit.px(diam),
            Hrdn: Unit.percent(hard || 100),
            Angl: Unit.angle(angle || 0),
            Rndn: Unit.percent(round || 100),
            Spcn: Unit.percent(spacing || 1)
        }
    })

}


Commands.moveSelectedLayerTo = function(idx) {

    PS.call("move", {
        "Vrsn": 5,
        "Adjs": 0,
        "T   ": {
            "ref": "Lyr ",
            "index": idx
        },
        "null": {
            "ref": "Lyr ",
            "value": "Trgt",
            "enumType": "Ordn"
        }
    })
}

Commands.bluePencil = function() {
    try {
        Commands.setTool("PbTl");
        if (Commands.hasLayer("blue pencil")) {
            Commands.selectLayer("blue pencil");
        } else {
            Commands.makeLayer();
            Commands.renameLayer("blue pencil");
        }
        Commands.moveSelectedLayerToFront();

        Commands.setBrush(2)
        Commands.setForegroundColor(65, 179, 225);
        Commands.displaySelectedTool("Blue Pencil");
    } catch (e) {
        PS.log(e + '');
    }

}

Commands.redPencil = function() {
    try {
        Commands.selectTool("PbTl");
        if (Commands.hasLayer("red pencil")) {
            Commands.selectLayer("red pencil");
        } else {
            Commands.makeLayer();
            Commands.renameLayer("red pencil");
        }
        Commands.moveSelectedLayerToFront();

        Commands.setBrush(15)
        Commands.setForegroundColor(200, 0, 0);
    } catch (e) {
        PS.log(e + '');
    }

}

Commands.setVisSets = function(classic, notClassic) {
    try {
        PS.log(classic ? "going classic" : "going custom");

        Owl.tools = Owl.controls = Owl.tabs = classic;
    } catch (e) {}

    Commands.setVisibility("tools", notClassic);
    Commands.setVisibility("properties", notClassic);
    Commands.setVisibility("panels", notClassic);
    //    Commands.setVisibility("goClassic",notClassic);
    //    Commands.setVisibility("goCustom",classic);
}

Commands.setClassic = function(classic) {
    Commands.setVisSets(classic, !classic)
//    document.getElementById("toggle").className = classic ? "classic" : "custom"
    document.body.className = classic ? "classic" : "custom"
}


Commands.showBoth = function() {
    Commands.setVisSets(true, true)
    document.getElementById("toggle").className = "dev"
    document.body.className = "dev"

}

Commands.toggleIconMess = function() {
    var className = document.getElementById("lotsoftools").className;

    if (className == "hidden") className = "showing";
    else className = "hidden"


    document.getElementById("lotsoftools").className = className;

}


Commands.setVisibility = function(id, show) {
    var elt = document.getElementById(id)
    if (elt) elt.style.visibility = show ? "inherit" : "hidden";
}

Commands.getForegroundColor = function() {
    try {
        //   var json = PS.query({ref:'FrgC', enumType:"Ordn", value:'Trgt', property:'capp'})
        var json = PS.get({
            ref: 'capp',
            enumType: "Ordn",
            value: 'Trgt',
            property: 'FrgC'
        })
        PS.log(JSON.stringify(json, null, '\t'));
    } catch (e) {
        PS.log(e + '')
    }
}

Commands.makeFillLayer = function(r, g, b) {

    if (arguments.length == 0) return Commands.makeFillLayer(255, 255, 255);
    else if (arguments.length == 1) return Commands.makeFillLayer(r >> 16, (r >> 8) & 255, r & 255);

    PS.call('Mk  ', {
        "Usng": {
            "obj": "contentLayer",
            "Type": {
                "obj": "solidColorLayer",
                "Clr ": {
                    "Grn ": g,
                    "Rd  ": r,
                    "obj": "RGBC",
                    "Bl  ": b
                }
            }
        },
        "null": {
            "ref": "contentLayer"
        }
    })

}


Commands.advanceSlideshow = function() {
    Commands.moveFrontLayerToBack();
    Commands.moveFrontLayerToBack();
}

Commands.backupSlideshow = function() {
    Commands.moveBackLayerToFront();
    Commands.moveBackLayerToFront();
}

Commands.getDocID = function(idx) {
    try {
        var json = PS.query({
            ref: 'Dcmn',
            index: idx,
            property: 'DocI'
        })
        PS.log(JSON.stringify(json, null, '\t'));
    } catch (e) {
        PS.log(e + '')
    }

}

Commands.getDocCount = function(idx) {
    try {
        var json = PS.get({
            ref: 'capp',
            property: 'NmbD'
        })
        PS.log(JSON.stringify(json, null, '\t'));
    } catch (e) {
        PS.log(e + '')
    }

}
Commands.setForegroundColor = function(r, g, b) {

    PS.call("setd", {
        "Srce": "colorPickerPanel",
        "T   ": {
            "Grn ": g,
            "Rd  ": r,
            "obj": "RGBC",
            "Bl  ": b
        },
        "null": {
            "ref": "Clr ",
            "property": "FrgC"
        }
    })
}

Commands.target = function(x) {
    return {
        ref: x,
        enumType: 'Ordn',
        value: "Trgt"
    }
}

// PS.call("set",{null:{ref:"Color", property:"foregroundColor"}, to:{obj:"RBGColor", red:0, green:0, blue:0}, source: "swatchesReplace"})

Commands.toggleLayer = function(idx, show) {
    var cmd = show ? "show" : "hide"
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