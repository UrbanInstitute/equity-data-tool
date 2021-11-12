function getDatasetType(){
  // return "sample" or "user"
  return (d3.select(".activeDatasetType").node() == null || d3.select(".activeDatasetType").classed("user") ) ? "user" : "sample"
}
function getGeographyLevel(){
  if(d3.select(".activeDatasetType").node() == null){
    return "city"
  }
  else{
    return d3.select(".activeDatasetType").attr("data-geo")
  }
}
function getParams(){
  return  d3.select("#paramsData").datum()
}
function getWeight(){
    return (d3.select("#weightSelect").node().value == "") ? "" : d3.select("#weightSelect").node().value;
}
function getBaseline(){
    return d3.select("#baselineSelect").node().value
}
function getBaselineText(baseline){
    return d3.select("#baselineSelect option[value=" + baseline + "]").text()
}
function getCSVProperties(){
  return  d3.select("#csvProperties").datum()
}

function getCurrentFilter(){
    var filterCol = d3.select("#columnSelect").node().value,
        filterType = (filterCol == "") ? false : getCSVProperties()["cols"][filterCol],
        filterComparisonNumeric = d3.select("#numComSel").node().value,
        filterComparisonText = d3.select("#textComSel").node().value,
        filterValNumeric = d3.select("#numericSelect").node().value,
        filterValText = d3.select("#textSelect").node().value,
        filterDateType = (d3.select("#dateRangeBox").classed("active")) ? "dateRange" : "singleDate",
        filterStartDate = d3.select("#startDateSelect").node().value.replace(/\-/g,"/"),
        filterEndDate = d3.select("#endDateSelect").node().value.replace(/\-/g,"/")
    var filter = {
        "filter_type" : filterType,
        "filter_column" : filterCol
    }
    if(!filterType){
      return {}
    }
    if(filterType == "number"){
        filter.filter_comparison = filterComparisonNumeric
        filter.filter_val = +filterValNumeric;
    }
    else if(filterType == "string"){
        filter.filter_comparison = filterComparisonText
        filter.filter_val = filterValText
    }
    else if(filterType == "date"){
        var startDate = filterStartDate.substring(5)+ "/" + filterStartDate.substring(0,4)
        var endDate = filterEndDate.substring(5)+ "/" + filterEndDate.substring(0,4)
        filter.filter_comparison = filterDateType
        filter.filter_val = (filterDateType == "singleDate") ? startDate : startDate + "-" + endDate
    }else{
        console.error(filterType + " is not a valid filter type")

    }
    return filter


    // return ["foo"]
}

function getBarWidth(containerType){
    var margin = getBarMargins(containerType);
    var w;
    if(containerType == "static") w = 800
    else{
        var pad = (widthBelow(768) || widthBelow(500)) ? 120 : 0;
        if(widthBelow(1000) || widthBelow(768) || widthBelow(500)){
            w = d3.select("#resultsFiguresBottom").node().getBoundingClientRect().width + pad
        }else{
            w = d3.select("#resultsFiguresBottom").node().getBoundingClientRect().width
        }
    }
    return w;
}
function getBarHeight(containerType, baseline){
    var margin = getBarMargins(containerType);
    var h;
    if(containerType == "static") h = 700;
    else h = 700
    return h
    // var scalar = (typeof(data) == "undefined") ? 19 : data.length
    // return ((700 - margin.top - margin.bottom)/19) * scalar;
}
function getBarMargins(containerType){
    return (containerType == "dynamic") ? {top: 50, right: 60, bottom: 0, left: 60} : {top: 50, right: 30, bottom: 20, left: 20}
}
function getBarX(containerType, max, min){
    var width = getBarWidth(containerType) - 410 - 10,
        bound = Math.max(max, min)
    
    return d3.scaleLinear()
        .range([0,width])
        .domain([-bound, bound]);

}
function getBarY(containerType, data){
    var height = getBarHeight(containerType, data)
    var margin = getBarMargins(containerType);
    return d3.scaleBand()
        .rangeRound([height,0])
        .padding(.2)
        .domain(data.map(function(d) { return d.census_var; }));
}
function getBarTooltipText(geo, baseline, isSubGeo,fullName, shortName, d_score, fips){
    console.log(geo, baseline, isSubGeo, fullName, shortName, d_score, fips)
    var sign = (d_score < 0) ? "fewer" : "more"
    var pplLabel;
    var comparisonGeo;

    if(baseline == "total_pop") pplLabel = "residents"
    else if(baseline == "under18_pop") pplLabel = "children"
    else if(baseline == "pov_pop") pplLabel = "residents with extremely low incomes"
    else pplLabel = "residents" //should be unreachable

    if(geo == "national"){
        comparisonGeo = (isSubGeo) ? "state" : "country"
    }
    else if(geo == "state"){
        comparisonGeo = (isSubGeo) ? "county" : "state"
    }else{
        comparisonGeo = geo;
    }



    return "Across " + fullName + ", your data come from neighborhoods that, on average, have " + globalPercent(Math.abs(d_score/100)).replace("%","")+ " percent " + sign + " " + pplLabel + " in this demographic group than the whole " + comparisonGeo
}
function getSelectedSubgeo(){
    return ""
    // return {"level": "county", "id": ""}
}
function getMapHeight(){
    return 500;
}
function getMapLegendHeight(){
    return (widthBelow(1200) || widthBelow(1000) || widthBelow(768) || widthBelow(500)) ? 105 : 87;
}
function getLegendWidth(){
    return widthBelow(500) ? d3.select("#mapControls").node().getBoundingClientRect().width : 380;   
}
function getSampleDatasetId(){
    var sampleId = ""
    for(var prop in sampleParams){
        if(d3.select(".sampleRect.active").classed(prop)) sampleId = sampleParams[prop]["job_id"] + ".csv"
    }

    return sampleId
}
function getSampleDatasetSlug(){
    if(d3.select(".sampleRect.active").node() == null) return ""

    var sampleSlug = ""
    for(var prop in sampleParams){
        if(d3.select(".sampleRect.active").classed(prop)) sampleSlug = prop
    }

    return sampleSlug
}