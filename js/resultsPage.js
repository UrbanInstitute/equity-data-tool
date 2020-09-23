function populateSummaries(messages, params){
    var datasetType = getDatasetType()
    var container = d3.selectAll(".summaryContainer")
    container.selectAll("*").remove()
    container.classed("onLoad", true)

    var header = container.append("div")
        .attr("class","summaryHeader")
    var headName = header.append("div")
        .attr("class","summaryHeadName")
    headName.append("span")
        .attr("class", "summaryStrong")
        .text("SUMMARY: ")
    headName.append("span")
        .html(function(){
            console.log(messages)
            if(datasetType == "user"){
                return "Your data from " + messages.updates.city_used
            }else{
              var card = d3.select(".sampleCard." + getSampleDatasetSlug())
              return "Your data on " + card.select(".sampleName").text().toLowerCase() + " from " + messages.updates.city_used
            } 
        })
    var headX = header.append("div")
        .attr("class", "headerX closed")
    headX.append("div")
        .attr("class", "headX vert")
    headX.append("div")
        .attr("class", "headX hor")


    var comma = d3.format(",")
    var numWidth = comma(messages.updates.num_rows_file).length * 9

    var sumSection = container.append("div").attr("id", "sumSectionContainer")
    var imgContainer = sumSection.append("div")
        .attr("class", "sumSectionImgContainer")
    var imgClass = (getDatasetType() == "user") ? "user" : getSampleDatasetSlug();
    imgContainer.append("img")
        .attr("class", "sumSectionImg " + imgClass)
        .attr("src", function(){
            if(getDatasetType() == "user"){
                return "images/upload-grey.png"
            }else{
                if(getSampleDatasetSlug() == "three11") return "images/sample-311-grey.png"
                else if(getSampleDatasetSlug() == "hotspots") return "images/sample-hotspots-grey.png"
                else return "images/sample-bike-grey.png"
            }
        })

    var sumContainer = sumSection.append("div").attr("id", "sumContainer")

    sumContainer.append("div")
        .attr("class","summaryRows")
        .html("<span style = \"width:" + numWidth +"px\";>" + comma(messages.updates.num_rows_file) + "</span> total rows in file")

    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative")
        .html("<span style = \"width:" + numWidth +"px\";>" + comma(messages.updates.num_filter_rows_dropped) + "</span> rows removed by filters")
        .classed("hidden", function(){
            return +messages.updates.num_filter_rows_dropped == 0
        })

    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative summaryWarning")
        .html("<img class = \"warningIcon\" src = \"images/warnings.png\"><span style = \"width:" + numWidth +"px\";>" + comma(messages.warnings.num_null_weight_rows_dropped) + "</span> rows removed with null or missing weight columns")
        .classed("hidden", function(){
            return +messages.warnings.num_null_weight_rows_dropped == 0
        })

    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative summaryWarning")
        .html("<img class = \"warningIcon\" src = \"images/warnings.png\"><span style = \"width:" + numWidth +"px\";>" + comma(messages.warnings.num_null_filter_rows_dropped) + "</span> rows removed with null or missing filter columns")
        .classed("hidden", function(){
            return +messages.warnings.num_null_filter_rows_dropped == 0
        })

    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative summaryWarning")
        .html("<img class = \"warningIcon\" src = \"images/warnings.png\"><span style = \"width:" + numWidth +"px\";>" + comma(messages.warnings.num_null_latlon_rows_dropped) + "</span> removed with null or missing latitude and/or longitude columns")
        .classed("hidden", function(){
            return +messages.warnings.num_null_latlon_rows_dropped == 0
        })

    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative summaryWarning")
        .html("<img class = \"warningIcon\" src = \"images/warnings.png\"><span style = \"width:" + numWidth +"px\";>" + comma(messages.warnings.num_out_of_city_rows_dropped) + "</span> rows removed that were not within " + messages.updates.city_used)
        .classed("hidden", function(){
            return +messages.warnings.num_out_of_city_rows_dropped == 0
        })


    sumContainer.append("div")
        .attr("class","summaryRows bottomRow")
        .html("<span style = \"width:" + numWidth +"px\";>" + comma(messages.updates.num_rows_final) + "</span> total rows analyzed")





    var fRow = container.append("div").attr("class","paramRow")

    var col4 = fRow.append("div")
        .attr("class", "summaryColumn filter")
    col4.append("div")
        .attr("class", "deetSubHed summaryEl")
        .text(function(){
            return (params.filters.length != 1) ? "Filters:" : "Filter:"
        })
    var summaryRow4 = col4.selectAll(".deetRow")
        .data(params.filters)
        .enter()
        .append("div")
        .attr("class", "deetRow filter summaryEl")
    summaryRow4.append("img")
        .attr("src", "images/check.png")
    summaryRow4.append("div")
        .attr("class", "deetText")
        .text(function(d){
            return getTagText(d)
        })
    if(params.filters.length == 0){
        var noneRow = col4.append("div")
            .attr("class", "deetRow none filter summaryEl")
        noneRow.append("img")
            .attr("src", "images/check.png")
        noneRow.append("div")
            .attr("class", "deetText")
            .text("None")
    } 


    var col1 = fRow.append("div")
        .attr("class", "summaryColumn weight")
    col1.append("div")
        .attr("class", "deetSubHed summaryEl")
        .text("Weighted by:")
    var summaryRow = col1.append("div")
        .attr("class", "deetRow weight summaryEl")
        .classed("none", function(){
            return params.weight == ""
        })
    summaryRow.append("img")
        .attr("src", "images/check.png")
    summaryRow.append("div")
        .attr("class", "deetText")
        .html(function(){
            return (params.weight == "") ? "None" : params.weight
        })


    var col2 = fRow.append("div")
        .attr("class", "summaryColumn lon")
    col2.append("div")
        .attr("class", "deetSubHed summaryEl")
        .text("Longitude:")
    var summaryRow2 = col2.append("div")
        .attr("class", "deetRow weight summaryEl")
    summaryRow2.append("img")
        .attr("src", "images/check.png")
    summaryRow2.append("div")
        .attr("class", "deetText")
        .html(params.lon_column)


    var col3 = fRow.append("div")
        .attr("class", "summaryColumn lat")
    col3.append("div")
        .attr("class", "deetSubHed summaryEl")
        .text("Latitude:")
    var summaryRow3 = col3.append("div")
        .attr("class", "deetRow weight summaryEl")
    summaryRow3.append("img")
        .attr("src", "images/check.png")
    summaryRow3.append("div")
        .attr("class", "deetText")
        .html(params.lat_column)





// N total rows in your data           updates.num_rows_file
// N rows removed by filters           updates.num_filter_rows_dropped
// [Warning icon]N rows removed with null or missing weight columns        warnings.num_null_weight_rows_dropped
// [Warning icon]N rows removed with null or missing latitude and/or longitude columns         warnings.num_null_latlon_rows_dropped
// [Warning icon]N rows removed with null or missing filter columns        warnings.num_null_weight_rows_dropped
// [Warning icon]N rows removed that were not in [city name] warnings.num_out_of_city_rows_dropped

// N total rows analyzed       updates.num_rows_final


    headX.on("click", function(){
        d3.selectAll(".summaryContainer").classed("onLoad",false)
        if(d3.select(this).classed("closed")){
            d3.select(this).classed("closed", false)
            d3.select(".headX.vert").transition()
                .style("transform", "rotate(90deg)")
            d3.select(".sumSectionImg").transition().style("opacity",1)
            d3.select(".summaryContainer.visible")
                .transition()
                .style("height", function(){
                    var dePadder = (widthBelow(768) || widthBelow(500)) ? 0 : 90;
                    return (d3.select(".summaryContainer.clone").node().getBoundingClientRect().height - dePadder) + "px"
                })
        }else{
            d3.select(this).classed("closed", true)
            d3.select(".headX.vert").transition()
                .style("transform", "rotate(0deg)")
            d3.select(".sumSectionImg").transition().style("opacity",0)
            d3.select(".summaryContainer.visible")
                .transition()
                .style("height", function(){
                    return d3.select(".summaryContainer.visible .summaryHeadName").node().getBoundingClientRect().height + "px"
                })

        }
    })

}
function populateDownloadLinks(links){
    d3.select("#mapDataCsv").attr("data-link", links.geo_bias_csv)
    d3.select("#mapDataGeojson").attr("data-link", links.geo_bias_geojson)
    // d3.select(".mapLink.csv").attr("href", links.geo_bias_csv)
    // d3.select(".mapLink.json").attr("href", links.geo_bias_geojson)

    d3.select(".barLink.csv").attr("href", links.demographic_bias_csv)

}
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
$("#mapDataButtonOverlay").on("click", function(){
    $('#mapDataButton-button').trigger("click")
})
$("#mapDataButtonOverlay").on("mouseover", function(){
    $('#mapDataButtonOverlay img').attr("src","images/menuArrowWhite.png")
})
$("#mapDataButtonOverlay").on("mouseout", function(){
    $('#mapDataButtonOverlay img').attr("src","images/menuArrow.png")
})
$('#mapDataButton')
    .selectmenu({
        select: function(event, d){
            if(d.item.value == "csv") window.location.href = d3.select("#mapDataCsv").attr("data-link")
            else window.location.href = d3.select("#mapDataGeojson").attr("data-link")
        },
        open: function(){
            d3.select("#mapDataButtonOverlay img").style("transform","rotate(180deg)")
        },
        close: function(){
            d3.select("#mapDataButtonOverlay img").style("transform","rotate(0deg)")
        }
    })    
d3.select(".barButton.barImg").on("click", function(){
    var clone = d3.selectAll("#barChart .barDot.active").data().slice(0)

    drawBarChart(clone, "static", function(){
        saveSvgAsPng(document
            .getElementById("barChartImageSvg"), "spatial_equity_demographic_distribution", {backgroundColor: "#fff", "encoderOptions" : 1, "scale": 4 });
    })
})

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

d3.select("#advancedOptionsHeader-button")
    .on("mouseover", function(){
        d3.select("#advancedTextOverlayNav").classed("navHover", true)
    })
    .on("mouseout", function(){
        d3.select("#advancedTextOverlayNav").classed("navHover", false)
    })

d3.select("#tt-icon-cost")
    .on("mouseover", function(){
        var tt = d3.select(this).append("div").attr("class", "tt-container")

        tt.append("div")
            .html("Households that pay more than 35 percent of their income on rent.")

    })
    .on("mouseout", function(){
        d3.selectAll(".tt-container").remove()
    })



$(window).resize(function(){
    console.log("foo")
    resizeLoader()
})