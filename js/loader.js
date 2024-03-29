function populateDownloadLinks(){
  for(var prop in sampleParams){
    d3.select(".sampleDownload." + prop).attr("href", baseDownloadUrl +  sampleParams[prop]["job_id"] + ".csv")
  }
}

function setDatasetType(datasetType, geographyLevel){
  d3.selectAll(".activeDatasetType").classed("activeDatasetType", false)
  d3.select("." + datasetType + "." + geographyLevel + ".homeButton").classed("activeDatasetType", true)
}
function updateParams(param, value){
  var params = getParams();
  params[param] = value
  d3.select("#paramsData").datum(params)
}

function setLoaderBaseline(baseline){
    d3.selectAll(".baselineInstructionRow span.inlineBaselineText").text(getBaselineMapText(baseline).toLowerCase())

    d3.selectAll(".baselineRow").classed("active", false)
    d3.select(".baselineRow." + baseline).classed("active", true)

    d3.selectAll(".baselineRadio .radio.checked").classed("active", false)
    d3.selectAll(".baselineRadio .radio.unchecked").classed("active", true)
    d3.select(".baselineRow." + baseline + " .radio.checked").classed("active", true)
    d3.select(".baselineRow." + baseline + " .radio.unchecked").classed("active", false)
}

function loaderError(error, errorType){
  if(errorType == "upload"){
    d3.select("#mobileAdvanced").classed("hidden", true)
    d3.selectAll(".hideOption").classed("hiddenSection",true)
    // return false;
    d3.selectAll(".user.runButton").classed("disabled", true)
    d3.select("#uploadInstructions").classed("hidden", false)
  }
  if(errorType == "upload" || errorType == "latlon"){
    d3.select("#uploadErrors").style("display","block")  
    d3.select("#uploadErrors")
      .select(".errorText")
      .html(error)
    // return false;
    d3.select("#dropbox").classed("uploadError", true)
    d3.selectAll(".user.runButton").classed("disabled", true)
  }
  if(errorType == "weight"){
    d3.select(".saveButton.weight").classed("disabled", true)
    d3.select("#weightError").style("display","block")  
    d3.select("#weightError")
      .select(".errorText")
      .html(error)
    // return false;
  }
  resizeLoader()
}
function hideLoaderError(errorType){
  if(errorType != "weight"){
    d3.select("#uploadErrors").style("display","none")
    d3.selectAll(".user.runButton").classed("disabled", false)
  }

  d3.select("#weightError").style("display","none")
  d3.select(".saveButton.weight").classed("disabled", false)
  d3.select("#dropbox").classed("uploadError", false)
  resizeLoader()
}
function clearFilterOptions(){
    d3.select("#addButton").style("margin-top", "-17px") 
    d3.selectAll(".filterContainer").classed("active", false)
    d3.selectAll(".loaderNote.filters").classed("active", false)

    d3.select("#numericSelect").property("value","")
    d3.select("#textSelect").property("value","")
    d3.select("#startDateSelect").property("value","")
    d3.select("#endDateSelect").property("value","")
    // resizeLoader()

}
function populateFilters(filters){
  d3.selectAll(".filterTag").remove()
  
  for(var i = 0; i<filters.length; i++){
    addToFilterList(filters[i])
  }
}
function getTagText(filter){
  var tagText = filter.filter_column + " ",
      compareText = (filter.filter_type == "date") ? "=" : d3.select("#numComSel option[value=\"" + filter.filter_comparison + "\"]").html(),
      filterType = filter.filter_type
  tagText += compareText + " "
  
  var filterValText = "";
  if(filterType == "string"){
    var filterList = filter.filter_val.split(",")
    if(filterList.length == 1){
      filterValText = "\"" + filterList[0] + "\""
    }
    else if(filterList.length == 2){
      filterValText = "\"" + filterList[0] + "\" or " + "\"" + filterList[1] + "\""
    }else{
      for(var i = 0; i < filterList.length; i++){
        var conj;
        if(i == filterList.length - 2) conj = ", or "
        else if(i == filterList.length - 1) conj = ""
        else conj = ", "
        filterValText += "\"" + filterList[i] + "\"" + conj
      }
    }
  }
  else if(filterType == "date"){
    filterValText = filter.filter_val.replace("-", " to ")
  }
  else if(filterType == "number"){
    filterValText = +filter.filter_val
  }

  tagText += filterValText

  return tagText  
}
function addToFilterList(filter){
  var tagText = getTagText(filter)

  
  var tag = d3.select("#filterList")
    .append("div")
    .attr("class", "filterTag visible")
    .datum(filter)

  tag.append("div")
    .attr("class","filterTagText")
    .html(tagText)

  closeTag = tag.append("div")
    .attr("class", "closeTag")

  closeTag.append("img")
    .attr("src", "images/closeTag.png")

  closeTag.on("mouseover", function(){
      d3.select(this).select("img").attr("src","images/closeTagHover.png")
    })
    .on("mouseout", function(){
      d3.select(this).select("img").attr("src","images/closeTag.png")
    })
    .on("click", function(){
      d3.select(this.parentNode).classed("visible",false)
      d3.select(".mobileTabFilterList span").text(d3.selectAll(".filterTag.visible").nodes().length)
      d3.select(".mobileTabFilterList").classed("disabled", function(){
        return (d3.selectAll(".filterTag.visible").nodes().length == 0);
      })
    })

  tag.on("mouseover", function(){
      d3.select(this).select(".filterTagText").style("white-space", "normal").style("text-overflow","normal")
    })
    .on("mouseout", function(){
      d3.select(this).select(".filterTagText").style("white-space", "nowrap").style("text-overflow","ellipsis")
    })

    clearFilterOptions();
    d3.select(".mobileTabFilterList span").text(d3.selectAll(".filterTag.visible").nodes().length)
    d3.select(".mobileTabFilterList").classed("disabled", function(){
      return (d3.selectAll(".filterTag.visible").nodes().length == 0);
    })
    resizeLoader()
}
function showLoaderSection(loaderSection, geographyLevel){
  populateGeographyElements(geographyLevel)

  var params = getParams()
  d3.selectAll(".resultsContainer").style("display", "none")
  d3.selectAll(".loadingError").style("display","none")
  d3.select(".loaderHome").style("display","block")
  d3.select("#header-pinned").attr("class", "no-touch " + loaderSection)

  if(loaderSection == "filters"){
    showFilterOptions()
    d3.select("#columnSelect").selectAll("option")
      .property("selected", function(){
        return this.value == ""
      })
    var currentFilters = params.filters
    populateFilters(currentFilters)
    $('#columnSelect').selectmenu("refresh")
  }
  else if(loaderSection == "weight"){
    d3.select("#weightSelect").selectAll("option")
      .property("selected", function(){
        return this.value == params.weight
      })
    d3.select("#weightSelected").html(function(){
      return (params.weight == "") ? "none selected" : params.weight
    })
    $('#weightSelect').selectmenu("refresh")
  }
  else if(loaderSection == "baseline"){
    setLoaderBaseline(params.baseline)
  }
  
  d3.selectAll(".loaderSection").classed("active", false)
  
  if(loaderSection == "user"){
    setHash(loaderSection + "-" + geographyLevel)
    d3.selectAll(".mobileTabSample").classed("active", false)
    d3.selectAll(".mobileTabUser").classed("active", true)
  }
  else if(loaderSection == "sample"){
    d3.selectAll(".mobileTabSample").classed("active", true)
    d3.selectAll(".mobileTabUser").classed("active", false)
    var slug = (getSampleDatasetSlug() == "") ? "sample" : getSampleDatasetSlug()
    if(slug == "sample") d3.selectAll(".sampleDownload").style("display","none")
    setHash(slug + "-" + geographyLevel)
  }
  else if(loaderSection != "home"){
    setHash(loaderSection)
  }

  if(loaderSection != "home"){
    d3.select("#loaderContainer").style("display", "block")
    d3.select(".loaderSection." + loaderSection).classed("active", true)
    var animateTime = (widthBelow(768) || widthBelow(500)) ? 10 : 1200
    $('html, body').animate({ scrollTop: 0 }, animateTime);
    d3.select(".loaderHome").style("opacity",0)
  }else if(loaderSection == "sample"){
  }
  else{
    d3.select("#loaderContainer").style("display", "none")
    d3.select(".loaderHome").style("opacity",1)
  }
  d3.select("#resultsSubnav")
    .transition()
    .style("top", "-200px")
  if(loaderSection != "home" && loaderSection != "loading"){
    d3.select("#header-pinned").classed("loading", true) 
  }

  resizeLoader()
  // d3.select("")

}
function populateGeographyElements(geographyLevel){
  d3.selectAll(".geographyLevelText.lowercase").text(geographyLevel)
  d3.selectAll(".geographyLevelText.sentencecase").text(geographyLevel[0].toUpperCase() + geographyLevel.slice(1))
  d3.selectAll(".geographyLevelText.possessive").html(function(){
    if(geographyLevel == "national") return "the US"
    else return "your " + geographyLevel + "&rsquo;s"
  })
  d3.selectAll(".geographyLevelText.resultsIntro").html(function(){
    if(geographyLevel == "national") return "across the United States"
    else return "in your " + geographyLevel
  })
  d3.selectAll(".geographyLevelText.US").text(function(){
    return (geographyLevel == "national") ? "US" : geographyLevel
  })
  d3.selectAll(".geographyLevelText.subgeo").html(function(){
    if(geographyLevel == "national") return "states"
    else if(geographyLevel == "state") return "counties"
    else return "census tracts"
  })
  d3.selectAll(".instructionNote").style("display", "none")
  d3.selectAll(".instructionNote." + geographyLevel).style("display","block") 

  d3.selectAll(".sampleCard").classed("hidden", true)
  d3.selectAll(".sampleCard." + geographyLevel).classed("hidden",false)   

}

function resizeLoader(){
  if(d3.select(".loaderSection.active").node() == null) return false
  var sectionHeight = d3.select(".loaderSection.active").node().getBoundingClientRect().height
  var homeHeight = (widthBelow(768) || widthBelow(500)) ? sectionHeight + 10 : sectionHeight + 130;
  d3.select(".loaderHome").style("height", homeHeight + "px")
  console.log(homeHeight)
  // if(homeHeight){
  //   d3.select("footer").style("position", "absolute").style("top", (homeHeight + 48) + "px")
  // }else{
  //   d3.select("footer").style("position", "relative")
  // }


  if(d3.select(".sampleDetails.active").node() != null && d3.select(".sampleCard.singleCard").node() != null){
    var rightCol = d3.select(".sampleDetails.active").node().getBoundingClientRect().height,
        leftCol = d3.select(".sampleCard.singleCard").node().getBoundingClientRect().height,
        h;
    if(widthBelow(768) || widthBelow(500)){
      d3.select("#sampleButtonContainer").style("top", (-40) + "px")
    }else{
      if(rightCol > leftCol) d3.select("#sampleButtonContainer").style("top", (rightCol - leftCol + 188) + "px")
      else d3.select("#sampleButtonContainer").style("top", (188) + "px")     
    }

  }
}

function selectSampleData(sample){
    setHash(sample + "-" + getGeographyLevel())

    d3.select("#sampleCardContainer").classed("single", true)

    d3.selectAll(".sampleRect").classed("active", false)
    d3.select(".sampleRect." + sample).classed("active", true)
    d3.select(".sampleCard." + sample).classed("active", true).classed("singleCard", true)
    d3.select("#sampleDefaultText").classed("hiddenSection", true)

    var colNames = sampleParams[sample]["colNames"]
    var csvCols = sampleParams[sample]["csvCols"]
    var defaultParams = sampleParams[sample]["defaultParams"]
    var fileSize = 1000

    const p = Object.assign({}, defaultParams)

    d3.select("#paramsData").datum(p)

    d3.selectAll(".sampleDetails").classed("active",true)

    populateDropdowns(colNames)
    d3.select("#csvProperties").datum({"size": fileSize, "cols": csvCols })
    d3.select("#mobileAdvanced").classed("hidden", false)
    d3.selectAll(".hideOption.sample").classed("hiddenSection",false)

    d3.selectAll(".sampleCard").classed("inactive", true)
    d3.select(".sampleCard." + sample).classed("inactive", false)

    d3.selectAll(".sampleDownload").style("display","none")
    d3.selectAll(".sampleDownload." + sample).style("display","block")

    d3.selectAll(".deetEl").remove()
    d3.selectAll(".appEl").remove()
    d3.select(".appliedDeetHeader").style("display", "none")


    var currentParams = getParams()

    if(defaultParams.weight != ""){
        d3.select(".sampleDeetContainer").append("div")
            .attr("class", "deetSubHed deetEl")
            .text("Weighted by:")
        var deetRow = d3.select(".sampleDeetContainer").append("div")
            .attr("class", "deetRow weight deetEl")
        deetRow.append("img")
            .attr("src", "images/check.png")
        deetRow.append("div")
            .attr("class", "deetText")
            .text(defaultParams.weight)
            .append("div")
            .attr("class", "strikethrough deetEl hidden")
    }
    else if(defaultParams.filters.length > 0){
        sampleParamType = (defaultParams.filters.length == 1) ? "Filter:" : "Filters:"
        d3.select(".sampleDeetContainer").append("div")
            .attr("class", "deetSubHed deetEl")
            .text(sampleParamType)
        var deetRow = d3.select(".sampleDeetContainer")
            .selectAll(".deetRow")
            .data(defaultParams.filters)
            .enter()
            .append("div")
            .attr("class", "deetRow filter deetEl")
            .attr("data-column", function(d){ return d.filter_column})
            .attr("data-comparison", function(d){ return d.filter_comparison})
            .attr("data-val", function(d){ return d.filter_val})
        deetRow.append("img")
            .attr("src", "images/check.png")
        deetRow.append("div")
            .attr("class", "deetText")
            .text(function(d){
                return getTagText(d)
            })     
            .append("div")
            .attr("class", "strikethrough filter deetEl hidden")   
    }else{
        var deetRow = d3.select(".sampleDeetContainer").append("div")
            .attr("class", "deetRow none deetEl")

        deetRow.append("div")
            .attr("class", "deetText")
            .text("None")
            .append("div")
            .attr("class", "strikethrough deetEl hidden")
    }
    resizeLoader()
}
function updateSampleParams(paramType){
  d3.selectAll(".appEl").remove()

  var currentP = getParams(),
      sampleP = sampleParams[getSampleDatasetSlug()]["defaultParams"]

//none
  if(d3.select(".deetRow.none").node() != null){
    if(currentP.weight != "" || currentP.filters.length > 0){
      d3.select(".deetRow.none .strikethrough").classed("hidden",false)
      d3.select(".deetRow.none").classed("strike", true)
    }else{
      d3.select(".deetRow.none .strikethrough").classed("hidden",true)
      d3.select(".deetRow.none").classed("strike", false)
    }
  }

//weight
  if(currentP.weight != sampleP.weight){
    if(d3.select(".deetRow.weight").node() != null){
      d3.select(".deetRow.weight .strikethrough").classed("hidden",false)
      d3.select(".deetRow.weight").classed("strike", true)
    }
    
    d3.select(".appliedDeetContainer").append("div")
        .attr("class", "appSubHed appEl")
        .text("Weighted by:")

    var appRow = d3.select(".appliedDeetContainer").append("div")
        .attr("class", "appRow weight appEl")
    appRow.append("img")
        .attr("src", "images/check.png")
    appRow.append("div")
        .text(function(){
          return (currentP.weight == "") ? "None" : currentP.weight
        })
  }else{
    if(d3.select(".deetRow.weight").node() != null){
      d3.select(".deetRow.weight .strikethrough").classed("hidden",true)
      d3.select(".deetRow.weight").classed("strike", false)
    }
  }


//filters
  var newFilters = 0;
  
  d3.select(".appliedDeetContainer").append("div")
      .attr("class", "appSubHed filter appEl")

  d3.selectAll(".strike.filter").classed("strike", false)
  d3.selectAll(".filter.strikethrough").classed("hidden",true)
  d3.selectAll(".deetRow.filter:not(.none)")
    .each(function(d){
      // console.log("d",d)
      if(currentP.filters.filter(function(o){
        // console.log("o",o)
        return o.filter_column == d.filter_column && o.filter_comparison == d.filter_comparison && o.filter_val == d.filter_val
      }).length == 0){
        var strikeRow = d3.select(".deetRow[data-comparison='" + d.filter_comparison + "'][data-column='" + d.filter_column + "'][data-val='" + d.filter_val + "']")
        strikeRow.classed("strike", true)
        strikeRow.select(".strikethrough").classed("hidden", false)
      }
    })

  for(var i = 0; i < currentP.filters.length; i++){
    var f = currentP.filters[i]
    var match = d3.select(".deetRow[data-comparison='" + f.filter_comparison + "'][data-column='" + f.filter_column + "'][data-val='" + f.filter_val + "']")

    if(match.node() == null){
      newFilters += 1
      var appRow = d3.select(".appliedDeetContainer")
          .append("div")
          .datum(f)
          .attr("class", "appRow filter appEl")
      appRow.append("img")
          .attr("src", "images/check.png")
      appRow.append("div")
          .html(function(d){
              return getTagText(d)
          })     
      }
    }

    if(newFilters == 0){
      d3.select(".appSubHed.filter").style("display", "none")
    }
    else if(newFilters == 1){
      d3.select(".appSubHed.filter").text("Filter:")
    }else{
      d3.select(".appSubHed.filter").text("Filters:")
    }   

    if(newFilters == 0 && currentP.weight == sampleP.weight){
      d3.select(".appliedDeetHeader").style("display", "none")
    }else{
      d3.select(".appliedDeetHeader").style("display", "block")
    }
    resizeLoader()

}

function startOver(slug, geographyLevel){
  if(typeof(geographyLevel) == "undefined") geographyLevel = getGeographyLevel()
  if(typeof(slug) == "undefined") slug = ""
  if(slug == ""){
    window.location = "index.html"
  }else{
    showLoaderSection(slug, geographyLevel)
    setTimeout(function(){location.reload()}, 10);
  }

}
function init(){
  var fullSlugList = window.location.hash.replace("#","").split("-"),
      loaderSection,
      geographyLevel;
  setHash(window.location.hash.replace("#",""), true)

  if(fullSlugList.length == 1){
    loaderSection = ""
    geographyLevel = "city"
  }
  else if((["city","county","state","national"].indexOf(fullSlugList[1]) == -1)){
    loaderSection = ""
    geographyLevel = "city"  
  }else{
    loaderSection = fullSlugList[0]
    geographyLevel = fullSlugList[1]
  }

  populateDownloadLinks();

  if(sampleParams.hasOwnProperty(loaderSection) ){
    geographyLevel = sampleParams[loaderSection]["geographyLevel"]

    setDatasetType("sample", geographyLevel)
    const p = Object.assign({}, sampleParams[loaderSection]["defaultParams"])
    d3.select("#paramsData").datum(p)

    showLoaderSection("sample", geographyLevel)
    selectSampleData(loaderSection)
  }else{
    const p = Object.assign({}, defaultParams)
    d3.select("#paramsData").datum(p)

    if(loaderSection == ""){
      setDatasetType("user", "city")
      showLoaderSection("home", "city")
    }
    else if(loaderSection == "user"){
      setDatasetType("user", geographyLevel)
      showLoaderSection("user", geographyLevel)
    }
    else if(loaderSection == "sample"){
      setDatasetType("sample", geographyLevel)
      showLoaderSection("sample", geographyLevel)
    }
    else{
      setDatasetType("user", "city")
      showLoaderSection("home", "city")
    }
  }

}
init()
