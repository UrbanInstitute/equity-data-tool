



function drawBarChart(data){
// console.log(data)
var margin = getBarMargins(),
width = getBarWidth(),
height = getBarHeight();

var svg = d3.select("#barChart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
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


var x = getBarX(data)
var y = getBarY(data)


svg
  .append("g")
  .attr("transform", "translate(0,50)")      
  .call(d3.axisTop(x).tickSize(-height).tickSizeOuter(0));


svg.selectAll(".lollipop.background")
.data(data)
.enter().append("line")
.attr("class", function(d){
var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
return "lollipop background active chartPart " + barCategories[d.census_var]["class"] + overunder
})
.attr("x1", function(d){ return d.diff_data_city < 0 ? x(d.diff_data_city) : x(0); })
.attr("x2", function(d){ return d.diff_data_city < 0 ? x(0) : x(d.diff_data_city)  })
.attr("y1", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
.attr("y2", function(d){ return y(d.census_var) + y.bandwidth()*.5; })



svg.selectAll(".lollipop.foreground")
.data(data)
.enter().append("line")
.attr("class", function(d){
var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
return "lollipop foreground active chartPart " + barCategories[d.census_var]["class"] + overunder
})
.attr("x1", function(d){ return d.diff_data_city < 0 ? x(d.diff_data_city) : x(0); })
.attr("x2", function(d){ return d.diff_data_city < 0 ? x(0) : x(d.diff_data_city)  })
.attr("y1", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
.attr("y2", function(d){ return y(d.census_var) + y.bandwidth()*.5; })

svg.selectAll(".barDot")
.data(data)
.enter().append("circle")
.attr("class", function(d){
var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
return "barDot active chartPart " + barCategories[d.census_var]["class"] + overunder
})
.attr("cx", function(d){ return x(d.diff_data_city); })
.attr("cy", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
.attr("r", BAR_DOT_RADIUS)


// <text style="filter: url(#shadow); fill: black" x="175" y="50"> Drop Shadow </text>


svg.selectAll(".bar_full_name.background")
.data(data)
.enter().append("text")
.attr("class", function(d){
var overunder = (d.diff_data_city < 0) ? " underRepresented" : " overRepresented"
return "bar_full_name background active chartPart " + barCategories[d.census_var]["class"] + overunder
})
.attr("x", function(d){ return d.diff_data_city < 0 ? x(0) + 2.55 : x(0) - 2.55 })
.attr("y", function(d){ return y(d.census_var); })
.attr("dy", y.bandwidth() - 6)
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
.attr("y", function(d){ return y(d.census_var); })
.attr("dy", y.bandwidth() - 6)
.attr("text-anchor", function(d){ return d.diff_data_city < 0 ? "start" : "end"; })
.html(function(d){ return barCategories[d.census_var]["full_name"]; });

svg.append("line")
.attr("x1", x(0))
.attr("x2", x(0))
.attr("y1", 0 + margin.top)
.attr("y2", height - margin.top)
.attr("stroke", "#3a403d")
.attr("stroke-width", "1px");





}


function updateBars(category, hide){
    var data = d3.selectAll(".barDot").data()
    var x = getBarX(data)
    if(hide){
        var clone = d3.selectAll(".barDot.active").data().slice(0)
        
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
                // console.log(barCategories[o.census_var]["class"], category)
                return barCategories[o.census_var]["class"] != category
                })

                // console.log(clone, data)
                var y = getBarY(clone)

                d3.selectAll(".barDot.active")
                .transition()
                .attr("cy", function(d){ return y(d.census_var) + y.bandwidth()*.5; })

                d3.selectAll(".lollipop.active")
                .transition()
                .attr("y1", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
                .attr("y2", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
                // console.log(clone)


                d3.selectAll(".bar_full_name.active")
                .transition()
                .attr("y", function(d){ return y(d.census_var); })
                .attr("dy", y.bandwidth() - 6)
            })
    }else{
        d3.selectAll(".chartPart." + category).classed("active", true)
        var clone = d3.selectAll(".barDot.active").data().slice(0)
        
        var y = getBarY(clone)

        d3.selectAll(".barDot.active")
        .transition()
        .attr("cy", function(d){ return y(d.census_var) + y.bandwidth()*.5; })

        d3.selectAll(".lollipop.active")
        .transition()
        .attr("y1", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
        .attr("y2", function(d){ return y(d.census_var) + y.bandwidth()*.5; })
        // console.log(clone)


        d3.selectAll(".bar_full_name.active")
        .transition()
        .attr("y", function(d){ return y(d.census_var); })
        .attr("dy", y.bandwidth() - 6)
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




