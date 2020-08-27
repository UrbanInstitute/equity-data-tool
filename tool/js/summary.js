function populateSummaries(messages, params){
    console.log(messages, params)
    var datasetType = getDatasetType()
    var container = d3.selectAll(".summaryContainer")
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

}

