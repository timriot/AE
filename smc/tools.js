Tools = {
 roundedRect1: function() {
        Commands.setTool("roundedRectangleTool", {
            Cntr: 0,
            radii: {
                obj:"radii",
                bottomLeft:{unit:"#Pxl", value:1},
                bottomRight:{unit:"#Pxl", value:1},
                topLeft:{unit:"#Pxl", value:10},
                topRight:{unit:"#Pxl", value:20},
                unitValueQuadVersion:1
            },
        //    geometryToolMode:{enumType:"geometryToolMode", value:"Shp "}
            geometryToolMode:{enumType:"geometryToolMode", value:"Path"}
       //     geometryToolMode:{enumType:"geometryToolMode", value:"Fl  "}
        
        }
                           )
    },

    roundedRect2: function() {
        Commands.setTool("roundedRectangleTool", {
            Cntr: 1,
            radii: { note: "is set succesfully, but is unused",
                obj:"radii",
                bottomLeft:{unit:"#Pxl", value:1},
                bottomRight:{unit:"#Pxl", value:1},
                topLeft:{unit:"#Pxl", value:10},
                topRight:{unit:"#Pxl", value:20},
                unitValueQuadVersion:1
            },
             geometryToolMode:{enumType:"geometryToolMode", value:"Shp "},
          Cnst:{enumType:"Cnst", value:"CnsP"},
            HiPr: 2,
            WiPr: 1
        })
    },
    
     roundedRect3: function() {
        Commands.setTool("roundedRectangleTool", {
            Cnst:{enumType:"Cnst", value:"fixd"},
             geometryToolMode:{enumType:"geometryToolMode", value:"Shp "},
            Hght: 1,
            Wdth: 10,
            HgtU: 1,
            WidU: 1
        })
        
        
        PS.call('setd',{
  to: {
    "obj" : "shapeStyle",
    "FlCn" : {
      "obj" : "solidColorLayer",
      "Clr " : {
        "Grn " : 140.0431877374649,
        "Rd  " : 67.9627351462841,
        "obj" : "RGBC",
        "Bl  " : 202.563208937645
      }
    },
    strokeStyle : {
      obj : "strokeStyle",
      fillEnabled : 1,
      strokeStyleVersion : 2
    }
  },
  "null" : {ref: "reoundedRectangleTool" }
})

    }




}