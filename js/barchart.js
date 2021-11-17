

function updateBarChart(baseline){
    drawBarChart(d3.select("#rawBarData").datum(), "dynamic", baseline, getSelectedSubgeo(), function(){})
}



function drawBarChart(rawData, containerType, baseline, subgeo, callback){
    let clone = JSON.parse(JSON.stringify(rawData))
    d3.select("#rawBarData").datum(clone)

    var dataAll = d3.group(rawData, d => d.b_pop, d => d.c_var)
    var data = Array.from(dataAll.get(baseline))

    max = d3.max(data.map(d => d[1]).flat(), d => d.d_score)
    min = d3.min(data.map(d => d[1]).flat(), d => d.d_score)
    var x = getBarX(containerType, max, min)

    var margin = getBarMargins(containerType),
        width = getBarWidth(containerType)
    
    var geo = getGeographyLevel()
    // var height = (containerType == "dynamic") ? getBarHeight("dynamic") : getBarHeight("static", baseline)

    var containerSelector = (containerType == "dynamic") ? "#barChart" : "#barChartImage"
    d3.selectAll(containerSelector + " .chartRow").remove()

    // var padder = (containerType == "dynamic") ? BAR_ROW_HEIGHT : 80;
//     var svg = d3.select(containerSelector).append("svg")
//         .attr("id", containerSelector.replace("#","") + "Svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom + padder)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    data.sort(function(a,b){
        return b[1][0]["d_score"] - a[1][0]["d_score"];
    });

    d3.select("#barChartTopAxisContainer").selectAll("svg").remove()
    d3.select("#barChartTopAxisContainer")
        .append("svg")
        .attr("width", width - 410)
        .attr("height", 50)
        .append("g")
        .append("g")
        .attr("class","x axisTop")
        .attr("transform", "translate(0," + BAR_ROW_HEIGHT + ")")  
        .call(d3.axisTop(x).tickSize(-1*BAR_ROW_HEIGHT).tickSizeOuter(10).tickFormat(function(t){
            return t + "%"
        }));

    var row = d3.select(containerSelector)
        .style("width", width + "px")
        .selectAll(".chartRow")
        .data(data)
        .enter()
        .append("div")
        .attr("class", function(d, i){
            var parity = (i%2 == 0) ? "even" : "odd"
            return "chartRow " + parity
        })

    row.append("div")
        .attr("class","chartCatLabel")
        .html(function(d){
            return barCategories[d[0]]
        })

    row.append("div")
        .attr("class","chartToolTip")
        .html("")

    row.append("div")
        .attr("class","dotToolTip")
        .html("")

    var svg = row.append("svg")
        .attr("width", width - 410)
        .attr("height", BAR_ROW_HEIGHT)
        .append("g")
        // .data(function(rD, i){
        // 
        //         return rD[1]
        // })

    svg
        .append("g")
        .attr("class","x axis")
        // .attr("transform", "translate(0,50)")      
        .call(d3.axisTop(x).tickSize(-1*BAR_ROW_HEIGHT).tickSizeOuter(0).tickFormat(function(t){
            return ""
        }));
    


    if(geo == "county" || geo == "city"){
        svg.selectAll(".chartLineBG")
            .data(function(rD){
                return rD[1]
            })
            .enter()
            .append("line")
            .attr("data-fips", function(d){ return d.g_fips })
            .attr("class", function(d){
                var sigClass = (d.s_diff) ? " sig" : " insig",
                    subClass = " geo",
                    repClass = (d.d_score < 0) ? " underRep" : " overRep"
                return "chartLineBG chartLine " + d.c_var + " " + d.b_pop + " " + d.g + " " + "fips-" + d.g_fips + sigClass + subClass + repClass
            })
            .attr("x1", x(0))
            .attr("x2", function(d){return x(d.d_score)})
            .attr("y1", BAR_ROW_HEIGHT/2)
            .attr("y2", BAR_ROW_HEIGHT/2)

        svg.selectAll(".chartLineFG")
            .data(function(rD){ return rD[1]})
            .enter()
            .append("line")
            .attr("data-fips", function(d){ return d.g_fips })
            .attr("class", function(d){
                var sigClass = (d.s_diff) ? " sig" : " insig",
                    subClass = " geo",
                    repClass = (d.d_score < 0) ? " underRep" : " overRep"
                return "chartLineFG chartLine " + d.c_var + " " + d.b_pop + " " + d.g + " " + "fips-" + d.g_fips + sigClass + subClass + repClass
            })
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", BAR_ROW_HEIGHT/2)
            .attr("y2", BAR_ROW_HEIGHT/2)
            .attr("stroke", function(d){
                if(!d.s_diff) return "#9d9d9d"
                else return (d.d_score < 0) ? "#ca5800" : "#1696d2"
            })
            .transition()
            .duration(1000)
            .attr("x2", function(d){return x(d.d_score)})

    }

    svg.append("line")
        .attr("class", "y axis")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", 0)
        .attr("y2", BAR_ROW_HEIGHT)

    var chartDot = svg.selectAll(".chartDot")
        .data(function(rD){
            return rD[1]
        })
        .enter()
        .append("circle")
    
    chartDot.attr("data-fips", function(d){ return d.g_fips })
        .attr("class", function(d){
            var sigClass = (d.s_diff) ? " sig" : " insig",
                subClass = (d.g == getGeographyLevel()) ? " geo" : " subgeo",
                repClass = (d.d_score < 0) ? " underRep" : " overRep"
            return "chartDot " + d.c_var + " " + d.b_pop + " " + d.g + " " + "fips-" + d.g_fips + sigClass + subClass + repClass
        })
        .attr("cx", x(0))
        .attr("cy", BAR_ROW_HEIGHT/2)
        .attr("r", function(d){
            return (d.g == getGeographyLevel()) ? BAR_DOT_RADIUS_LARGE : BAR_DOT_RADIUS_SMALL
        })
        .attr("fill", function(d){
            if(d.g != getGeographyLevel()) return "rgba(255,255,255,.5)"
            else if(!d.s_diff) return "#9d9d9d"
            else return (d.d_score < 0) ? "#ca5800" : "#1696d2"
        })
        .attr("stroke", function(d){
            if(d.g == getGeographyLevel()) return "#fff"
            else if(!d.s_diff) return "#9d9d9d"
            else return (d.d_score < 0) ? "#ca5800" : "#1696d2"
        })
        .transition()
        .duration(1000)
        .delay(function(d,i){return i*20})
        .attr("cx", function(d){return x(d.d_score)})

    var barKeyLabelGeo, barKeyLabelSubgeo, subgeOpacity, barLegendWidth;
    if(geo == "national"){
        barKeyLabelGeo = "National";
        barKeyLabelSubgeo = "State";
        subgeOpacity = 1;
        barLegendWidth = "557px";
    }
    else if(geo == "state"){
        barKeyLabelGeo = "State";
        barKeyLabelSubgeo = "County";
        subgeOpacity = 1;
        barLegendWidth = "534px";
    }
    else if(geo == "county"){
        barKeyLabelGeo = "County";
        barKeyLabelSubgeo = "";
        subgeOpacity = 0;
    }
    else if(geo == "city"){
        barKeyLabelGeo = "City";
        barKeyLabelSubgeo = "";
        subgeOpacity = 0;
    }
    d3.selectAll(".barKeyLabelGeo").text(barKeyLabelGeo)
    d3.selectAll(".barKeyLabelSubgeo").text(barKeyLabelSubgeo)
    d3.selectAll(".barKeyDotSubgeo").style("opacity", subgeOpacity)
    d3.selectAll(".barKeyLabelSubgeo").style("opacity", subgeOpacity)
    d3.select("#barChartTopLegend").style("width", barLegendWidth)
    d3.select("#barChartTopMenuContainer").style("width", "calc(100% - " + barLegendWidth + ")")
    initBarMenu(baseline);

    if(geo == "national"){
        initSubgeoMenu("national", data[0][1].filter(o => o.g != "national").map(o => ["fips-" + o.g_fips, o.g_disp]), subgeo)
    }
    if(geo == "state"){
        initSubgeoMenu("state", data[0][1].filter(o => o.g != "state").map(o => ["fips-" + o.g_fips, o.g_disp]), subgeo)
    }

    if(geo == "state" || geo == "national"){
        d3.selectAll(".chartDot.overRep").raise()
        d3.selectAll(".chartDot.underRep").raise()
        d3.selectAll(".chartDot.geo").raise()
        d3.selectAll(".chartDot.clicked").raise()
    }
    



d3.selectAll(".tt-icon")
    .on("mouseover", function(){
        var ttText, ttTitle;
        var dtt = d3.select(this).attr("data-tt")
        if(dtt=="cbr"){
            ttText = "Households that pay more than 35 percent of their income on rent"
            ttTitle = "Cost-burdened renter households"
        }
        else if(dtt=="pov"){
            ttText = "Residents with income under the federal poverty level"
            ttTitle = "Residents with extremely low incomes"
        }
        else if(dtt=="pov2"){
            ttText = "Residents with income under 200 percent of the federal poverty level"
            ttTitle = "Residents with low incomes"
        }
        else if(dtt=="disparity"){
            var gtt,
                geo = getGeographyLevel();
            if(geo == "national") gtt = "States"
            else if(geo == "state") gtt = "Counties"
            else gtt = "Census tracts"

            ttText = gtt + " with positive disparity scores have more data points than we’d expect if resources were equitably distributed in accordance with your baseline. " + gtt + " with negative disparity scores have fewer."
            ttTitle = "Disparity score"
        }
        else if(dtt=="demographic"){
            ttText = "We compare the demographics in your chosen baseline with the demographics across the neighborhoods containing your data points. Overrepresented groups tend to have more access to data points than we’d expect; underrepresented groups have less."
            ttTitle = "Demographic distribution"
        }

        if(widthBelow(768) || widthBelow(500)){
            showMobileTT(ttTitle, ttText)
        }else{
            var tt = d3.select(this).append("div").attr("class", "tt-container")

            tt.append("div")
                .html(ttText)
        }

    })
    .on("mouseout", function(){
        d3.selectAll(".tt-container").remove()
    })




d3.selectAll(".chartRow")
    .on("mouseenter", function(rD){
        var geo = getGeographyLevel();
        var row = this;
        var H;
        var ttH = 120;

        if(geo == "national" || geo == "state"){
            var X = d3.select(this).select("svg").selectAll(".chartDot.subgeo").nodes().map(function(el){
                var d = d3.select(el).datum()
                if(d.length == 2){
                    var f = d3.select(el).attr("data-fips")
                    d = d[1].filter(function(o){ return String(o.g_fips) == String(f) })[0]
                }

                return x(d["d_score"])
            })
            // 

            var Y = dodge(X, 2*BAR_DOT_RADIUS_SMALL + 1)
            var fipsList = d3.select(row).select("svg").selectAll(".chartDot.subgeo").nodes().map(
                function(o){
                    return "fips-" + d3.select(o).attr("data-fips")
                }
            )


            var ymax = d3.max(Y)
            H = Math.max(ttH, ymax + BAR_ROW_HEIGHT/2 + BAR_DOT_RADIUS_SMALL * 6)

            var svgV = d3.select(this).select("svg")
            var dt = d3.select(this).select(".dotToolTip")
            
            let vYA = []
            var gX = +x(rD[1][0]["d_score"])
            d3.select(this).select("svg").selectAll(".chartDot.subgeo")
                .transition()
                .duration(1000)
                .attr("cy", function(d,i){
                    var sgX = +(x(d.d_score))
                    
                    if( (sgX > gX && gX + BAR_DOT_RADIUS_LARGE + 2*BAR_DOT_RADIUS_SMALL > sgX) ||
                        (sgX < gX && gX - BAR_DOT_RADIUS_LARGE - 2*BAR_DOT_RADIUS_SMALL < sgX)
                    ){
                        vYA.push(20 + Y[i] + BAR_DOT_RADIUS_LARGE + BAR_DOT_RADIUS_SMALL)
                        if(d3.select(this).classed("clicked") && getSelectedSubgeo().level != "region"){
                            dt.style("top", (20 + Y[i] + BAR_DOT_RADIUS_LARGE + BAR_DOT_RADIUS_SMALL - 11) + "px")
                        }
                        return 20 + Y[i] + BAR_DOT_RADIUS_LARGE + BAR_DOT_RADIUS_SMALL
                    }
                    else{
                        vYA.push(20 + Y[i])
                        if(d3.select(this).classed("clicked") && getSelectedSubgeo().level != "region"){
                            dt.style("top", (20 + Y[i] - 11) + "px")
                        }
                        return 20 + Y[i]
                    }
                })
                .attr("cx", function(d){
                    if(d.length == 2){
                        var f = d3.select(this).attr("data-fips")
                        d = d[1].filter(function(o){ return String(o.g_fips) == String(f) })[0]
                    }
                    return x(d.d_score)
                })

                fipsList.push("geo")
                X.push(d3.select(this).select("svg").select(".chartDot.geo").attr("cx"))
                vYA.push(d3.select(this).select("svg").select(".chartDot.geo").attr("cy"))
                updateVoronoi(svgV, X, vYA, fipsList, +svgV.attr("width"), H)


        }else{
            H = ttH;
        }
        
        d3.select(this).select("svg")
            .transition()
            .duration(1000)
            .attr("height", H)

        d3.select(row).select(".chartToolTip")
            .transition()
            .style("opacity",1)
        if(geo == "national" || geo == "state"){
            d3.select(row).select(".dotToolTip")
                .transition()
                .style("opacity",1)
        }
        d3.select(this)
            .transition()
            .duration(1000)
            .style("height", (H) + "px")

        d3.select(this).select("svg").select(".x.axis")
            .transition()
            .duration(1000)
                .call(d3.axisTop(x).tickSize(-1*( H )).tickSizeOuter(0).tickFormat(function(t){
                    return ""
                }));

        d3.select(this).select("svg").select(".y.axis")
            .transition()
            .duration(1000)
                .attr("y2", (H))


        highlightDefaultBarTooltip(d3.select(this).select(".chartDot").node(), false)

    })
    .on("mouseleave", function(){
        var row = this;
        d3.select(this).selectAll(".chartDot.subgeo")
            .transition()
            .duration(1000)
            .attr("cy", BAR_ROW_HEIGHT/2)

        d3.select(this).select("svg").selectAll(".voronoi").remove()
        d3.select(row).select(".chartToolTip")
            .transition()
            .style("opacity",0)
        d3.select(row).select(".dotToolTip")
            .transition()
            .style("opacity",0)
        d3.select(row).select(".chartDot.geo").classed("hover",false)
        d3.select(row).select(".chartLineBG").classed("hover",false)


        d3.select(this)
            .transition()
            .duration(1000)
            .style("height", BAR_ROW_HEIGHT + "px")
        d3.select(this).select("svg")
            .transition()
            .duration(1000)
            .attr("height", BAR_ROW_HEIGHT)
        d3.select(this).select("svg").select(".x.axis")
            .transition()
            .duration(1000)
                .call(d3.axisTop(x).tickSize(-1*BAR_ROW_HEIGHT).tickSizeOuter(0).tickFormat(function(t){
                    return ""
                }));
        d3.select(this).select("svg").select(".y.axis")
            .transition()
            .duration(1000)
                .attr("y2", BAR_ROW_HEIGHT)
    })



}



    function updateVoronoi(svg, X, Y, fips, vW, vH){

        svg.selectAll(".voronoi").remove()

        var vData = fips.map(function(d,i){
            return {"fips": fips[i], "vx": X[i], "vy": Y[i]}
        })

        var voronoi = d3.voronoi()
            .x(function(d) {
                return +d["vx"];
            })
            .y(function(d) {
                 return +d["vy"];
            })
            .extent([[d3.min(X) - 30,0],[d3.max(X) + 30,vH]]);


        var voronoiGroup = svg.append("g")
            .attr("class", "voronoi");
        voronoiGroup.selectAll("path")
            .data(voronoi.polygons(vData))
            .enter().append("path")
                .style("fill", "transparent")
                .style("stroke", "transparent")
                .attr("d", function(d) {return d ? "M" + d.join("L") + "Z" : null; })
        .on("mouseover", function(vD){
            var fips;
            if(typeof(vD.data.fips) == "undefined" || vD.data.fips == "fips-undefined"){
                fips = (d3.selectAll(".chartDot.clicked").nodes().length == 0) ? "fips-" + d3.select(".chartDot.geo").attr("data-fips") : "fips-" + d3.select(".chartDot.clicked").attr("data-fips")
            }else{
                fips = vD.data.fips
            }
            var el = svg.select(".chartDot." + fips).node(),
                d = d3.select(el).datum(),
                geo = getGeographyLevel()

            if(d.length == 2){
                d = d[1].filter(function(o){ return "fips-" + String(o.g_fips) == String(fips) })[0]
            }

            if(d3.select(el).classed("clicked")){
                if(getSelectedSubgeo().hasOwnProperty("level") && getSelectedSubgeo().level == "region"){
                    d3.select(el).classed("forceHover", true)
                    highlightSubgeo(el, d)       
                }else return false
            }
            if(geo == "state" || geo == "national") highlightSubgeo(el, d)

        })
        .on("mouseout", function(vD){
            var fips;
            if(typeof(vD.data.fips) == "undefined" || vD.data.fips == "fips-undefined"){
                fips = (d3.selectAll(".chartDot.clicked").nodes().length == 0) ? "fips-" + d3.select(".chartDot.geo").attr("data-fips") : "fips-" + d3.select(".chartDot.clicked").attr("data-fips")
            }else{
                fips = vD.data.fips
            }
            var el = svg.select(".chartDot." + fips).node(),
                d = d3.select(el).datum(),
                geo = getGeographyLevel()

            if(d.length == 2){
                d = d[1].filter(function(o){ return "fips-" + String(o.g_fips) == fips })[0]
            }

            d3.selectAll(".forceHover").classed("forceHover", false)
            if(geo == "state" || geo == "national") highlightDefaultBarTooltip(el, true)
        })
        .on("click", function(vD){
            var fips;
            if(typeof(vD.data.fips) == "undefined" || vD.data.fips == "fips-undefined"){
                fips = (d3.selectAll(".chartDot.clicked").nodes().length == 0) ? "fips-" + d3.select(".chartDot.geo").attr("data-fips") : "fips-" + d3.select(".chartDot.clicked").attr("data-fips")
            }else{
                fips = vD.data.fips
            }
            var el = svg.select(".chartDot." + fips).node(),
                d = d3.select(el).datum(),
                geo = getGeographyLevel()

            if(d.length == 2){
                d = d[1].filter(function(o){ return "fips-" + String(o.g_fips) == fips })[0]
            }

            if(geo == "city" || geo == "county") return false
            if(d3.select(el).classed("geo")) return false
            if(d3.select(el).classed("clicked")) deClickSubgeo()
            else clickSubgeo(fips)
        })
        
    }

function highlightDefaultBarTooltip(element, moveTT){
    var geo = getGeographyLevel()
    var selectedSubgeo = (geo == "national" || geo == "state") ? getSelectedSubgeo() : ""
    var d,el;
    if(selectedSubgeo == "" || selectedSubgeo.level == "region"){
        el = d3.select(element.parentNode.parentNode.parentNode).select(".chartDot.geo")
        d = el.datum()
        d3.selectAll(".chartDot.geo").raise()
        d3.selectAll(".chartDot.clicked").raise()
    }else{
        el = d3.select(element.parentNode.parentNode.parentNode).select(".chartDot." + selectedSubgeo.id)
        d = el.datum()
        d3.selectAll(".chartDot.geo").raise()
        d3.selectAll(".chartDot." + selectedSubgeo.id).raise()
    }
    if(d.length == 2){
        d = d[1].filter(function(o){ return String(o.g_fips) == String(el.attr("data-fips")) })[0]
    }
    var tt = d3.select(element.parentNode.parentNode.parentNode).select(".chartToolTip"),
        dt = d3.select(element.parentNode.parentNode.parentNode).select(".dotToolTip"),
        cx = +el.attr("cx"),
        cy = +el.attr("cy"),
        baseline = d.b_pop,
        isSubGeo = (d.g != geo),
        fullName = d.g_disp,
        shortName = d.g_mo,
        d_score = d.d_score,
        fips = d.g_fips,
        s_diff = d.s_diff

    var ttText = getBarTooltipText(geo, baseline, isSubGeo,fullName, shortName, d_score, fips, s_diff)

    tt.html(ttText)
        .classed("highlight", (geo == "national" || geo == "state"))
    if(geo == "national" || geo == "state"){
        dt.html(shortName)
            .style("left", function(){
                var w = this.getBoundingClientRect().width
                var scootch = (isSubGeo) ? 13 : 16
                var pos = cx + 400 + BAR_DOT_RADIUS_SMALL*2 + scootch + w
                var rowW = this.parentNode.getBoundingClientRect().width
                return(pos > rowW) ? (cx + 400 - w - 5 ) + "px" : (cx + 400 + BAR_DOT_RADIUS_SMALL*2 + scootch) + "px"
                
            })
            .classed("flipped", function(){
                var w = this.getBoundingClientRect().width
                var scootch = (isSubGeo) ? 13 : 16
                var pos = cx + 400 + BAR_DOT_RADIUS_SMALL*2 + scootch + w
                var rowW = this.parentNode.getBoundingClientRect().width
                return(pos > rowW)
            })
        if(moveTT){
            dt.style("top", (cy - 11) + "px")
        }
        d3.selectAll(".chartDot.clicked").classed("hideClicked", false)
        d3.selectAll(".hover").classed("hover", false)
    }


    
    if(geo == "county" || geo == "city"){
        d3.select(element.parentNode.parentNode.parentNode).select(".chartLineBG").classed("hover", true)
    }
    el.classed("hover", true)
}
function highlightSubgeo(element){
    
    var d = d3.select(element).datum()
    if(d.length == 2){
        d = d[1].filter(function(o){
            return String(o.g_fips) == String(d3.select(element).attr("data-fips"))
        })[0]
    }
    var tt = d3.select(element.parentNode.parentNode.parentNode).select(".chartToolTip"),
        dt = d3.select(element.parentNode.parentNode.parentNode).select(".dotToolTip"),
        cx = +d3.select(element).attr("cx"),
        cy = +d3.select(element).attr("cy"),
        geo = getGeographyLevel(),
        baseline = d.b_pop,
        isSubGeo = (d.g != geo),
        fullName = d.g_disp,
        shortName = d.g_mo,
        d_score = d.d_score,
        fips = d.g_fips,
        s_diff = d.s_diff
// console.log(fips, d)
    var ttText = getBarTooltipText(geo, baseline, isSubGeo,fullName, shortName, d_score, fips, s_diff)

    tt.html(ttText)
        .classed("highlight", (geo == "national" || geo == "state"))
    dt.html(shortName)
        .style("left", function(){
            var w = this.getBoundingClientRect().width
            var scootch = (isSubGeo) ? 13 : 16
            var pos = cx + 400 + BAR_DOT_RADIUS_SMALL*2 + scootch + w
            var rowW = this.parentNode.getBoundingClientRect().width
            return(pos > rowW) ? (cx + 400 - w -5 ) + "px" : (cx + 400 + BAR_DOT_RADIUS_SMALL*2 + scootch) + "px"
            
        })
        .style("top", (cy - 11) + "px")
        .classed("flipped", function(){
            var w = this.getBoundingClientRect().width
            var scootch = (isSubGeo) ? 13 : 16
            var pos = cx + 400 + BAR_DOT_RADIUS_SMALL*2 + scootch + w
            var rowW = this.parentNode.getBoundingClientRect().width
            return(pos > rowW)
        })

    // d3.selectAll(".chartDot.clicked").classed("hideClicked", true)
    if(isSubGeo){
        d3.selectAll(".chartDot.subgeo.fips-" + fips).classed("hover", true).raise()
        d3.selectAll(".chartDot.geo").classed("hover", false)
    }else{
        d3.selectAll(".chartDot.geo").classed("hover", true)
    }
}

function clickSubgeo(fips){
    d3.select("#subgeoSelect-button").classed("show",true)
    $("#subgeoSelect").val(fips).selectmenu("refresh")
    d3.selectAll(".chartDot.clicked").classed("clicked",false).classed("hover", false).classed("hideClicked", false)

    if(fips.search("region") != -1){
        var R = regions.get(fips).forEach(function(d){
            d3.selectAll(".chartDot." + "fips-" + d.fips).classed("clicked", true).classed("hideClicked", false).raise()
        })
    }
    d3.selectAll(".chartDot." + fips).classed("clicked", true).classed("hideClicked", false).raise()
}
function deClickSubgeo(){
    d3.select("#subgeoSelect-button").classed("show",false)
    $("#subgeoSelect").val("none").selectmenu("refresh")
    d3.selectAll(".chartDot.clicked").classed("clicked", false).classed("hideClicked", false)
    d3.selectAll(".chartDot.hover").classed("hover", false)
    d3.selectAll(".chartDot.geo").raise()
}



function drawBarLegend(containerType, svgStatic, subgeo){
    var geo = getGeographyLevel(),
        h = (geo == "state" || geo == "national") ? 110 : 110,
        geoLabel, subGeoLabel, avgLabel, smallOpacity;

    var p1, p2, p3, p4, p5;    

    if(geo == "national"){
        geoLabel = "National";
        subGeoLabel = "State";
        p1 = 233;
        p2 = 165;
        p3 = 197;
        p4 = 30;
        p5 = 167;
        smallOpacity = 1;
    }
    else if(geo == "state"){
        geoLabel = "State"
        subGeoLabel = "County"
        p1 = 224;
        p2 = 175;
        p3 = 192;
        p4 = 30;
        p5 = 167;
        smallOpacity = 1;
    }
    else if(geo == "county"){
        geoLabel = "County"
        subGeoLabel = ""
        avgLabel = "";
        p3 = 215;
        p4 = 25;
        p5 = 167;
        smallOpacity = 0;
    }
    else if(geo == "city"){
        geoLabel = "City"
        subGeoLabel = ""
        avgLabel = "";
        p3 = 215;
        p4 = 25;
        p5 = 177;
        smallOpacity = 0;
    }

    if(containerType == "dynamic"){
        d3.select("#barChartTopLegend").selectAll("svg").remove()

        var svg = d3.select("#barChartTopLegend").append("svg")
            .attr("width", 280)
            .attr("height", h)
            .append("g")
    }else{
        var svg = svgStatic.append("g")
            .attr("transform", "translate(20,42)")
        if(subgeo != ""){
            var subgeoText = $("#subgeoSelect option:selected" ).text()
            svg.append("circle")
                .attr("cx", 655)
                .attr("cy", 47)
                .attr("r", BAR_DOT_RADIUS_SMALL)
                .style("stroke", "none")
                .style("fill","#fdbf11")
                .style("opacity", smallOpacity)
            svg.append("text")
                .attr("x", 670)
                .attr("y", 53)
                .text(subgeoText)
        }
    }
    

    svg.append("text")
        // .attr("text-anchor","end")
        .attr("x",0)
        .attr("y", 22)
        .style("font-weight", 700)
        .text("Overrepresented")

    svg.append("circle")
        .attr("cx", 10)
        .attr("cy", 47)
        .attr("r", BAR_DOT_RADIUS_LARGE)
        .style("fill", "#1696d2")
        .style("stroke","none")

    svg.append("text")
        .attr("x", 25)
        .attr("y", 53)
        .text(geoLabel)

    svg.append("circle")
        .attr("cx", 110)
        .attr("cy", 47)
        .attr("r", BAR_DOT_RADIUS_SMALL)
        .style("stroke", "#1696d2")
        .style("fill","none")
        .style("opacity", smallOpacity)

    svg.append("text")
        .attr("x", 125)
        .attr("y", 53)
        .text(subGeoLabel)
        .style("opacity", smallOpacity)






    svg.append("text")
        // .attr("text-anchor","end")
        .attr("x",230-15)
        .attr("y", 22)
        .style("font-weight", 700)
        .text("Underrepresented")

    svg.append("circle")
        .attr("cx", 240-15)
        .attr("cy", 47)
        .attr("r", BAR_DOT_RADIUS_LARGE)
        .style("fill", "#ca5800")
        .style("stroke","none")

    svg.append("text")
        .attr("x", 255-15)
        .attr("y", 53)
        .text(geoLabel)

    svg.append("circle")
        .attr("cx", 340-15)
        .attr("cy", 47)
        .attr("r", BAR_DOT_RADIUS_SMALL)
        .style("stroke", "#ca5800")
        .style("fill","none")
        .style("opacity", smallOpacity)

    svg.append("text")
        .attr("x", 355-15)
        .attr("y", 53)
        .text(subGeoLabel)
        .style("opacity", smallOpacity)





    svg.append("text")
        // .attr("text-anchor","end")
        .attr("x",430)
        .attr("y", 22)
        .style("font-weight", 700)
        .text("No significant difference")

    svg.append("circle")
        .attr("cx", 440)
        .attr("cy", 47)
        .attr("r", BAR_DOT_RADIUS_LARGE)
        .style("fill", "#9d9d9d")
        .style("stroke","none")

    svg.append("text")
        .attr("x", 455)
        .attr("y", 53)
        .text(geoLabel)

    svg.append("circle")
        .attr("cx", 540)
        .attr("cy", 47)
        .attr("r", BAR_DOT_RADIUS_SMALL)
        .style("stroke", "#9d9d9d")
        .style("fill","none")
        .style("opacity", smallOpacity)

    svg.append("text")
        .attr("x", 555)
        .attr("y", 53)
        .text(subGeoLabel)
        .style("opacity", smallOpacity)

    // svg.append("circle")
    //     .attr("cx", p3)
    //     .attr("cy", 47)
    //     .attr("r", BAR_DOT_RADIUS_LARGE)
    //     .style("fill", "#1696d2")
    //     .style("stroke","none")

    // svg.append("circle")
    //     .attr("cx", p3)
    //     .attr("cy", 69)
    //     .attr("r", BAR_DOT_RADIUS_LARGE)
    //     .style("fill", "#ca5800")
    //     .style("stroke","none")

    // svg.append("circle")
    //     .attr("cx", p3)
    //     .attr("cy", 91)
    //     .attr("r", BAR_DOT_RADIUS_LARGE)
    //     .style("fill", "#9d9d9d")
    //     .style("stroke","none")

    // svg.append("circle")
    //     .attr("cx", 253)
    //     .attr("cy", 47)
    //     .attr("r", BAR_DOT_RADIUS_SMALL)
    //     .style("stroke", "#1696d2")
    //     .style("fill","none")
    //     .style("opacity", smallOpacity)

    // svg.append("circle")
    //     .attr("cx", 253)
    //     .attr("cy", 69)
    //     .attr("r", BAR_DOT_RADIUS_SMALL)
    //     .style("stroke", "#ca5800")
    //     .style("fill","none")
    //     .style("opacity", smallOpacity)

    // svg.append("circle")
    //     .attr("cx", 253)
    //     .attr("cy", 91)
    //     .attr("r", BAR_DOT_RADIUS_SMALL)
    //     .style("stroke", "#9d9d9d")
    //     .style("fill","none")
    //     .style("opacity", smallOpacity)

}


function initBarMenu(baseline){

    $('#baselineSelectBar')
        .val(baseline)
        .selectmenu({
            create: function(event, d){
                d3.select("#baselineSelectMap-button").classed(getParams().baseline, true)
            },
            change: function(event, d){

                d3.select("#controlBaselineName").text(getBaselineBarText(d.item.value))

                updateBarChart(d.item.value)

                // d3.select(".tt-text.baseline").html("of the city's " + getBaselineMapText(d.item.value))
                // var rangeComparison = getRange(d.item.value, bounds, "compare")
            }
        })
}

function initSubgeoMenu(geo, values, defaultVal){
    if(geo == "city" || geo == "county") return false

    d3.selectAll("#barChartTopMenu").remove()
    
    var container = d3.select("#barChartTopMenuContainer")
        .append("div")
        .attr("id", "barChartTopMenu")

    var containerLabel = container.append("div")
            .attr("id", "barChartTopMenuLabel")
    container.append("div")
        .attr("id", "subgeoKey")
        .style("opacity", function(){
            return (defaultVal == "") ? 0 : 1;
        })
    var select = container
        .append("select")
        .attr("id", "subgeoSelect")

    select.append("option").attr("value", "none").text("None selected")

    if(geo == "national"){

        containerLabel.text("Highlight a state or region")

        var regionsGroup = select.append("optgroup").attr("label", "Regions"),
            ne = regionsGroup.append("option").attr("value", "ne-region").text("Northeast region"),
            mw = regionsGroup.append("option").attr("value", "mw-region").text("Midwest region"),
            s = regionsGroup.append("option").attr("value", "s-region").text("South region"),
            w = regionsGroup.append("option").attr("value", "w-region").text("West region"),
            vs = values.map(v => v[0])


        if(! arrayOverlap(vs, regions.get("ne-region").map(d => "fips-" + d.fips))) ne.attr("disabled", "disabled")
        if(! arrayOverlap(vs, regions.get("mw-region").map(d => "fips-" + d.fips))) mw.attr("disabled", "disabled")
        if(! arrayOverlap(vs, regions.get("s-region").map(d => "fips-" + d.fips))) s.attr("disabled", "disabled")
        if(! arrayOverlap(vs, regions.get("w-region").map(d => "fips-" + d.fips))) w.attr("disabled", "disabled")

        var states = select.append("optgroup").attr("label", "States")
        for(var i = 0; i < values.length; i++){
            states.append("option").attr("value", values[i][0]).html(values[i][1].replace("the District of Columbia", "District of Columbia"))
        }

    }
    else if(geo == "state"){
        containerLabel.text("Highlight a county")
        for(var i = 0; i < values.length; i++){
            select.append("option").attr("value", values[i][0]).html(values[i][1])
        }
    }
    $('#subgeoSelect')
    .val(function(){
        return defaultVal == "" ? "none" : defaultVal.id
    })
    .selectmenu({
        change: function(event, d){
            if(d.item.value == "none"){
                deClickSubgeo()
            }else{
                clickSubgeo(d.item.value)
            }
        },
        open: function(event, d){
            var mh = window.innerHeight - d3.select("#subgeoSelect-button").node().getBoundingClientRect().bottom
            d3.select("#subgeoSelect-menu").style("max-height", (mh - 40) + "px")
        }
    })
    if(defaultVal != ""){
        clickSubgeo(defaultVal.id)
    }

}



function drawStaticBarChart(rawData, baseline, subgeo, geo, callback){
    var dataAll = d3.group(rawData, d => d.b_pop, d => d.c_var)
    var data = Array.from(dataAll.get(baseline))

    var margin = {"top": 150, "bottom": 50, "left": 410, "right": 0}

    var width = 1200,
        height = data.length * BAR_ROW_HEIGHT + margin.top + margin.bottom

    max = d3.max(data.map(d => d[1]).flat(), d => d.d_score)
    min = d3.min(data.map(d => d[1]).flat(), d => d.d_score)

    var bound = Math.max(max, Math.abs(min))

    var x = d3.scaleLinear()
        .range([420,width - 30])
        .domain([-bound, bound]);
    
    d3.selectAll("#barChartImage svg").remove()

    data.sort(function(a,b){
        return b[1][0]["d_score"] - a[1][0]["d_score"];
    });

    var svg = d3.select("#barChartImage")
        .append("svg")
        .attr("id", "barChartImageSvg")
        .attr("width", width)
        .attr("height", height)

    // d3.select("#barChartTopAxisContainer").selectAll("svg").remove()
    svg.append("rect")
        .style("fill", "#ffffff")
        .attr("x",0)
        .attr("y",0)
        .attr("width", width)
        .attr("height", height)

    svg.append("line")
        .attr("x1",0)
        .attr("x2", width)
        .attr("y1", margin.top)
        .attr("y2", margin.top)
        .attr("stroke-width", "2px")

    svg
        .append("g")
        .attr("class","x axisTop_static")
        .attr("transform", "translate(0," + (margin.top-2) + ")")  
        .call(d3.axisTop(x).tickSize(-1*height).tickSizeOuter(0).tickSizeInner(10).tickFormat(function(t){
            return t + "%"
        }));


    var row = svg.selectAll(".chartRow_static")
        .data(data)
        .enter()
        .append("g")
        .attr("class", function(d, i){
            var parity = (i%2 == 0) ? "even" : "odd"
            return "chartRow_static " + parity
        })
        .attr("height", BAR_ROW_HEIGHT)
        .attr("width", x(bound) - x(-bound))
        .attr("transform", function(d,i){
            return "translate(" + 0 + "," + (margin.top + i*BAR_ROW_HEIGHT) + ")"
        })

    row.append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("width", width)
        .attr("height", BAR_ROW_HEIGHT)
        .style("fill", function(d,i){
            return (i%2 == 0) ? "#ffffff" : "#f5f5f5"
        })
    row.append("text")
        .attr("x", 400)
        .attr("text-anchor","end")
        .attr("y", BAR_ROW_HEIGHT/2)
        .html(function(d){
            return barCategories[d[0]].split("<i")[0]
        })

    row.append("g")
        .attr("class","x axis")
        // .attr("transform", "translate(0,50)")      
        .call(d3.axisTop(x).tickSize(-1*BAR_ROW_HEIGHT).tickSizeOuter(0).tickFormat(function(t){
            return ""
        }));


    if(geo == "county" || geo == "city"){
        row.selectAll(".chartLineFG_static")
            .data(function(rD){ return rD[1]})
            .enter()
            .append("line")
            .attr("x1", x(0))
            .attr("x2", function(d){return x(d.d_score)})
            .attr("y1", BAR_ROW_HEIGHT/2)
            .attr("y2", BAR_ROW_HEIGHT/2)
            .attr("stroke", function(d){
                if(!d.s_diff) return "#9d9d9d"
                else return (d.d_score < 0) ? "#ca5800" : "#1696d2"
            })
    }

    row.append("line")
        .attr("class", "y axis")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", 0)
        .attr("y2", BAR_ROW_HEIGHT)

    var chartDot = row.selectAll(".chartDot")
        .data(function(rD){
            return rD[1]
        })
        .enter()
        .append("circle")
    
    chartDot.attr("data-fips", function(d){ return d.g_fips })
        .attr("class", function(d){
            var sigClass = (d.s_diff) ? " sig" : " insig",
                subClass = (d.g == getGeographyLevel()) ? " geo" : " subgeo",
                repClass = (d.d_score < 0) ? " underRep" : " overRep"
            return "chartDot " + d.c_var + " " + d.b_pop + " " + d.g + " " + "fips-" + d.g_fips + sigClass + subClass + repClass
        })
        .attr("cx", function(d){return x(d.d_score)})
        .attr("cy", BAR_ROW_HEIGHT/2)
        .attr("r", function(d){
            return (d.g == getGeographyLevel()) ? BAR_DOT_RADIUS_LARGE : BAR_DOT_RADIUS_SMALL
        })
        .attr("fill", function(d){
            if(d.g != getGeographyLevel()) return "rgba(255,255,255,.5)"
            else if(!d.s_diff) return "#9d9d9d"
            else return (d.d_score < 0) ? "#ca5800" : "#1696d2"
        })
        .attr("stroke", function(d){
            if(d.g == getGeographyLevel()) return "#fff"
            else if(!d.s_diff) return "#9d9d9d"
            else return (d.d_score < 0) ? "#ca5800" : "#1696d2"
        })


    if(geo == "state" || geo == "national"){
        d3.selectAll(".chartDot.overRep").raise()
        d3.selectAll(".chartDot.underRep").raise()
        d3.selectAll(".chartDot.geo").raise()
        d3.selectAll(".chartDot.clicked").raise()
    }
console.log(baseline, getBaselineBarText(baseline))

    drawBarLegend("static", svg, subgeo);
// console.log(subgeo)
    if(subgeo != ""){
        var fips = subgeo.id
        if(fips.search("region") != -1){
            var R = regions.get(fips).forEach(function(d){
                d3.selectAll(".chartDot." + "fips-" + d.fips).classed("clicked", true).classed("hideClicked", false).raise()
            })
        }
        d3.selectAll(".chartDot." + fips).classed("clicked", true).classed("hideClicked", false).raise()
    }

    svg.append("text")
        .attr("id", "barTitle_static")
        .attr("x",20)
        .attr("y",30)
        .text(function(){
            return d3.select(".resultsHeader.bars.rh1").text() + " " + getBaselineBarText(baseline) + " " + d3.select(".resultsHeader.bars.rh2").text()
        })

    svg.append("text")
        .attr("id", "barFootnotes_static")
        .attr("x", 20)
        .attr("y", height - margin.bottom + 20)
        .html("<tspan>Notes:</tspan> Demographic categories for Asian, Black, White, and all other races and ethnicities include Latinx and non-Latinx residents, unless noted otherwise. When using \"children under 18\" as a baseline,")

    svg.append("text")
        .attr("id", "barFootnotes_static")
        .attr("x", 20)
        .attr("y", height - margin.bottom + 32)
        .html("the \"uninsured\" category includes 18-year-olds (i.e., children under 19).")

    svg.append("text")
        .attr("id", "barLogo_static")
        .attr("x", width - 20)
        .attr("text-anchor", "end")
        .attr("y", height - margin.bottom + 23)
        .html("<tspan>URBAN</tspan> INSTITUTE")


         

    callback()
}



