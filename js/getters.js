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
function getBaselineMap(){
    return d3.select("#baselineSelectMap").node().value
}
function getBaselineMapText(baseline){
    return d3.select("#baselineSelectMap option[value=" + baseline + "]").text()
}
function getBaselineBar(){
    return d3.select("#baselineSelectBar").node().value
}
function getBaselineBarText(baseline){
    return d3.select("#baselineSelectBar option[value=" + baseline + "]").text()
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
        var pad = 0;
        if(widthBelow(1000)){
            w = d3.select("#resultsFiguresBottom").node().getBoundingClientRect().width + pad
        }
        if(widthBelow(768) || widthBelow(500)){
            w = window.innerWidth - 40;
        }
        else{
            w = d3.select("#resultsFiguresBottom").node().getBoundingClientRect().width - 20
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
    var leftColW = (widthBelow(768) || widthBelow(500)) ? 0 : 410;
    var width = getBarWidth(containerType) - leftColW - 10,
        bound = Math.max(max, Math.abs(min))
    
    return d3.scaleLinear()
        .range([10,width])
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
function getBarTooltipText(geo, baseline, isSubGeo,fullName, shortName, d_score, fips, s_diff){
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
    if (fullName == "US") fullName = "the US"

    if(s_diff) return "Across <span class = \"barTT-name\">" + fullName + "</span>, your data come from neighborhoods that, on average, have " + globalPercent(Math.abs(d_score/100)).replace("%","")+ " percent " + sign + " " + pplLabel + " in this demographic group than the whole " + comparisonGeo + "."
    else return "Across the neighborhoods your data come from, we find no statistically significant difference between the share of " + pplLabel + " in this demographic group and the whole " + comparisonGeo + "."
}
function getSelectedSubgeo(){
    var geo = getGeographyLevel()
    if(geo == "national"){
        var selected = d3.select("#subgeoSelect").node().value
        if(selected == "none") return ""
        else if(selected.search("fips") != -1) return {"level" : "state", "id": selected}
        else return {"level" : "region", "id": selected}
    }
    else if(geo == "state"){
        var selected = d3.select("#subgeoSelect").node().value
        if(selected == "none") return ""
        else return {"level" : "county", "id": selected}
    }else{
        return ""
    }
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