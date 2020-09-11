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
        .text("SUMMARY: ")
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

// N total rows in your data
// N rows removed by filters
// N rows removed with null or missing weight columns
// N rows removed with null or missing latitude and/or longitude columns
// N rows removed with null or missing filter columns

    var fRow = container.append("div").attr("class","paramRow")

    // fRow.append("img").attr("src", "images/check.png")
    fRow.append("div").html("<span>Filters:</span> none")
    fRow.append("div").html("<span>Weight column:</span> none")


    container.append("div")
        .attr("class","summaryRows")
        .html("<span>" + messages.updates.num_rows_file + "</span> total rows in your data")

    container.append("div")
        .attr("class","summaryRows")
        .html("<span>" + messages.updates.num_filter_rows_dropped + "</span> rows removed by filters")

    container.append("div")
        .attr("class","summaryRows")
        .html("<span>" + messages.warnings.num_null_weight_rows_dropped + "</span> rows removed with null or missing weight columns")

    container.append("div")
        .attr("class","summaryRows")
        .html("<span>" + messages.warnings.num_null_filter_rows_dropped + "</span> rows removed with null or missing filter columns")

    container.append("div")
        .attr("class","summaryRows")
        .html("<span>" + messages.warnings.num_null_latlon_rows_dropped + "</span> rows removed with null or missing latitude and/or longitude columns")

    container.append("div")
        .attr("class","summaryRows")
        .html("<span>" + messages.warnings.num_out_of_city_rows_dropped + "</span> rows removed that were not within " + messages.updates.city_used)




    headX.on("click", function(){
        if(d3.select(this).classed("closed")){
            d3.select(this).classed("closed", false)
                .transition()
                .style("transform", "rotate(45deg)")
            d3.select(".summaryContainer.visible")
                .transition()
                .style("height", function(){
                    return d3.select(".summaryContainer.clone").node().getBoundingClientRect().height + "px"
                })
        }else{
            d3.select(this).classed("closed", true)
                .transition()
                .style("transform", "rotate(0deg)")

            d3.select(".summaryContainer.visible")
                .transition()
                .style("height", function(){
                    return "29px"
                })

        }
    })

}
function populateDownloadLinks(links){
    console.log(links)
    d3.select(".mapLink.csv").attr("href", links.geo_bias_csv)
    d3.select(".mapLink.json").attr("href", links.geo_bias_geojson)
    d3.select(".barLink.csv").attr("href", links.demographic_bias_csv)

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
