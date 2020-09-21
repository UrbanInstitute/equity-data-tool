function getDatasetType(){
  // return "sample" or "user"
  return (d3.select(".activeDatasetType").node() == null || d3.select(".activeDatasetType").classed("user") ) ? "user" : "sample"
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
    else w = d3.select("#resultsFiguresBottom").node().getBoundingClientRect().width - 365
    return w - margin.left - margin.right;
}
function getBarHeight(containerType, data){
    var margin = getBarMargins(containerType);
    // var h = (typeof(data) == "undefined") ? 500 : (500/21) * data.length
    var h;
    if(containerType == "static") h = 700;
    else h = 700
    
    var scalar = (typeof(data) == "undefined") ? 19 : data.length
    return ((700 - margin.top - margin.bottom)/19) * scalar;
}
function getBarMargins(containerType){
    return (containerType == "dynamic") ? {top: 50, right: 60, bottom: 0, left: 60} : {top: 50, right: 30, bottom: 20, left: 20}
}
function getBarX(containerType, data){
    var width = getBarWidth(containerType)
    var max = d3.max(data, function(d){ return d.diff_data_city; }),
        min = Math.abs(d3.min(data, function(d){ return d.diff_data_city; })),
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

function getMapHeight(){
    return 500;
}
function getSampleDatasetId(){
    if (d3.select(".sampleRect.active").classed("three11"))return "new_orleans_311.csv"
    else if (d3.select(".sampleRect.active").classed("hotspots")) return "new_york_wifi.csv"
    else if (d3.select(".sampleRect.active").classed("bike")) return "minneapolis_bikes.csv"
    else return ""
}
function getSampleDatasetSlug(){
    if(d3.select(".sampleRect.active").node() == null) return ""
    else if (d3.select(".sampleRect.active").classed("three11"))return "three11"
    else if (d3.select(".sampleRect.active").classed("hotspots")) return "hotspots"
    else if (d3.select(".sampleRect.active").classed("bike")) return "bike"
    else return ""
}