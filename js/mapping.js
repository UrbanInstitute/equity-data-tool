mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';
var mapboxStyleUrl = "mapbox://styles/urbaninstitute/ckvtyaa3m1cds14ph2lowc45t/"

d3.selectAll(".controlContainer").on("click", function(){
    d3.selectAll(".controlContainer").classed("active", false)
    d3.select(this).classed("active", true)
    d3.selectAll(".mapDownloadComponent").classed("active", false)


    if(d3.select(this).classed("diff")){
        d3.select("#diffMap")
            .transition()
            .duration(1000)
            .style("margin-top", "0px")
        d3.select(".mapLegend.diff")
            .transition()
            .duration(1000)
            .style("margin-top", "0px")
        d3.selectAll(".mapDownloadComponent.diff").classed("active", true)
        d3.select("#mapImageButton-button").style("display","none")  
        d3.select("#mapImageButtonOverlay").style("display","none")
        d3.select("#pointUp").classed("slide", false)
    }else{
        d3.select("#diffMap")
            .transition()
            .duration(1000)
            .style("margin-top", -1*getMapHeight() + "px")
        d3.select(".mapLegend.diff")
            .transition()
            .duration(1000)
            .style("margin-top", -1*getMapLegendHeight() + "px")
        d3.selectAll(".mapDownloadComponent.compare").classed("active", true)
        d3.select("#mapImageButton-button").style("display","inline-block")  
        d3.select("#mapImageButtonOverlay").style("display","block")  
        d3.select("#pointUp").classed("slide", true) 
    }
})
// var tmp;
// function downloadMapImage(map, styleId){
//     // https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-87.0186,32.4055,14/500x300?access_token=pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ
//     // var l = map.getLayer("diffLayer")
//     // console.log(JSON.stringify(l.paint._values), l)
//     // var al = {"id": l.id, "paint": ["fill-color", "red"], "source": "composite", "type": "fill"}


//     // var mapURL = "https://api.mapbox.com/styles/v1/"
//     // mapURL += "urbaninstitute/ckecx3n9l2npi1aql5avokshb/"
//     // mapURL += "static/"
//     // mapURL += map.getCenter().lng + "," + map.getCenter().lat + ","
//     // mapURL += map.getZoom() + "/"
//     // mapURL += "500x300"
//     // mapURL += "?access_token=" + mapboxgl.accessToken
//     // mapURL += "&addlayer=" + JSON.stringify(al)
//     // // mapURL +=    
//     // // mapURL +=
//     // window.open(mapURL,"_blank")
//         // $('#downloadLink').click(function() {
//         var img = map.getCanvas().toDataURL('image/png')
//         // this.href = img
//     // })
//     window.open(img)
// }

function getRange(baseline, bounds, mapType){
    // console.log(bounds)
        var baselineMin = bounds["p_" + baseline + "_min"],
            baselineMax = bounds["p_" + baseline + "_max"],
            dataMin = bounds["da_prop_min"],
            dataMax = bounds["da_prop_max"],
            diffMin = bounds["d_" + baseline + "_min"],
            diffMax = bounds["d_" + baseline + "_max"],
            comparisonMin = Math.min(baselineMin, dataMin),
            comparisonMax = Math.max(baselineMax, dataMax),
            diffBound = Math.max(Math.abs(diffMin), diffMax)
        // console.log(comparisonMin, comparisonMax, diffBound)
        if(mapType == "compare"){
            return (comparisonMin != comparisonMax) ? [comparisonMin, comparisonMax] : [0,1]
        }else{
            return (diffBound != 0) ? [-diffBound, diffBound] : [-.1, .1]
        }
}



function drawMaps(bbox, geojsonData, baseline, bounds){
    d3.selectAll(".mapboxgl-canvas").remove()
    d3.selectAll(".mapboxgl-canary").remove()
    d3.selectAll(".mapboxgl-control-container").remove()
    d3.selectAll(".mapboxgl-popup").remove()
    d3.selectAll(".mapboxgl-canvas-container").remove()
    d3.selectAll(".mapboxgl-compare").remove()

    
    var baselineMap = new mapboxgl.Map({
        container: 'baselineMap',
        style: mapboxStyleUrl,
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
        attributionControl: false
        // preserveDrawingBuffer: true
    });

    var dataMap = new mapboxgl.Map({
        container: 'dataMap',
        style: mapboxStyleUrl,
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
        attributionControl: false
        // preserveDrawingBuffer: true
    });

    var diffMap = new mapboxgl.Map({
        container: 'diffMap',
        style: mapboxStyleUrl,
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
        attributionControl: false
        // preserveDrawingBuffer: true

    });


    // var navDiff = new mapboxgl.NavigationControl({"showCompass": false});
    // var navBaseline = new mapboxgl.NavigationControl({"showCompass": false});
    // var navData = new mapboxgl.NavigationControl({"showCompass": false});

    diffMap
        .addControl(new mapboxgl.NavigationControl({"showCompass": false}), 'top-right')
        .addControl(new mapboxgl.AttributionControl({compact: true}));
    baselineMap
        .addControl(new mapboxgl.NavigationControl({"showCompass": false}), 'top-right')
        .addControl(new mapboxgl.AttributionControl({compact: true}));
    dataMap
        .addControl(new mapboxgl.NavigationControl({"showCompass": false}), 'top-right')
        .addControl(new mapboxgl.AttributionControl({compact: true}));

    if(widthBelow(1000) || widthBelow(768) || widthBelow(500)){
        diffMap.scrollZoom.disable();
        baselineMap.scrollZoom.disable();
        dataMap.scrollZoom.disable();
    }

    $('.mapButton.mapImg.diff').click(function() {
        takeScreenshot(diffMap).then(function(data){
            var blob = dataURItoBlob(data)
            downloadBlob(blob, "spatial_equity_disparity_map.png")
        })
    })

    $("#mapImageButtonOverlay").on("click", function(){
        $('#mapImageButton-button').trigger("click")
    })
    $("#mapImageButtonOverlay").on("mouseover", function(){
        $('#mapImageButtonOverlay img').attr("src","images/menuArrowWhite.png")
    })
    $("#mapImageButtonOverlay").on("mouseout", function(){
        $('#mapImageButtonOverlay img').attr("src","images/menuArrow.png")
    })
    $('#mapImageButton')
        .selectmenu({
            select: function(event, d){
                if(d.item.value == "yourdata"){
                    takeScreenshot(dataMap).then(function(data){
                        var blob = dataURItoBlob(data)
                        downloadBlob(blob, "spatial_equity_" + getDatasetType() + "data_map.png")
                    })
                }else{
                    takeScreenshot(baselineMap).then(function(data){
                        var blob = dataURItoBlob(data)
                        downloadBlob(blob, "spatial_equity_" + getBaselineMap() + "_map.png")
                    })
                }
            },
            open: function(){
                d3.select("#mapImageButtonOverlay img").style("transform","rotate(180deg)")
            },
            close: function(){
                d3.select("#mapImageButtonOverlay img").style("transform","rotate(0deg)")
            },
            create: function( event, ui ) {
                d3.select("#mapImageButton-button").style("display","none")
            }

        })   

    baselineMap.on('load', function() {

        baselineMap.addSource('comparisonSource', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': geojsonData
            }
        })
        dataMap.addSource('dataSource', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': geojsonData
            }
        })
        diffMap.addSource('diffSource', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': geojsonData
            }
        })        

        var rangeComparison = getRange(baseline, bounds, "compare")

        var comparisonMin = rangeComparison[0],
            comparisonMax = rangeComparison[1],
            comparisonStep = (comparisonMax - comparisonMin)/MAP_BINS
        dataMap.addLayer({
            'id': 'dataLayer',
            'type': 'fill',
            'source': 'dataSource',
            'paint': {
            'fill-outline-color': "#696969", 
            'fill-color': [
                "interpolate",
                ["linear"],
                ["get", "da_prop"],
                comparisonMin,
                "#dcedd9",
                comparisonMin + comparisonStep,
                "#bcdeb4",
                comparisonMin + comparisonStep*2,
                "#98cf90",
                comparisonMin + comparisonStep*3,
                "#78c26d",
                comparisonMin + comparisonStep*4,
                "#55b748",
                comparisonMin + comparisonStep*5,
                "#408941",
                comparisonMin + comparisonStep*6,
                "#2c5c2d",
                comparisonMin + comparisonStep*7,
                "#1a2e19"
            ]
            ,
            'fill-opacity': 1
            }
        }, "road");        

        baselineMap.addLayer({
            'id': 'baselineLayer',
            'type': 'fill',
            'source': 'comparisonSource',
            'paint': {
            'fill-outline-color': "#696969", 
            'fill-color': [
                "interpolate",
                ["linear"],
                ["get", "p_" + baseline],
                comparisonMin,
                "#dcedd9",
                comparisonMin + comparisonStep,
                "#bcdeb4",
                comparisonMin + comparisonStep*2,
                "#98cf90",
                comparisonMin + comparisonStep*3,
                "#78c26d",
                comparisonMin + comparisonStep*4,
                "#55b748",
                comparisonMin + comparisonStep*5,
                "#408941",
                comparisonMin + comparisonStep*6,
                "#2c5c2d",
                comparisonMin + comparisonStep*7,
                "#1a2e19"
            ]
            ,
            'fill-opacity': 1
            }
        }, "road");        


        var compareContainer = "#mapComparison"

        var mapComparison = new mapboxgl.Compare(dataMap, baselineMap, compareContainer, {
            // mousemove: true
        });


        var rangeDiff = getRange(baseline, bounds, "diff")
// console.log(baseline, bounds)
        var diffMin = rangeDiff[0],
            diffMax = rangeDiff[1],
            diffStep = diffMax/4
        diffMap.addLayer({
            'id': 'diffLayer',
            'type': 'fill',
            'source': 'diffSource',
            'paint': {
            'fill-outline-color': 
            [
                "case",
                ["==",['string', ['get', 's_' + baseline]],"TRUE"],
                "#696969",
                "#353535"
            ],
            'fill-color': [
                "case",
                ["==",['string', ['get', 's_' + baseline]],"TRUE"],
                    [
                        "interpolate",
                        ["linear"],
                        ["get", "d_" + baseline],
                        diffMin,
                        "#ca5800",
                        diffMin + diffStep,
                        "#fdbf11",
                        diffMin + diffStep*2,
                        "#fdd870",
                        diffMin + diffStep*3,
                        "#fff2cf",
                        diffMin + diffStep*4,
                        "#ffffff",
                        diffMin + diffStep*5,
                        "#cfe8f3",
                        diffMin + diffStep*6,
                        "#73bfe2",
                        diffMin + diffStep*7,
                        "#1696d2",
                        diffMin + diffStep*8,
                        "#0a4c6a"
                    ]
                    
                ,
                "#9d9d9d"
            ]
            ,
            'fill-opacity': 1
            }
        }, "road");        

        

        var legendPercent = d3.format(".1%")
        var diffColors = ["#ca5800","#fdbf11","#fdd870","#fff2cf","#ffffff","#cfe8f3","#73bfe2","#1696d2","#0a4c6a"]
        var compareColors = ["#DCEDD9","#BCDEB4","#98CF90","#78C26D","#55B748","#408941","#2C5C2D","#1A2E19"]




        d3.selectAll(".mapLegend").selectAll("svg").remove()
        d3.selectAll(".mapLegend").selectAll(".dynamicLegend").remove()

        var diffSvg = d3.select(".mapLegend.diff").append("svg")
            .attr("width", getLegendWidth() + 2*legendMargin)
            .attr("height", legendHeight + 50)
        
        var diffDefs = diffSvg.append("defs")

        var diffNA = d3.select(".mapLegend.diff")
            .append("div")
            .attr("id", "diffNA")

        diffNA.append("div")
            .attr("id", "diffNAText")
            .attr("class", "dynamicLegend")
            .text("No significant difference")
        diffNA.append("div")
            .attr("id", "diffNARect")
            .attr("class", "dynamicLegend")
            .style("height", legendHeight + "px")


        diffDefs.append("linearGradient")
            .attr("id", "gradient-diff-colors")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%")
            .selectAll("stop") 
            .data(diffColors)                  
            .enter().append("stop") 
            .attr("offset", function(d,i) { return i/(diffColors.length-1); })   
            .attr("stop-color", function(d) { return d; });

        diffSvg.append("rect")
            .attr("class", "legendRect")
            .attr("x", legendMargin)
            .attr("y", 30)
            .attr("width", getLegendWidth())
            .attr("height", legendHeight)
            .style("fill", "url(#gradient-diff-colors)");
    

        var colorRangeDiff = d3.range(0, 1, 1.0 / (diffColors.length - 1));
        colorRangeDiff.push(1);
           
        var colorInterpolateDiff = d3.scaleLinear()
            .domain([diffMin,diffMax])
            .range([0,1]);

        diffSvg.selectAll(".legendStop.diff")
            .data(diffColors)
            .enter()
            .append("text")
            .attr("class", function(d,i){
                return "legendStop diff " + "lsDiff" + i
            })
            .attr("text-anchor", "middle")
            .attr("y", 20)
            .attr("x", function(d,i){
                // console.log(d,i, diffStep, diffMap, getLegendWidth())
                return legendMargin + ((i*diffStep)/(2*diffMax)) * getLegendWidth()
            })
            .text(function(d,i){
                return legendPercent(diffMin + i*diffStep)
            })
            .style("display", function(d,i){
                if(widthBelow(500)){
                    return (i%2 == 1) ? "none" : "block"
                }else{
                    return "block"
                }
                
            })


        var compareSvg = d3.select(".mapLegend.compare").append("svg")
            .attr("width", getLegendWidth() + 2*legendMargin)
            .attr("height", legendHeight + 50)
        
        var compareDefs = compareSvg.append("defs")

        compareDefs.append("linearGradient")
            .attr("id", "gradient-compare-colors")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%")
            .selectAll("stop") 
            .data(compareColors)                  
            .enter().append("stop") 
            .attr("offset", function(d,i) { return i/(compareColors.length-1); })   
            .attr("stop-color", function(d) { return d; });

        compareSvg.append("rect")
            .attr("class", "legendRect")
            .attr("x", legendMargin)
            .attr("y", 30)
            .attr("width", getLegendWidth())
            .attr("height", legendHeight)
            .style("fill", "url(#gradient-compare-colors)");
    

        var colorRangeCompare = d3.range(0, 1, 1.0 / (compareColors.length - 1));
        colorRangeCompare.push(1);
           
        var colorInterpolateCompare = d3.scaleLinear()
            .domain([comparisonMin,comparisonMax])
            .range([0,1]);

        compareSvg.selectAll(".legendStop.compare")
            .data(diffColors)
            .enter()
            .append("text")
            .attr("class", function(d,i){
                return "legendStop compare " + "lsCompare" + i
            })
            .attr("text-anchor", "middle")
            .attr("y", 20)
            .attr("x", function(d,i){
                return legendMargin + ((i*comparisonStep)/(comparisonMax)) * getLegendWidth()
            })
            .text(function(d,i){
                return legendPercent(comparisonMin + i*comparisonStep)
            })



        var ttPercent = d3.format(".1%")
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true
        });

        function updateMapTooltip(e, allSignif){
            // console.log(e.features[0].properties)
            d3.select("#mtt-container").style("display", "block")

            var coordinates = e.lngLat;
            var p = e.features[0].properties

            if(p["s_" + getBaselineMap()] == "TRUE" || allSignif){

                var repText = (p["d_" + getBaselineMap()] < 0) ? "underrepresented" : "overrepresented",
                    compText = (p["d_" + getBaselineMap()] < 0) ? "fewer" : "more",
                    geo1, geo2;
                if(getGeographyLevel() == "national"){
                    geo1 = "state"
                    geo2 = (p.m_disp == "District of Columbia") ? "The District of Columbia" : p.m_disp
                }
                else if(getGeographyLevel() == "state"){
                    geo1 = "county",
                    geo2 = p.m_disp
                }else{
                    geo1 = "tract"
                    geo2 = "This neighborhood"
                }
                d3.select("#mtt-title").html(p.m_disp)
                d3.select("#mtt-geo1").text(geo1)
                d3.select("#mtt-geo2").text(geo2)
                d3.select("#mtt-da_prop").text(ttPercent(p.da_prop))
                d3.select("#mtt-da_baseline").text(ttPercent(p["p_" + getBaselineMap()]))
                d3.selectAll(".mtt-baseline-text").html(getBaselineMapText(getBaselineMap()).toLowerCase())
                d3.select("#mtt-da_rep").html(ttPercent(p["d_" + getBaselineMap()]))
                d3.select("#mtt-rep_text").text(repText)
                d3.select("#mtt-compText").text(compText)
                d3.select("#mtt-da_takeaway").text(ttPercent(Math.abs(p["d_" + getBaselineMap()])).replace("%",""))

                d3.select("#mtt-data").style("display", "block")
                d3.select("#mtt-no_sig").style("display","none")


            }else{

                d3.select("#mtt-data").style("display", "none")
                d3.select("#mtt-no_sig").style("display","block")     

                d3.select("#pointUp")
                    .style("display", "block")
                    .transition()
                    .style("left", (getLegendWidth() + 54) + "px")
                d3.select("#pointUpText").text("")

                d3.select("#mtt-title").html(p.m_disp)

            }

        }

         
        diffMap.on('mousemove', 'diffLayer', function(e) {

            diffMap.getCanvas().style.cursor = 'pointer';
            var coordinates = e.lngLat;
            var p = e.features[0].properties
            
            var colors = e.features[0].layer.paint["fill-color"][2]
            var diffVal = p["d_" + getBaselineMap()]
            var diffColor, textColor;

            for(var i = 3; i < colors.length; i+= 2){
                if(diffVal == colors[3]){
                    diffColor = colors[4]
                    textColor = "#ffffff"
                    break;
                }
                else if(i == colors.length - 2){
                    diffColor = colors[colors.length - 1]
                    textColor =  "#353535";
                    break
                }
                else if(diffVal > colors[i] && diffVal <= colors[i+2]){
                    diffColor = d3.interpolateRgb(colors[i+1], colors[i+3])( (diffVal - colors[i])/(colors[i+2] - colors[i]))
                    colors[i+1]
                    textColor = (i <= 5 || i >= 15 ) ? "#fff" : "#353535"
                    break;
                }
            }

            var rangeMouse = getRange(getBaselineMap(), bounds, "diff"),
                mouseMax = rangeMouse[1];

            d3.select("#pointUp")
                .style("display", "block")
                .transition()
                .style("left", function(){
                    return (getLegendWidth() * (mouseMax + diffVal) / (2*mouseMax)) + "px"
                })
            d3.select("#pointUpText").text(ttPercent(diffVal))

            updateMapTooltip(e, false)
            
            d3.transition().select("#mtt-background").style("background", diffColor).style("top",(60 + d3.select(".mtt-baseline-text").node().getBoundingClientRect().height) + "px").style("height", "34px")
            d3.transition().selectAll(".mtt-data-row").style("color", "#353535")
            d3.transition().select(".mtt-data-row.r3").style("color", textColor)

        }); 
         
        diffMap.on('mouseleave', 'diffLayer', function() {
            d3.select("#mtt-container").style("display", "none")

            diffMap.getCanvas().style.cursor = '';

            d3.select("#pointUp")
                .style("display", "none")
        });







        baselineMap.on('mousemove', 'baselineLayer', function(e) {
            baselineMap.getCanvas().style.cursor = 'pointer';
            var coordinates = e.lngLat;
            var p = e.features[0].properties

            var colors = e.features[0].layer.paint["fill-color"]
            var baselineVal = p["p_" + getBaselineMap()]
            var baselineColor;
            for(var i = 3; i <= colors.length; i+= 2){
                if(baselineVal == colors[3]){
                    baselineColor = colors[4]
                    textColor = "#353535"
                    break;
                }
                else if(i == colors.length - 2){
                    baselineColor = colors[colors.length - 1]
                    textColor =  "#fff";
                    break
                }
                else if(baselineVal > colors[i] && baselineVal <= colors[i+2]){
                    baselineColor = d3.interpolateRgb(colors[i+1], colors[i+3])( (baselineVal - colors[i])/(colors[i+2] - colors[i]))
                    colors[i+1]
                    textColor = (i >= 11) ? "#fff" : "#353535"
                    break;
                }
            }

            updateMapTooltip(e, true)

            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverBaseline",true)

            var rangeMouseBaseline = getRange(getBaselineMap(), bounds, "compare"),
                mouseMaxBaseline = rangeMouseBaseline[1];

            d3.select("#pointUp")
                .style("display", "block")
                .transition()
                .style("left", function(){
                    return (getLegendWidth() * (baselineVal) / (mouseMaxBaseline)) + "px"
                })
            d3.select("#pointUpText").text(ttPercent(baselineVal))

            var hB = (d3.select(".mtt-baseline-text").node().getBoundingClientRect().height > 30) ? "50px" : "34px"
            d3.transition().select("#mtt-background").style("background", baselineColor).style("top","47px").style("height", hB)
            d3.transition().selectAll(".mtt-data-row").style("color", "#353535")
            d3.transition().select(".mtt-data-row.r2").style("color", textColor)

        }); 
         
        baselineMap.on('mouseleave', 'baselineLayer', function() {
            baselineMap.getCanvas().style.cursor = '';
            
            d3.select("#mtt-container").style("display", "none")

            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverBaseline",false)

            d3.select("#pointUp")
                .style("display", "none")
        });




        dataMap.on('mousemove', 'dataLayer', function(e) {
            dataMap.getCanvas().style.cursor = 'pointer';
            var coordinates = e.lngLat;
            var p = e.features[0].properties

            var colors = e.features[0].layer.paint["fill-color"]
            var dataVal = p["da_prop"]
            var dataColor;


            for(var i = 3; i < colors.length; i+= 2){
                if(dataVal == colors[3]){
                    dataColor = colors[4]
                    textColor = "#353535"
                    break;
                }
                else if(i == colors.length - 2){
                    dataColor = colors[colors.length - 1]
                    textColor = "#fff";
                    break
                }
                else if(dataVal >= colors[i] && dataVal < colors[i+2]){
                    dataColor = d3.interpolateRgb(colors[i+1], colors[i+3])( (dataVal - colors[i])/(colors[i+2] - colors[i]))
                    colors[i+1]
                    textColor = (i >= 11) ? "#fff" : "#353535"
                    break;
                }
            }

            updateMapTooltip(e, true)


            var rangeMouseData = getRange(getBaselineMap(), bounds, "compare"),
                mouseMaxData = rangeMouseData[1];

            d3.select("#pointUp")
                .style("display", "block")
                .transition()
                .style("left", function(){
                    return (getLegendWidth() * (dataVal) / (mouseMaxData)) + "px"
                })
            d3.select("#pointUpText").text(ttPercent(dataVal))
            
            d3.transition().select("#mtt-background").style("background", dataColor).style("top","17px").style("height", "34px")
            d3.transition().selectAll(".mtt-data-row").style("color", "#353535")
            d3.transition().select(".mtt-data-row.r1").style("color", textColor)

        }); 
         
        dataMap.on('mouseleave', 'dataLayer', function() {
            dataMap.getCanvas().style.cursor = '';
            
            d3.select("#mtt-container").style("display", "none")

            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverData",false)

            d3.select("#pointUp")
                .style("display", "none")
        });



        d3.select(".mapboxgl-compare .compare-swiper-vertical")
            .classed(getParams().baseline, true)

        $('#baselineSelectMap')
            .val(baseline)
            .selectmenu({
                create: function(event, d){
                    d3.select("#baselineSelectMap-button").classed(getParams().baseline, true)
                },
                change: function(event, d){

                    d3.select("#controlBaselineName").text(getBaselineMapText(d.item.value))

                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("pop",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("pov2",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("pov",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("int",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("cbr",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("sen",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("chi",false)


                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed(d.item.value, true)


                    d3.select(".tt-text.baseline").html("of the city's " + getBaselineMapText(d.item.value))
                    var rangeComparison = getRange(d.item.value, bounds, "compare")

                    var comparisonMin = rangeComparison[0],
                        comparisonMax = rangeComparison[1],
                        comparisonStep = (comparisonMax - comparisonMin)/MAP_BINS

                    baselineMap.setPaintProperty("baselineLayer", 
                        'fill-color', [
                            "interpolate",
                            ["linear"],
                            ["get", "p_" + d.item.value],
                            comparisonMin,
                            "#dcedd9",
                            comparisonMin + comparisonStep,
                            "#bcdeb4",
                            comparisonMin + comparisonStep*2,
                            "#98cf90",
                            comparisonMin + comparisonStep*3,
                            "#78c26d",
                            comparisonMin + comparisonStep*4,
                            "#55b748",
                            comparisonMin + comparisonStep*5,
                            "#408941",
                            comparisonMin + comparisonStep*6,
                            "#2c5c2d",
                            comparisonMin + comparisonStep*7,
                            "#1a2e19"
                        ]
                    );

                    dataMap.setPaintProperty("dataLayer", 
                        'fill-color', [
                            "interpolate",
                            ["linear"],
                            ["get", "da_prop"],
                            comparisonMin,
                            "#dcedd9",
                            comparisonMin + comparisonStep,
                            "#bcdeb4",
                            comparisonMin + comparisonStep*2,
                            "#98cf90",
                            comparisonMin + comparisonStep*3,
                            "#78c26d",
                            comparisonMin + comparisonStep*4,
                            "#55b748",
                            comparisonMin + comparisonStep*5,
                            "#408941",
                            comparisonMin + comparisonStep*6,
                            "#2c5c2d",
                            comparisonMin + comparisonStep*7,
                            "#1a2e19"
                        ]
                    );

                    for(var i = 0; i < 9; i++){
                        d3.select(".lsCompare" + i)
                            .text(legendPercent(comparisonMin + i*comparisonStep))
                    }

                    var rangeDiff = getRange(d.item.value, bounds, "diff")

                    var diffMin = rangeDiff[0],
                        diffMax = rangeDiff[1],
                        diffStep = diffMax/4

                    for(var i = 0; i < 9; i++){
                        d3.select(".lsDiff" + i)
                            .text(legendPercent(diffMin + i*diffStep))
                    }


                    diffMap.setPaintProperty("diffLayer", 
                        'fill-color', [
                            "case",
                            ["==",['string', ['get', 's_' + d.item.value]],"TRUE"],
                                [
                                    "interpolate",
                                    ["linear"],
                                    ["get", "d_" + d.item.value],
                                    diffMin,
                                    "#ca5800",
                                    diffMin + diffStep,
                                    "#fdbf11",
                                    diffMin + diffStep*2,
                                    "#fdd870",
                                    diffMin + diffStep*3,
                                    "#fff2cf",
                                    diffMin + diffStep*4,
                                    "#ffffff",
                                    diffMin + diffStep*5,
                                    "#cfe8f3",
                                    diffMin + diffStep*6,
                                    "#73bfe2",
                                    diffMin + diffStep*7,
                                    "#1696d2",
                                    diffMin + diffStep*8,
                                    "#0a4c6a"
                                ]
                                
                            ,
                            "#9d9d9d"
                        ]
                    ); 

                    
                }
            });
            // d3.select("#mapComparison").style("display","none")

    })

}