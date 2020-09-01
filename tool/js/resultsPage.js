function populateSummaries(messages, params){
    console.log(messages, params)
    var datasetType = getDatasetType()
    var container = d3.selectAll(".summaryContainer")
    container.selectAll("*").remove()

    var header = container.append("div")
        .attr("class","summaryHeader")
    var headName = header.append("div")
        .attr("class","summaryHeadName")
    headName.append("span")
        .attr("class", "summaryStrong")
        .text("SUMMARY:")
    headName.append("span")
        .html(function(){
            return (datasetType == "user") ? "Your data from " + messages.updates.city_used : "Name of sample data set"
        })
    var headX = header.append("div")
        .attr("class", "headerX closed")
    headX.append("div")
        .attr("class", "headX vert")
    headX.append("div")
        .attr("class", "headX hor")
        // .text(messages.updates.city_used)



    headX.on("click", function(){
        if(d3.select(this).classed("closed")){
            d3.select(this).classed("closed", false)
                .transition()
                .style("transform", "rotate(45deg)")
        }else{
            d3.select(this).classed("closed", true)
                .transition()
                .style("transform", "rotate(0deg)")

        }
    })

}

d3.select(".resultsNav.startOverResults").on("click", startOver)

$('#advancedOptionsHeader')
    .selectmenu({
        select: function(event, d){
            showLoaderSection(d.item.value)
        },
        open: function(){
            d3.select("#advancedTextOverlayNav img").style("transform","rotate(180deg)")
        },
        close: function(){
            d3.select("#advancedTextOverlayNav img").style("transform","rotate(0deg)")
        }
    })
