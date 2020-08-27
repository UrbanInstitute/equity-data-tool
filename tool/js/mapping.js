mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';


d3.selectAll(".controlContainer").on("click", function(){
    d3.selectAll(".controlContainer").classed("active", false)
    d3.select(this).classed("active", true)

    if(d3.select(this).classed("diff")){
        d3.select("#diffMap")
            .transition()
            .style("margin-top", "0px")
        // d3.select("#mapComparison").style("display", "none")
    }else{
        d3.select("#diffMap")
            .transition()
            .style("margin-top", -1*getMapHeight() + "px")
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

    var baselineMap = new mapboxgl.Map({
        container: 'baselineMap',
        style: 'mapbox://styles/urbaninstitute/ckecx3n9l2npi1aql5avokshb/draft',
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]])
    });

    var dataMap = new mapboxgl.Map({
        container: 'dataMap',
        style: 'mapbox://styles/urbaninstitute/ckecx3n9l2npi1aql5avokshb/draft',
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]])
    });

    var diffMap = new mapboxgl.Map({
        container: 'diffMap',
        style: 'mapbox://styles/urbaninstitute/ckecx3n9l2npi1aql5avokshb/draft',
        bounds: new mapboxgl.LngLatBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]])
    });


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
                "#cfe8f3",
                comparisonMin + comparisonStep,
                "#a2d4ec",
                comparisonMin + comparisonStep*2,
                "#73bfe2",
                comparisonMin + comparisonStep*3,
                "#46abdb",
                comparisonMin + comparisonStep*4,
                "#1696d2",
                comparisonMin + comparisonStep*5,
                "#12719e",
                comparisonMin + comparisonStep*6,
                "#0a4c6a",
                comparisonMin + comparisonStep*7,
                "#062635"
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
                "#cfe8f3",
                comparisonMin + comparisonStep,
                "#a2d4ec",
                comparisonMin + comparisonStep*2,
                "#73bfe2",
                comparisonMin + comparisonStep*3,
                "#46abdb",
                comparisonMin + comparisonStep*4,
                "#1696d2",
                comparisonMin + comparisonStep*5,
                "#12719e",
                comparisonMin + comparisonStep*6,
                "#0a4c6a",
                comparisonMin + comparisonStep*7,
                "#062635"
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
                ["==",['boolean', ['get', 'sig_diff_' + baseline]],true],
                    [
                        "interpolate",
                        ["linear"],
                        ["get", "diff_" + baseline],
                        diffMin,
                        "#6e1614",
                        diffMin + diffStep,
                        "#db2b27",
                        diffMin + diffStep*2,
                        "#e9807d",
                        diffMin + diffStep*3,
                        "#f8d5d4",
                        diffMin + diffStep*4,
                        "#d5d5d4",
                        diffMin + diffStep*5,
                        "#dcedd9",
                        diffMin + diffStep*6,
                        "#98cf90",
                        diffMin + diffStep*7,
                        "#55b748",
                        diffMin + diffStep*8,
                        "#2c5c2d"
                    ]
                    
                ,
                "#9d9d9d"
            ]
            ,
            'fill-opacity': 1
            }
        }, "road");        

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

            console.log(p["sig_diff_" + getBaseline()])

            for(var i = 3; i < colors.length; i+= 2){
                if(diffVal > colors[i] && diffVal <= colors[i+2]){
                    diffColor = d3.interpolateRgb(colors[i+1], colors[i+3])( (diffVal - colors[i])/(colors[i+2] - colors[i]))
                    colors[i+1]
                    textColor = (i <= 7 || i >= 15 ) ? "#fff" : "#353535"
                    break;
                }
            }

            if(p["sig_diff_" + getBaseline()]){
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
                var description = "<div class = 'tt-name'>" + p.NAME + "</div>" + 
                                  "<div class = 'tt-noSigDiff'>" + "There is not a statically significant difference between your data and the city's " + getBaselineText(getBaseline()).toLowerCase() + "</div>"
            }


            popup
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(diffMap);

            if(d3.select(".mapboxgl-popup").classed("mapboxgl-popup-anchor-bottom") && p["sig_diff_" + getBaseline()]){
                d3.select(".mapboxgl-popup-tip").style("border-top-color", diffColor)
            }
            else{
                d3.select(".mapboxgl-popup-tip").style("border-top-color", "#fff")
            }

        }); 
         
        diffMap.on('mouseleave', 'diffLayer', function() {
            diffMap.getCanvas().style.cursor = '';
            popup.remove();
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

        }); 
         
        baselineMap.on('mouseleave', 'baselineLayer', function() {
            baselineMap.getCanvas().style.cursor = '';
            popup.remove();
            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverBaseline",false)
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

        }); 
         
        dataMap.on('mouseleave', 'dataLayer', function() {
            dataMap.getCanvas().style.cursor = '';
            popup.remove();
            d3.select(".mapboxgl-compare .compare-swiper-vertical").classed("hoverData",false)
        });



        d3.select(".mapboxgl-compare .compare-swiper-vertical")
            .classed(getParams().baseline, true)

        $('#baselineSelect')
            .selectmenu({
                create: function(event, d){
                    d3.select("#baselineSelect-button").classed(getParams().baseline, true)
                },
                change: function(event, d){

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
                            "#cfe8f3",
                            comparisonMin + comparisonStep,
                            "#a2d4ec",
                            comparisonMin + comparisonStep*2,
                            "#73bfe2",
                            comparisonMin + comparisonStep*3,
                            "#46abdb",
                            comparisonMin + comparisonStep*4,
                            "#1696d2",
                            comparisonMin + comparisonStep*5,
                            "#12719e",
                            comparisonMin + comparisonStep*6,
                            "#0a4c6a",
                            comparisonMin + comparisonStep*7,
                            "#062635"
                        ]
                    );

                    dataMap.setPaintProperty("dataLayer", 
                        'fill-color', [
                            "interpolate",
                            ["linear"],
                            ["get", "data_prop"],
                            comparisonMin,
                            "#cfe8f3",
                            comparisonMin + comparisonStep,
                            "#a2d4ec",
                            comparisonMin + comparisonStep*2,
                            "#73bfe2",
                            comparisonMin + comparisonStep*3,
                            "#46abdb",
                            comparisonMin + comparisonStep*4,
                            "#1696d2",
                            comparisonMin + comparisonStep*5,
                            "#12719e",
                            comparisonMin + comparisonStep*6,
                            "#0a4c6a",
                            comparisonMin + comparisonStep*7,
                            "#062635"
                        ]
                    );


                    var rangeDiff = getRange(d.item.value, bounds, "diff")

                    var diffMin = rangeDiff[0],
                        diffMax = rangeDiff[1],
                        diffStep = diffMax/4

                    diffMap.setPaintProperty("diffLayer", 
                        'fill-color', [
                            "case",
                            ["==",['boolean', ['get', 'sig_diff_' + d.item.value]],true],
                                [
                                    "interpolate",
                                    ["linear"],
                                    ["get", "diff_" + d.item.value],
                                    diffMin,
                                    "#6e1614",
                                    diffMin + diffStep,
                                    "#db2b27",
                                    diffMin + diffStep*2,
                                    "#e9807d",
                                    diffMin + diffStep*3,
                                    "#f8d5d4",
                                    diffMin + diffStep*4,
                                    "#d5d5d4",
                                    diffMin + diffStep*5,
                                    "#dcedd9",
                                    diffMin + diffStep*6,
                                    "#98cf90",
                                    diffMin + diffStep*7,
                                    "#55b748",
                                    diffMin + diffStep*8,
                                    "#2c5c2d"
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