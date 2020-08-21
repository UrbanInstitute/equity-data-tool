function getDatasetType(){
  // return "sample" or "user"
  return (d3.select(".activeDatasetType").classed("user")) ? "user" : "sample"
}
function getParams(){
  return  d3.select("#paramsData").datum()
}
function getWeight(){
    return d3.select("#weightSelect").node().value
}
function getBaseline(){
    return d3.select(".baselineRadio .radio.checked.active").node().parentNode.parentNode.getAttribute("data-baseline")
}
function getBaselineText(baseline){
    if(baseline == "daytime") return "Daytime (commuter-adjusted) population"
    else return d3.select(".baselineRow." + baseline + " .baselineText").text()
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

function getBarWidth(){
    var margin = getBarMargins();
    return 800 - margin.left - margin.right;
}
function getBarHeight(data){
    var margin = getBarMargins();
    // var h = (typeof(data) == "undefined") ? 500 : (500/21) * data.length
    var scalar = (typeof(data) == "undefined") ? 21 : data.length
    return ((700 - margin.top - margin.bottom)/21) * scalar;
}
function getBarMargins(){
    return {top: 50, right: 80, bottom: 0, left: 80}
}
function getBarX(data){
    var width = getBarWidth()
    return d3.scaleLinear()
        .range([0,width])
        .domain(d3.extent(data, function(d){ return d.diff_data_city; }));

}
function getBarY(data){
    var height = getBarHeight(data)
    var margin = getBarMargins();
    return d3.scaleBand()
        .rangeRound([height,margin.top])
        .padding(0.2)
        .domain(data.map(function(d) { return d.census_var; }));
}