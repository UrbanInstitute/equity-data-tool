



function drawBarChart(rawData, containerType, baseline, callback){
    var dataAll = d3.group(rawData, d => d.b_pop, d => d.c_var)
    // console.log(dataAll)
    var data = Array.from(dataAll.get(baseline))

    console.log(data)

    max = d3.max(data.map(d => d[1]).flat(), d => d.d_score)
    min = d3.max(data.map(d => d[1]).flat(), d => d.d_score)
    var x = getBarX(containerType, max, min)

    var margin = getBarMargins(containerType),
        width = getBarWidth(containerType)
    
    // var height = (containerType == "dynamic") ? getBarHeight("dynamic") : getBarHeight("static", baseline)

    var containerSelector = (containerType == "dynamic") ? "#barChart" : "#barChartImage"
    d3.selectAll(containerSelector + " svg").remove()

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

    var svg = row.append("svg")
        .attr("width", width - 410)
        .attr("height", BAR_ROW_HEIGHT)
        .append("g")

    svg
        .append("g")
        .attr("class","x axis")
        // .attr("transform", "translate(0,50)")      
        .call(d3.axisTop(x).tickSize(-1*BAR_ROW_HEIGHT).tickSizeOuter(0).tickFormat(function(t){
            return ""
        }));
    
    svg.append("line")
        .attr("class", "y axis")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", 0)
        .attr("y2", BAR_ROW_HEIGHT)


    svg.selectAll(".chartDot")
        .data(function(d){ return d[1].reverse()})
        .enter()
        .append("circle")
        .attr("data-fips", function(d){ return d.g_fips })
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
        .on("mouseover", function(d){
            // console.log(d.length)


            // var 

            // function drawBarTooltip(geo, baseline, isSubGeo,fullName, shortName, d_score){
            highlightSubgeo(this)

        })
        .on("mouseout", function(){
            highlightDefaultBarTooltip(this)
        })


    drawBarLegend();



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

            ttText = gtt + " with positive disparity scores have more data points than we’d expect if resources were equitably distributed in accordance with your baseline. " + gtt + " with negative disparity scores have fewer"
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
    .on("mouseenter", function(){
        var X = d3.select(this).select("svg").selectAll(".chartDot.subgeo").nodes().map(d => d3.select(d).attr("cx"))
        var Y = dodge(X, 2*BAR_DOT_RADIUS_SMALL + 1)
        var ymax = d3.max(Y)
        var row = this;
        d3.select(this).select("svg")
            .transition()
            .duration(1000)
            .attr("height", ymax + BAR_ROW_HEIGHT/2 + BAR_DOT_RADIUS_SMALL * 4)

        d3.select(row).select(".chartToolTip")
                    .transition()
                    .style("opacity",1)
        d3.select(this)
            .transition()
            .duration(1000)
            .style("height", (ymax + BAR_ROW_HEIGHT/2 + + BAR_DOT_RADIUS_SMALL * 4) + "px")

        d3.select(this).select("svg").selectAll(".chartDot.subgeo")
            .transition()
            .duration(1000)
            .attr("cy", function(d,i){
                return BAR_ROW_HEIGHT/2 + Y[i]
            })

        d3.select(this).select("svg").select(".x.axis")
            .transition()
            .duration(1000)
                .call(d3.axisTop(x).tickSize(-1*(ymax + BAR_ROW_HEIGHT/2 + BAR_DOT_RADIUS_SMALL * 4 )).tickSizeOuter(0).tickFormat(function(t){
                    return ""
                }));

        d3.select(this).select("svg").select(".y.axis")
            .transition()
            .duration(1000)
                .attr("y2", (ymax + BAR_ROW_HEIGHT/2 + BAR_DOT_RADIUS_SMALL * 4))


        highlightDefaultBarTooltip(d3.select(this).select(".chartDot").node())

    })
    .on("mouseleave", function(){
        var row = this;
        d3.select(this).selectAll(".chartDot.subgeo")
            .transition()
            .duration(1000)
            .attr("cy", BAR_ROW_HEIGHT/2)

        d3.select(row).select(".chartToolTip")
            .transition()
            .style("opacity",0)
        d3.select(row).select(".chartDot.geo").classed("hover",false)


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


function highlightDefaultBarTooltip(element){
    var selectedSubgeo = getSelectedSubgeo()
    var d,el;
    if(selectedSubgeo == "" || selectedSubgeo.level == "region"){
        el = d3.select(element.parentNode.parentNode.parentNode).select(".chartDot.geo")
        d = el.datum()
    }else{
        el = d3.select(element.parentNode.parentNode.parentNode).select(".chartDot.fips-" + selectedSubgeo.id)
        d = el.datum()
    }
    if(d.length == 2){
        d = d[1].filter(function(o){ return o.g_fips == el.attr("data-fips") })[0]
    }
    var tt = d3.select(element.parentNode.parentNode.parentNode).select(".chartToolTip"),
        geo = getGeographyLevel(),
        baseline = d.b_pop,
        isSubGeo = (d.g != geo),
        fullName = d.g_disp,
        shortName = d.g_mo,
        d_score = d.d_score;

    var ttText = getBarTooltipText(geo, baseline, isSubGeo,fullName, shortName, d_score)

    tt.html(ttText)

    d3.selectAll(".chartDot.clicked").classed("hideClicked", false)
    d3.selectAll(".hover").classed("hover", false)
    el.classed("hover", true)
}
function highlightSubgeo(element){
    var d = d3.select(element).datum()
    console.log(d)
    if(d.length == 2){
        d = d[1].filter(function(o){ return o.g_fips == d3.select(element).attr("data-fips") })[0]
    }
    // console.log(d)
    var tt = d3.select(element.parentNode.parentNode.parentNode).select(".chartToolTip"),
        geo = getGeographyLevel(),
        baseline = d.b_pop,
        isSubGeo = (d.g != geo),
        fullName = d.g_disp,
        shortName = d.g_mo,
        d_score = d.d_score,
        fips = d.g_fips;

    var ttText = getBarTooltipText(geo, baseline, isSubGeo,fullName, shortName, d_score, fips)

    tt.html(ttText)
    // if(d3.select(this).classed("highlight")){
    //     return false;
    // }
    // d3.select(this).classed("hover", true)
    d3.selectAll(".chartDot.clicked").classed("hideClicked", true)
    if(isSubGeo){
        d3.selectAll(".chartDot.subgeo.fips-" + fips).classed("hover", true)
        d3.selectAll(".chartDot.geo").classed("hover", false)
    }else{
        d3.selectAll(".chartDot.geo").classed("hover", true)
    }
}



function drawBarLegend(){
    var geo = getGeographyLevel(),
        h = (geo == "state" || geo == "national") ? 110 : 40,
        geoLabel, subGeoLabel;

    if(geo == "national"){
        geoLabel = "National";
        subGeoLabel = "States";
    }
    else if(geo == "state"){
        geoLabel = "State"
        subGeoLabel = "Counties"
    }
    else if(geo == "county"){
        geoLabel = "County"
        subGeoLabel = ""
    }
    else if(geo == "city"){
        geoLabel = "City average"
        subGeoLabel = ""
    }

    var svg = d3.select("#barChartTopLegend").append("svg")
        .attr("width", 280)
        .attr("height", h)
        .append("g")

    svg.append("text")
        .attr("x", 165)
        .attr("y", 15)
        .text(geoLabel)
    
    svg.append("text")
        .attr("x", 167)
        .attr("y", 30)
        .text("average")

    svg.append("text")
        .attr("x", 233)
        .attr("y", 30)
        .text(subGeoLabel)

    svg.append("text")
        .attr("text-anchor","end")
        .attr("x",160)
        .attr("y", 50)
        .text("Overrepresented")

    svg.append("text")
        .attr("text-anchor","end")
        .attr("x",160)
        .attr("y", 73)
        .text("Underrepresented")

    svg.append("text")
        .attr("text-anchor","end")
        .attr("x",160)
        .attr("y", 96)
        .text("No significant difference")

    svg.append("circle")
        .attr("cx", 197)
        .attr("cy", 47)
        .attr("r", BAR_DOT_RADIUS_LARGE)
        .style("fill", "#1696d2")
        .style("stroke","none")

    svg.append("circle")
        .attr("cx", 197)
        .attr("cy", 69)
        .attr("r", BAR_DOT_RADIUS_LARGE)
        .style("fill", "#ca5800")
        .style("stroke","none")

    svg.append("circle")
        .attr("cx", 197)
        .attr("cy", 91)
        .attr("r", BAR_DOT_RADIUS_LARGE)
        .style("fill", "#9d9d9d")
        .style("stroke","none")

    svg.append("circle")
        .attr("cx", 253)
        .attr("cy", 47)
        .attr("r", BAR_DOT_RADIUS_SMALL)
        .style("stroke", "#1696d2")
        .style("fill","none")

    svg.append("circle")
        .attr("cx", 253)
        .attr("cy", 69)
        .attr("r", BAR_DOT_RADIUS_SMALL)
        .style("stroke", "#ca5800")
        .style("fill","none")

    svg.append("circle")
        .attr("cx", 253)
        .attr("cy", 91)
        .attr("r", BAR_DOT_RADIUS_SMALL)
        .style("stroke", "#9d9d9d")
        .style("fill","none")

    // Overrepresented 
    //  No significant difference
    // Underrepresented
}


