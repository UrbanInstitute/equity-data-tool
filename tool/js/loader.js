function setCSVProperties(){

}


function setDatasetType(datasetType){
  d3.selectAll(".activeDatasetType").classed("activeDatasetType", false)
  d3.select("#" + datasetType + "Button").classed("activeDatasetType", true)
}
function updateParams(param, value){
  var params = getParams();
  params[param] = value
  d3.select("#paramsData").datum(params)
}

function setLoaderBaseline(baseline){
    d3.selectAll(".baselineInstructionRow span.inlineBaselineText").text(getBaselineText(baseline).toLowerCase())

    d3.selectAll(".baselineRow").classed("active", false)
    d3.select(".baselineRow." + baseline).classed("active", true)

    d3.selectAll(".baselineRadio .radio.checked").classed("active", false)
    d3.selectAll(".baselineRadio .radio.unchecked").classed("active", true)
    d3.select(".baselineRow." + baseline + " .radio.checked").classed("active", true)
    d3.select(".baselineRow." + baseline + " .radio.unchecked").classed("active", false)
}





function loaderError(error, errorType){
  if(errorType == "upload"){
    d3.selectAll(".hideOption").classed("hiddenSection",true)
    return false;
  }
  if(errorType == "upload" || errorType == "latlon"){
    d3.select("#uploadErrors").style("display","block")  
    d3.select("#uploadErrors")
      .select(".errorText")
      .html(error)
    return false;
  }
  if(errorType == "weight"){
    d3.select(".saveButton.weight").classed("disabled", true)
    d3.select("#weightError").style("display","block")  
    d3.select("#weightError")
      .select(".errorText")
      .html(error)
    return false;
  }
  d3.select(".user.runButton").classed("disabled", true)
}
function hideLoaderError(errorType){
  if(errorType != "weight"){
    d3.select("#uploadErrors").style("display","none")
    d3.select(".user.runButton").classed("disabled", false)
  }

  d3.select("#weightError").style("display","none")
  d3.select(".saveButton.weight").classed("disabled", false)
}
function clearFilterOptions(){
    d3.select("#numericSelect").property("value","")
    d3.select("#textSelect").property("value","")
    d3.select("#startDateSelect").property("value","")
    d3.select("#endDateSelect").property("value","")
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
    })

  tag.on("mouseover", function(){
      d3.select(this).select(".filterTagText").style("white-space", "normal").style("text-overflow","normal")
    })
    .on("mouseout", function(){
      d3.select(this).select(".filterTagText").style("white-space", "nowrap").style("text-overflow","ellipsis")
    })

    clearFilterOptions();
}
function showLoaderSection(loaderSection){
  var params = getParams()
  d3.selectAll(".resultsContainer").style("display", "none")
  d3.selectAll(".loadingError").style("display","none")
  d3.select(".loaderHome").style("display","block")

  if(loaderSection == "filters"){
    var currentFilters = params.filters
    populateFilters(currentFilters)
    $('#columnSelect').selectmenu("refresh")
  }
  else if(loaderSection == "weight"){
    d3.select("#weightSelect").selectAll("option")
      .property("selected", function(){
        return this.value == params.weight
      })
    $('#weightSelect').selectmenu("refresh")
  }
  else if(loaderSection == "baseline"){
    setLoaderBaseline(params.baseline)
  }
  d3.selectAll(".loaderSection").classed("active", false)
  if(loaderSection != "home"){
    d3.select("#loaderContainer").style("display", "block")
    d3.select(".loaderSection." + loaderSection).classed("active", true)
    $('html, body').animate({ scrollTop: 0 }, 1200);
    d3.select(".loaderHome").style("opacity",0)
  }else if(loaderSection == "sample"){

  }
  else{
    d3.select("#loaderContainer").style("display", "none")
    d3.select(".loaderHome").style("opacity",1)
  }

}


function startOver(){
//TO DO clear file, this is causing bugs!
  d3.selectAll(".hideOption").classed("hiddenSection",true)
  d3.select("#dropboxClick").text("Choose a file")
  d3.select("#dropboxDrag").text("or drag it here").classed("filename", false)
  setLoaderBaseline("pop")
  populateDropdowns([])

  deselectSampleData()

  const p = Object.assign({}, defaultParams)
  d3.select("#paramsData").datum(p)
  showLoaderSection("home")
}
function init(){
  const p = Object.assign({}, defaultParams)
  d3.select("#paramsData").datum(p)
  showLoaderSection("home")
}
init()
