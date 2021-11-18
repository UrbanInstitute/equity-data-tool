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
        .text("Summary: ")
    headName.append("span")
        .html(function(){
            if(datasetType == "user"){
                return "Your data in " + messages.updates.g_disp
            }else{
              var card = d3.select(".sampleCard." + getSampleDatasetSlug())
              return "Your data on " + card.select(".sampleName").text().toLowerCase().split("(")[0].trim().replace("low-income housing tax credit","Low-Income Housing Tax Credit").replace("wi-fi","Wi-Fi") + " from " + messages.updates.g_disp
            } 
        })
    d3.select("#resultsSubnav")
        .transition()
        .style("top", "45px")
    d3.select("#header-pinned").classed("loading", false)
    d3.select("#resultsNavDataName")
        .html(function(){
            if(datasetType == "user"){
                return "Your data"
            }else{
              var card = d3.select(".sampleCard." + getSampleDatasetSlug())
              var sName = card.select(".sampleName").text().toLowerCase().split("(")[0].trim()
              return (sName[0].toUpperCase() + sName.slice(1)).replace("wi-fi","Wi-Fi").replace("Low-income housing tax credit","Low-Income Housing Tax Credit")
            } 
    })
    var headOfClass = (headName.node().getBoundingClientRect().height > 30) ? "headerX closed tall" : "headerX closed"
    var headX = header.append("div")
        .attr("class", headOfClass)
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
                return "images/sample-" + getSampleDatasetSlug() + "-grey.png"
            }
        })

    var sumContainer = sumSection.append("div").attr("id", "sumContainer")

    var s1 = (messages.updates.num_rows_file == 1) ? "" : "s"
    sumContainer.append("div")
        .attr("class","summaryRows")
        .html("<div class = \"sumRowNum\" style = \"width:" + numWidth +"px\";>" + comma(messages.updates.num_rows_file) + "</div><div class = \"sumRowText\" style=\"width: calc(100% - " + (numWidth + 4) + "px)\"> total row" + s1 + " in file</div>")

    var s2 = (messages.updates.num_filter_rows_dropped == 1) ? "" : "s"
    var s2a = (params.filters.length == 1) ? "" : "s";
    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative")
        .html("<div class = \"sumRowNum\" style = \"width:" + numWidth +"px\";>" + comma(messages.updates.num_filter_rows_dropped) + "</div><div class = \"sumRowText\" style=\"width: calc(100% - " + (numWidth + 4) + "px)\"> row" + s2 + " removed by filter" + s2a + "</div>")
        .classed("hidden", function(){
            return +messages.updates.num_filter_rows_dropped == 0
        })

    var s4 = (messages.warnings.num_null_filter_rows_dropped == 1) ? "" : "s"
    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative summaryWarning")
        .html("<img class = \"warningIcon\" src = \"images/warnings.png\"><div class = \"sumRowNum\" style = \"width:" + numWidth +"px\";>" + comma(messages.warnings.num_null_filter_rows_dropped) + "</div><div class = \"sumRowText\" style=\"width: calc(100% - " + (numWidth + 4) + "px)\"> row" + s4 + " removed with null or missing filter columns</div>")
        .classed("hidden", function(){
            return +messages.warnings.num_null_filter_rows_dropped == 0
        })

    var s6 = (messages.warnings.num_out_of_geography_rows_dropped == 1) ? "" : "s"
    var w6 = (messages.warnings.num_out_of_geography_rows_dropped == 1) ? "was" : "were"
    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative summaryWarning")
        .html("<img class = \"warningIcon\" src = \"images/warnings.png\"><div class = \"sumRowNum\" style = \"width:" + numWidth +"px\";>" + comma(messages.warnings.num_out_of_geography_rows_dropped) + "</div><div class = \"sumRowText\" style=\"width: calc(100% - " + (numWidth + 4) + "px)\"> row" + s6 + " removed that " + w6 + " not within " + messages.updates.g_disp + "</div>")
        .classed("hidden", function(){
            return +messages.warnings.num_out_of_geography_rows_dropped == 0
        })

    var s3 = (messages.warnings.num_null_weight_rows_dropped == 1) ? "" : "s"
    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative summaryWarning")
        .html("<img class = \"warningIcon\" src = \"images/warnings.png\"><div class = \"sumRowNum\" style = \"width:" + numWidth +"px\";>" + comma(messages.warnings.num_null_weight_rows_dropped) + "</div><div class = \"sumRowText\" style=\"width: calc(100% - " + (numWidth + 4) + "px)\"> row" + s3 + " removed with null or missing weight columns</div>")
        .classed("hidden", function(){
            return +messages.warnings.num_null_weight_rows_dropped == 0
        })

    var s5 = (messages.warnings.num_null_latlon_rows_dropped == 1) ? "" : "s"
    sumContainer.append("div")
        .attr("class","summaryRows summaryNegative summaryWarning")
        .html("<img class = \"warningIcon\" src = \"images/warnings.png\"><div class = \"sumRowNum\" style = \"width:" + numWidth +"px\";>" + comma(messages.warnings.num_null_latlon_rows_dropped) + "</div><div class = \"sumRowText\" style=\"width: calc(100% - " + (numWidth + 4) + "px)\"> row" + s5 + " removed with null or missing latitude and/or longitude columns</div>")
        .classed("hidden", function(){
            return +messages.warnings.num_null_latlon_rows_dropped == 0
        })


    var s7 = (messages.updates.num_rows_final == 1) ? "" : "s"
    sumContainer.append("div")
        .attr("class","summaryRows bottomRow")
        .html("<div class = \"sumRowNum\" style = \"width:" + numWidth +"px\";>" + comma(messages.updates.num_rows_final) + "</div><div class = \"sumRowText\" style=\"width: calc(100% - " + (numWidth + 4) + "px)\"> total row" + s7 + " analyzed</div>")





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
        .html(function(d){
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
                    var dePadder = (widthBelow(768) || widthBelow(500)) ? 0 : 50;
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
function scootchHeaderX(){
    // if(d3.select(".summaryHeader").node().getBoundingClientRect().height > 30){
    //     d3.select(".headerX").classed("tall", true)
    // }else{
    //     d3.select(".headerX").classed("tall", false)
    // }
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
            showLoaderSection(d.item.value, getGeographyLevel())
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
    var clone = d3.select("#rawBarData").datum().slice(0)

    drawStaticBarChart(clone, getBaselineBar(), getSelectedSubgeo(), getGeographyLevel(), function(){
        saveSvgAsPng(document
            .getElementById("barChartImageSvg"), "spatial_equity_demographic_distribution", {backgroundColor: "#fff", "encoderOptions" : 1, "scale": 4 });
    })
})

//TO DO, more robust for geo level
d3.select(".resultsNav.startOverResults").on("click", startOver)

// [National/State/County/City Level]: [name of dataset] or “Your data”        Filter data  Weight data

d3.select(".resultsHeaderSubnav.filters").on("click", function(){
    showLoaderSection("filters", getGeographyLevel())
})
d3.select(".resultsHeaderSubnav.weight").on("click", function(){
    showLoaderSection("weight", getGeographyLevel())
})

$('#advancedOptionsHeader')
    .selectmenu({
        select: function(event, d){
            showLoaderSection(d.item.value, getGeographyLevel())
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


$( window ).resize( function(){
    resizeLoader()
    scootchHeaderX()
    if(d3.select(".chartRow svg").node() != null){
        updateBarChart(getBaselineBar())
        // var data = d3.selectAll(".barDot").data(),
        //     margin = getBarMargins("dynamic"),
        //     width = getBarWidth("dynamic"),
        //     height = getBarHeight("dynamic"),
        //     x = getBarX("dynamic", data);

        // d3.select("#barChartSvg .x.axis")
        //     .attr("transform", "translate(0,50)")      
        //     .call(d3.axisTop(x).tickSize(-height).tickSizeOuter(0).tickFormat(function(t){
        //         return t*100 + "%"
        //     }));

        // d3.selectAll("#barChartSvg .lollipop.background")
        //     .attr("x1", function(d){ return d.diff_data_city < 0 ? x(d.diff_data_city) : x(0); })
        //     .attr("x2", function(d){ return d.diff_data_city < 0 ? x(0) : x(d.diff_data_city)  })

        // d3.selectAll("#barChartSvg .lollipop.foreground")
        //     .attr("x1", function(d){ return d.diff_data_city < 0 ? x(d.diff_data_city) : x(0); })
        //     .attr("x2", function(d){ return d.diff_data_city < 0 ? x(0) : x(d.diff_data_city)  })

        // d3.selectAll("#barChartSvg #barZeroLine")
        //     .attr("x1", x(0))
        //     .attr("x2", x(0))

        // d3.selectAll("#barChartSvg .barDot")
        //     .attr("cx", function(d){ return x(d.diff_data_city); })

        // d3.selectAll("#barChartSvg .bar_full_name.background")
        //     .attr("x", function(d){
        //         if(widthBelow(500)) return 0
        //         else return d.diff_data_city < 0 ? x(0) + BAR_AXIS_LABEL_SCOOTCH : x(0) - BAR_AXIS_LABEL_SCOOTCH
        //     })

        // d3.selectAll("#barChartSvg .bar_full_name.foreground")
        //     .attr("x", function(d){
        //         if(widthBelow(500)) return 0
        //         else return d.diff_data_city < 0 ? x(0) + BAR_AXIS_LABEL_SCOOTCH : x(0) - BAR_AXIS_LABEL_SCOOTCH
        //     })




    }
})
