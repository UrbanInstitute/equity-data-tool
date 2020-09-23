function showMobileAdvanced(){
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
        .style("left", "0px ")
}
function hideMobileAdvanced(){
    d3.select("#mobileAdvancedMenu")
        .transition()
        .style("left", "-1000px ")
    d3.select("#mobileMainMenu")
        .style("left", "0px ")

}
function showMobileMain(){
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

}
function hideMobileMain(){
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
}


// function closeBoorger(){
     
//     d3.select("#toc")
//         .transition()
//         // .ease(d3.easeBackOut.overshoot(1.7))
//         .duration(800)
//         .style("top", "-1100px")
// }
function openBoorger(){

    d3.select("#toc")
        .transition()
        // .ease(d3.easeBackIn.overshoot(1.7))
        .duration(800)
        .style("top", "51px")
}