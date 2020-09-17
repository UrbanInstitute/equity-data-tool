



function drawBarChart(data, containerType, callback){
    
    var margin = getBarMargins(containerType),
        width = getBarWidth(containerType)
    
    var height = (containerType == "dynamic") ? getBarHeight("dynamic") : getBarHeight("static", data)

    var containerSelector = (containerType == "dynamic") ? "#barChart" : "#barChartImage"
    d3.selectAll(containerSelector + " svg").remove()

    var padder = (containerType == "dynamic") ? 0 : 80;
    var svg = d3.select(containerSelector).append("svg")
        .attr("id", containerSelector.replace("#","") + "Svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + padder)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var textShadow = svg.append("defs")
        .append("filter")
        .attr("id", "textShadow")
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%")
    textShadow.append("feGaussianBlur")
        .attr("stdDeviation","1 1")
        .attr("result","textShadow")
    textShadow.append("feOffset")
        .attr("dx", "2")
        .attr("dy", "2")

    data.sort(function(a,b){
        return a.diff_data_city - b.diff_data_city;
    });


    var x = getBarX(containerType, data)
    var y = getBarY(containerType, data)

    if(containerType == "static"){
        var legend = svg.append("g")
            .attr("id","printBarLegend")
            .attr("transform","translate(" + margin.left + ",-10)" )
        legend.append("circle")
            .attr("r", BAR_DOT_RADIUS)
            .attr("cx", -12)
            .attr("cy", 5)
            .style("fill","#1696d2")
        legend.append("text")
            .text("Overrepresented")
            .attr("x", 2)
            .attr("y", 10)
        
        legend.append("circle")
            .attr("r", BAR_DOT_RADIUS)
            .attr("cx", 135)
            .attr("cy", 5)
            .style("fill","#ca5800")
        legend.append("text")
            .text("Underrepresented")
            .attr("x", 149)
            .attr("y", 10)
       
        legend.append("circle")
            .attr("r", BAR_DOT_RADIUS)
            .attr("cx", 292)
            .attr("cy", 5)
            .style("fill","#9d9d9d")
        legend.append("text")
            .text("No significant difference")
            .attr("x", 306)
            .attr("y", 10)
    }


    svg
        .append("g")
        .attr("transform", "translate(0,50)")      
        .call(d3.axisTop(x).tickSize(-height).tickSizeOuter(0).tickFormat(function(t){
            return t + "%"
        }));


    svg.selectAll(".lollipop.background")
        .data(data)
        .enter().append("line")
            .attr("class", function(d){
            var sigdiff = (d.sig_diff) ? " sig" : " insig"
            var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
                return "lollipop background active chartPart " + barCategories[d.census_var]["class"] + overunder + sigdiff
            })
            .attr("x1", function(d){ return d.diff_data_city < 0 ? x(d.diff_data_city) : x(0); })
            .attr("x2", function(d){ return d.diff_data_city < 0 ? x(0) : x(d.diff_data_city)  })
            .attr("y1", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })
            .attr("y2", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })



    svg.selectAll(".lollipop.foreground")
        .data(data)
        .enter().append("line")
        .attr("class", function(d){
            var sigdiff = (d.sig_diff) ? " sig" : " insig"
            var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
            return "lollipop foreground active chartPart " + barCategories[d.census_var]["class"] + overunder + sigdiff
        })
        .attr("x1", function(d){ return d.diff_data_city < 0 ? x(d.diff_data_city) : x(0); })
        .attr("x2", function(d){ return d.diff_data_city < 0 ? x(0) : x(d.diff_data_city)  })
        .attr("y1", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })
        .attr("y2", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })

    svg.append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", 0 + margin.top)
        .attr("y2", height + padder)
        .attr("stroke", "#3a403d")
        .attr("stroke-width", "1px");

    svg.selectAll(".barDot")
        .data(data)
        .enter().append("circle")
        .attr("class", function(d){
        var sigdiff = (d.sig_diff) ? " sig" : " insig"
        var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
            return "barDot active chartPart " + barCategories[d.census_var]["class"] + overunder + sigdiff
        })
        .attr("cx", function(d){ return x(d.diff_data_city); })
        .attr("cy", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })
        .attr("r", BAR_DOT_RADIUS)

    svg.selectAll(".bar_full_name.background")
        .data(data)
        .enter().append("text")
        .attr("class", function(d){
        var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
            return "bar_full_name background active chartPart " + barCategories[d.census_var]["class"] + overunder
        })
        .attr("x", function(d){ return d.diff_data_city < 0 ? x(0) + 2.55 : x(0) - 2.55 })
        .attr("y", function(d){ return y(d.census_var) + margin.top; })
        .attr("dy", y.bandwidth() - BAR_LABEL_SCOOTCH)
        .style("filter","url(#textShadow)")
        .attr("text-anchor", function(d){ return d.diff_data_city < 0 ? "start" : "end"; })
        .html(function(d){ return barCategories[d.census_var]["full_name"]; });

    svg.selectAll(".bar_full_name.foreground")
        .data(data)
        .enter().append("text")
        .attr("class", function(d){
        var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
            return "bar_full_name foreground active chartPart " + barCategories[d.census_var]["class"] + overunder
        })
        .attr("x", function(d){ return d.diff_data_city < 0 ? x(0) + 2.55 : x(0) - 2.55 })
        .attr("y", function(d){ return y(d.census_var) + margin.top; })
        .attr("dy", y.bandwidth() - BAR_LABEL_SCOOTCH)
        .attr("text-anchor", function(d){ return d.diff_data_city < 0 ? "start" : "end"; })
        .html(function(d){ return barCategories[d.census_var]["full_name"]; });

    callback();
}


function updateBars(category, hide){
    var data = d3.selectAll(".barDot").data()
    var x = getBarX("dynamic", data)
    if(hide){
        var clone = d3.selectAll("#barChart .barDot.active").data().slice(0)
        
        d3.selectAll(".barDot." + category)
            .classed("active", false)
            .transition()
            .attr("cx", x(0))
            .attr("r", 0)
        d3.selectAll(".lollipop." + category)
            .classed("active", false)
            .transition()
            .attr("x1", x(0))
            .attr("x2", x(0))
        d3.selectAll(".bar_full_name." + category)
            .classed("active", false)
            .transition()
            .style("opacity",0)
            .on("end", function(){
                clone = clone.filter(function(o){
                    return barCategories[o.census_var]["class"] != category
                })

                var y = getBarY("dynamic", clone),
                    margin = getBarMargins()

                d3.selectAll(".barDot.active")
                .transition()
                .attr("cy", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })

                d3.selectAll(".lollipop.active")
                .transition()
                .attr("y1", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })
                .attr("y2", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })


                d3.selectAll(".bar_full_name.active")
                .transition()
                .attr("y", function(d){ return y(d.census_var) + margin.top; })
                .attr("dy", y.bandwidth() - BAR_LABEL_SCOOTCH)
            })
    }else{
        d3.selectAll(".chartPart." + category).classed("active", true)
        var clone = d3.selectAll("#barChart .barDot.active").data().slice(0)
        
        var y = getBarY("dynamic", clone),
            margin = getBarMargins()

        d3.selectAll(".barDot.active")
        .transition()
        .attr("cy", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })

        d3.selectAll(".lollipop.active")
        .transition()
        .attr("y1", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })
        .attr("y2", function(d){ return y(d.census_var) + margin.top + y.bandwidth()*.5; })


        d3.selectAll(".bar_full_name.active")
        .transition()
        .attr("y", function(d){ return y(d.census_var) + margin.top; })
        .attr("dy", y.bandwidth() - BAR_LABEL_SCOOTCH)
        .on("end", function(){
            d3.selectAll(".barDot." + category)
                .transition()
                .attr("cx", function(d){ return x(d.diff_data_city); })
                .attr("r", BAR_DOT_RADIUS)
            d3.selectAll(".lollipop." + category)
                .transition()
                .attr("x1", function(d){ return d.diff_data_city < 0 ? x(d.diff_data_city) : x(0); })
                .attr("x2", function(d){ return d.diff_data_city < 0 ? x(0) : x(d.diff_data_city)  })
            d3.selectAll(".bar_full_name." + category)
                .transition()
                .style("opacity", function(){
                    return (d3.select(this).classed("foreground")) ? 1 : 0;
                })
        })

    }


}



d3.selectAll(".barCategoryRow")
    .on("click", function(){
        var isActive = d3.select(this).classed("active")
        d3.select(this).classed("active", !isActive)

        var category = d3.select(this).attr("data-category")
        updateBars(category, isActive)
    })
    .on("mouseover", function(d){
        var category = d3.select(this).attr("data-category")
        d3.selectAll(".chartPart." + category).classed("hover", true)
    })
    .on("mouseout", function(d){
        var category = d3.select(this).attr("data-category")
        d3.selectAll(".chartPart." + category).classed("hover", false)
    })




