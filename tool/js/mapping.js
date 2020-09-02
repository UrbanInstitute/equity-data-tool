mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';


d3.selectAll(".controlContainer").on("click", function(){
    d3.selectAll(".controlContainer").classed("active", false)
    d3.select(this).classed("active", true)

    if(d3.select(this).classed("diff")){
        d3.select("#diffMap")
            .transition()
            .duration(1000)
            .style("margin-top", "0px")
        d3.select(".mapLegend.diff")
            .transition()
            .duration(1000)
            .style("margin-top", "0px")
    }else{
        d3.select("#diffMap")
            .transition()
            .duration(1000)
            .style("margin-top", -1*getMapHeight() + "px")
        d3.select(".mapLegend.diff")
            .transition()
            .duration(1000)
            .style("margin-top", -1*MAP_LEGEND_HEIGHT + "px")
    }
})


function getRange(baseline, bounds, mapType){
        var baselineMin = bounds[baseline + "_prop_min"],
            baselineMax = bounds[baseline + "_prop_max"],
            dataMin = bounds["data_prop_min"],
            dataMax = bounds["data_prop_max"],
            diffMin = bounds["diff_" + baseline + "_min"],
            diffMax = bounds["diff_" + baseline + "_max"],
            comparisonMin = Math.min(baselineMin, dataMin),
            comparisonMax = Math.max(baselineMax, dataMax),
            diffBound = Math.max(Math.abs(diffMin), diffMax)
        
        if(mapType == "compare"){
            return [comparisonMin, comparisonMax]
        }else{
            return [-diffBound, diffBound]
        }
}



function drawMaps(bbox, geojsonData, bounds){
    d3.selectAll(".mapboxgl-canvas").remove()
    d3.selectAll(".mapboxgl-canary").remove()
    d3.selectAll(".mapboxgl-control-container").remove()
    d3.selectAll(".mapboxgl-popup").remove()
    d3.selectAll(".mapboxgl-canvas-container").remove()
    d3.selectAll(".mapboxgl-compare").remove()

    
    var baselineMap = new mapboxgl.Map({
        container: 'baselineMap',
        style: 'mapbox://styles/urbaninstitute/ckecx3n9l2npi1aql5avokshb/draft',
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
        attributionControl: false
    });

    var dataMap = new mapboxgl.Map({
        container: 'dataMap',
        style: 'mapbox://styles/urbaninstitute/ckecx3n9l2npi1aql5avokshb/draft',
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
        attributionControl: false
    });

    var diffMap = new mapboxgl.Map({
        container: 'diffMap',
        style: 'mapbox://styles/urbaninstitute/ckecx3n9l2npi1aql5avokshb/draft',
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
        attributionControl: false
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




    var baseline = getParams().baseline

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
                ["get", "data_prop"],
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
                ["get", baseline + "_prop"],
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

        var diffMin = rangeDiff[0],
            diffMax = rangeDiff[1],
            diffStep = diffMax/4
        diffMap.addLayer({
            'id': 'diffLayer',
            'type': 'fill',
            'source': 'diffSource',
            'paint': {
            'fill-outline-color': "#696969", 
            'fill-color': [
                "case",
                ["==",['string', ['get', 'sig_diff_' + baseline]],"TRUE"],
                    [
                        "interpolate-hcl",
                        ["linear"],
                        ["get", "diff_" + baseline],
                        diffMin,
                        "#ca5800",
                        diffMin + diffStep,
                        "#fdbf11",
                        diffMin + diffStep*2,
                        "#fdd870",
                        diffMin + diffStep*3,
                        "#fff2cf",
                        diffMin + diffStep*4,
                        "#d5d5d4",
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
        var diffColors = ["#ca5800","#fdbf11","#fdd870","#fff2cf","#d5d5d4","#cfe8f3","#73bfe2","#1696d2","#0a4c6a"]
        var compareColors = ["#DCEDD9","#BCDEB4","#98CF90","#78C26D","#55B748","#408941","#2C5C2D","#1A2E19"]


        var legendWidth = 400,
            legendHeight = 20,
            legendMargin = 18;

        d3.selectAll(".mapLegend").selectAll("svg").remove()
        d3.selectAll(".mapLegend").selectAll("div").remove()

        var diffSvg = d3.select(".mapLegend.diff").append("svg")
            .attr("width", legendWidth + 2*legendMargin)
            .attr("height", legendHeight + 50)
        
        var diffDefs = diffSvg.append("defs")

        var diffNA = d3.select(".mapLegend.diff")
            .append("div")
            .attr("id", "diffNA")

        diffNA.append("div")
            .attr("id", "diffNAText")
            .text("No significant difference")
        diffNA.append("div")
            .attr("id", "diffNARect")
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
            .attr("width", legendWidth)
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
                return legendMargin + ((i*diffStep)/(2*diffMax)) * legendWidth
            })
            .text(function(d,i){
                return legendPercent(diffMin + i*diffStep)
            })


        var compareSvg = d3.select(".mapLegend.compare").append("svg")
            .attr("width", legendWidth + 2*legendMargin)
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
            .attr("width", legendWidth)
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
                return legendMargin + ((i*comparisonStep)/(comparisonMax)) * legendWidth
            })
            .text(function(d,i){
                return legendPercent(comparisonMin + i*comparisonStep)
            })



        var ttPercent = d3.format(".2%")
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
         
        diffMap.on('mousemove', 'diffLayer', function(e) {

            diffMap.getCanvas().style.cursor = 'pointer';
            var coordinates = e.lngLat;
            var p = e.features[0].properties
            
            var colors = e.features[0].layer.paint["fill-color"][2]
            var diffVal = p["diff_" + getBaseline()]
            var diffColor, textColor;

            for(var i = 3; i < colors.length; i+= 2){
                if(diffVal > colors[i] && diffVal <= colors[i+2]){
                    diffColor = d3.interpolateRgb(colors[i+1], colors[i+3])( (diffVal - colors[i])/(colors[i+2] - colors[i]))
                    colors[i+1]
                    textColor = (i <= 5 || i >= 15 ) ? "#fff" : "#353535"
                    break;
                }
            }

            if(p["sig_diff_" + getBaseline()] == "TRUE"){

                var rangeMouse = getRange(getBaseline(), bounds, "diff"),
                    mouseMax = rangeMouse[1];


                d3.select("#pointUp")
                    .style("display", "block")
                    .transition()
                    .style("left", function(){
                        return (legendWidth * (mouseMax + diffVal) / (2*mouseMax)) + "px"
                    })
                d3.select("#pointUpText").text(ttPercent(diffVal))


                var repText = (p["diff_" + getBaseline()] < 0) ? "underrepresented" : "overrepresented"
                var description =   "<div class = 'tt-name'>" + p.NAME + "</div>" + 
                                    "<div class = 'tt-contains'>" + "This tract contains:" + "</div>" + 
                                    "<div class = 'tt-row'>" +
                                        "<span class = 'tt-val data'>" + ttPercent(p.data_prop) + "</span>" +
                                        "<div class = 'tt-text data'>" + " of your data points" + "</div>" + 
                                    "</div>" + 
                                    "<div class = 'tt-row'>" +
                                        "<span class = 'tt-val baseline'> <span>-</span>" + ttPercent(p[getBaseline() + "_prop"]) + "</span>" +
                                        "<div class = 'tt-text baseline'>" + " of the city's " + getBaselineText(getBaseline()).toLowerCase() + "</div>" + 
                                    "</div>" +
                                    "<div class = 'tt-diff-row' style='background-color:" + diffColor +"; color:" + textColor+ ";' >" +
                                        "<span class = 'tt-val diff'>" + ttPercent(p["diff_" + getBaseline()]) + "</span>" +
                                        "<div class = 'tt-text diff'>" + repText + "</div>" + 
                                    "</div>"
            }else{

                d3.select("#pointUp")
                    .style("display", "block")
                    .transition()
                    .style("left", "454px")
                d3.select("#pointUpText").text("")


                var description = "<div class = 'tt-name'>" + p.NAME + "</div>" + 
                                  "<div class = 'tt-noSigDiff'>" + "There is not a statically significant difference between your data and the city's " + getBaselineText(getBaseline()).toLowerCase() + "</div>"
            }


            popup
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(diffMap);

            if(d3.select(".mapboxgl-popup").classed("mapboxgl-popup-anchor-bottom") && p["sig_diff_" + getBaseline()] == "TRUE"){
                d3.select(".mapboxgl-popup-tip").style("border-top-color", diffColor)
            }
            else{
                d3.select(".mapboxgl-popup-tip").style("border-top-color", "#fff")
            }

        }); 
         
        diffMap.on('mouseleave', 'diffLayer', function() {
            diffMap.getCanvas().style.cursor = '';
            popup.remove();

            d3.select("#pointUp")
                .style("display", "none")
        });







        baselineMap.on('mousemove', 'baselineLayer', function(e) {
            baselineMap.getCanvas().style.cursor = 'pointer';
            var coordinates = e.lngLat;
            var p = e.features[0].properties

            var colors = e.features[0].layer.paint["fill-color"]
            var baselineVal = p[getBaseline() + "_prop"]
            var baselineColor;

            for(var i = 3; i < colors.length; i+= 2){
                if(i == colors.length - 2){
                    baselineColor = colors[colors.length - 1]
                    break
                }
                else if(baselineVal > colors[i] && baselineVal <= colors[i+2]){
                    baselineColor = d3.interpolateRgb(colors[i+1], colors[i+3])( (baselineVal - colors[i])/(colors[i+2] - colors[i]))
                    colors[i+1]
                    break;
                }
            }

            var description =   "<div class = 'tt-name'>" + p.NAME + "</div>" + 
                                "<div class = 'tt-contains slider'>" + "This tract contains " +
                                    "<span class = 'tt-val slider baseline' style='border-bottom: 5px solid " + baselineColor + "'>" + ttPercent(p[getBaseline() + "_prop"]) + "</span>" +
                                    "<span class = 'tt-text baseline slider'>" + " of the city's " + getBaselineText(getBaseline()).toLowerCase() + "</div>" + 
                                "</div>"


            popup
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(baselineMap);

            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverBaseline",true)

            var rangeMouseBaseline = getRange(getBaseline(), bounds, "compare"),
                mouseMaxBaseline = rangeMouseBaseline[1];

            d3.select("#pointUp")
                .style("display", "block")
                .transition()
                .style("left", function(){
                    return (legendWidth * (baselineVal) / (mouseMaxBaseline)) + "px"
                })
            d3.select("#pointUpText").text(ttPercent(baselineVal))

        }); 
         
        baselineMap.on('mouseleave', 'baselineLayer', function() {
            baselineMap.getCanvas().style.cursor = '';
            popup.remove();
            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverBaseline",false)

            d3.select("#pointUp")
                .style("display", "none")
        });




        dataMap.on('mousemove', 'dataLayer', function(e) {
            dataMap.getCanvas().style.cursor = 'pointer';
            var coordinates = e.lngLat;
            var p = e.features[0].properties

            var colors = e.features[0].layer.paint["fill-color"]
            var dataVal = p["data_prop"]
            var dataColor;


            for(var i = 3; i < colors.length; i+= 2){
                if(i == colors.length - 2){
                    dataColor = colors[colors.length - 1]
                    break
                }
                else if(dataVal >= colors[i] && dataVal < colors[i+2]){
                    dataColor = d3.interpolateRgb(colors[i+1], colors[i+3])( (dataVal - colors[i])/(colors[i+2] - colors[i]))
                    colors[i+1]
                    break;
                }
            }

            var description =   "<div class = 'tt-name'>" + p.NAME + "</div>" + 
                                "<div class = 'tt-contains slider'>" + "This tract contains " +
                                    "<span class = 'tt-val slider data' style='border-bottom: 5px solid " + dataColor + "'>" + ttPercent(p["data_prop"]) + "</span>" +
                                    "<span class = 'tt-text data slider'>" + " of your data points</div>" + 
                                "</div>"


            popup
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(dataMap);

            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverData",true)

            var rangeMouseData = getRange(getBaseline(), bounds, "compare"),
                mouseMaxData = rangeMouseData[1];

            d3.select("#pointUp")
                .style("display", "block")
                .transition()
                .style("left", function(){
                    return (legendWidth * (dataVal) / (mouseMaxData)) + "px"
                })
            d3.select("#pointUpText").text(ttPercent(dataVal))

        }); 
         
        dataMap.on('mouseleave', 'dataLayer', function() {
            dataMap.getCanvas().style.cursor = '';
            popup.remove();
            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverData",false)

            d3.select("#pointUp")
                .style("display", "none")
        });



        d3.select(".mapboxgl-compare .compare-swiper-vertical")
            .classed(getParams().baseline, true)

        $('#baselineSelect')
            .selectmenu({
                create: function(event, d){
                    d3.select("#baselineSelect-button").classed(getParams().baseline, true)
                },
                change: function(event, d){

                    d3.select("#controlBaselineName").text(getBaselineText(d.item.value))

                    d3.select("#baselineSelect-button").classed("pop",false)
                    d3.select("#baselineSelect-button").classed("under_poverty_line",false)
                    d3.select("#baselineSelect-button").classed("no_bband",false)
                    d3.select("#baselineSelect-button").classed("foreign_born",false)

                    d3.select("#baselineSelect-button").classed(d.item.value, true)


                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("pop",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("under_poverty_line",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("no_bband",false)
                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("foreign_born",false)

                    d3.select(".mapboxgl-compare .compare-swiper-vertical").classed(d.item.value, true)


                    d3.select(".tt-text.baseline").html("of the city's " + getBaselineText(d.item.value))
                    var rangeComparison = getRange(d.item.value, bounds, "compare")

                    var comparisonMin = rangeComparison[0],
                        comparisonMax = rangeComparison[1],
                        comparisonStep = (comparisonMax - comparisonMin)/MAP_BINS

                    baselineMap.setPaintProperty("baselineLayer", 
                        'fill-color', [
                            "interpolate",
                            ["linear"],
                            ["get", d.item.value + "_prop"],
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
                            ["get", "data_prop"],
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
                            ["==",['string', ['get', 'sig_diff_' + d.item.value]],"TRUE"],
                                [
                                    "interpolate",
                                    ["linear"],
                                    ["get", "diff_" + d.item.value],
                                    diffMin,
                                    "#ca5800",
                                    diffMin + diffStep,
                                    "#fdbf11",
                                    diffMin + diffStep*2,
                                    "#fdd870",
                                    diffMin + diffStep*3,
                                    "#fff2cf",
                                    diffMin + diffStep*4,
                                    "#d5d5d4",
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