var CURRENT_SCROLL = 0;
function showMobileAdvanced(){
    d3.selectAll(".backButton").style("display","none")
    CURRENT_SCROLL = $(window).scrollTop()
    d3.select("#boorgerContainer").classed("ex", true)
    d3.select("#boorgerTop")
        .transition()
        .style("transform","rotate(45deg)")
        .style("top","7px")
    d3.select("#boorgerBottom")
        .transition()
        .style("transform","rotate(-45deg)")
        .style("bottom","7px")   
    d3.select("#mobileAdvancedMenu")
        .transition()
        .style("left", "0px")
        .on("end", function(){
            d3.select("body").classed("hideScroll", true)
        })
}
function hideMobileAdvanced(){
    d3.select("body").classed("hideScroll", false)
    window.scrollTo(0,CURRENT_SCROLL)
    d3.select("#mobileAdvancedMenu")
        .transition()
        .style("left", "-1000px ")
    d3.select("#mobileMainMenu")
        .style("left", "0px ")
        .on("end", function(){
            d3.selectAll(".backButton").style("display","block")
        })


}
function showMobileMain(){
    d3.selectAll(".backButton").style("display","none")
    CURRENT_SCROLL = $(window).scrollTop()
    d3.select("#boorgerContainer").classed("ex", true)
    d3.select("#boorgerTop")
        .transition()
        .style("transform","rotate(45deg)")
        .style("top","7px")
    d3.select("#boorgerBottom")
        .transition()
        .style("transform","rotate(-45deg)")
        .style("bottom","7px")   
    d3.select("#mobileAdvancedMenu")
        .transition()
        .style("left", "-1000px ")
    d3.select("#mobileMainMenu")
        .transition()
        .style("left", "0px")
        .on("end", function(){
            d3.select("body").classed("hideScroll", true)
        })

}
function hideMobileMain(){
    d3.select("body").classed("hideScroll", false)
    window.scrollTo(0,CURRENT_SCROLL)
    d3.select("#mobileMainMenu")
        .transition()
        .style("left", "-1000px")
    d3.select("#mobileAdvancedMenu")
        .transition()
        .style("left", "-1000px ")
    d3.select("#boorgerContainer").classed("ex", false)
    d3.select("#boorgerTop")
        .transition()
        .style("transform","rotate(0deg)")
        .style("top","3px")
    d3.select("#boorgerBottom")
        .transition()
        .style("transform","rotate(0deg)")
        .style("bottom","3px")
        .on("end", function(){
            d3.selectAll(".backButton").style("display","block")
        })   
}