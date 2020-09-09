function init(){
    d3.select("#toc").empty()
    d3.select("#page").empty()

    var section = (window.location.hash == "") ? content["contents"][0]["slug"] : window.location.hash.replace("#","")
    buildToc(section, function(){
        loadSection(section)    
    })
    
}
function buildToc(section, callback){
    var contents = content.contents
    var isMobile = false
    if(!isMobile){
        var contentHeader = d3.select("#toc").selectAll(".contentsHeader")
            .data(contents)
            .enter()
            .append("div")
            .attr("class",function(d){
                return "contentsHeader " + d.slug + " "  + d.contentType
            })
            .html(function(d){
                return d.menuName
            })
            .on("click", function(d){
                if(d.contentType != "header"){
                    loadSection(d.slug)
                }
            })
    }
    callback()
}
function loadSection(section){
    d3.select("#page").empty()
    d3.selectAll(".contentsHeader").classed("active", false)

    if(!content.pages.hasOwnProperty(section)) section = content["contents"][0]["slug"]
    var contentsHeader = d3.select(".contentsHeader." + section)
    contentsHeader.classed("active", true)
    if(contentsHeader.classed("question")) d3.select(".contentsHeader.questions").classed("active", true)
// console.log(content["pages"][section])
    var page = d3.select("#page").selectAll(".contentBlock")
        .data(content["pages"][section])
        .enter()
        .append("div")
        .attr("class", function(d){
            return "contentBlock " + d.contentType
        })
        .html(function(d){
            // var foo = d3.select("body").append("div")
            //     foo.append("p").html("xasdf").style("background","red")
            // // console.log(foo.node()

            // var content = foo.node().outerHTML
            // foo.remove()
            // return content
            var contentEl;
            if(d.contentType == "title") contentEl = getTitleEl(d.content)
            else if(d.contentType == "takeaways") contentEl = getTakeawayEl(d.content)
            else if(d.contentType == "paragraph") contentEl = getParagraphEl(d.content)
            else if(d.contentType == "caseStudy") contentEl = getCaseStudyEl(d.content)

            var contentHtml = contentEl.node().outerHTML
            contentEl.remove()
            return contentHtml
        })
}
function getTitleEl(content){
    var titleEl = d3.select("body").append("div").html(content)
    return titleEl
}
function getTakeawayEl(content){
    var takeawayEl = d3.select("body").append("div")
        .attr("class", "takeawayContainer")

    takeawayEl.append("div")
        .attr("class", "takeawayHeader")
        .text(function(){
            return (content.filter(function(o){ return o.contentType == "takeaway"}).length == 1 ) ? "Key takeaway" : "Key takeaways"
        })

    takeawayEl.append("ul")
        .attr("class", "takeawayUl")
        .selectAll(".takeawayLi")
        .data(content)
        .enter()
        .append("li")
        .attr("class","takeawayLi")
        .html(function(d){
            return (d.contentType == "caseStudy") ? "<span class = 'liStrong'>Case study:</span> " + d.content : d.content
         })

    return takeawayEl
}
function getParagraphEl(content){
    var paragraphEl = d3.select("body").append("p").html(content)
    return paragraphEl
}
function getCaseStudyEl(content){
    var caseStudyEl = d3.select("body").append("div")
        .attr("class", "caseStudyContainer")
    caseStudyEl.selectAll(".caseStudySubEl")
        .data(content)
        .enter()
        .append("div")
        .attr("class", function(d){
            return "caseStudySubEl " + d.contentType
        })
        .html(function(d){
            if(d.contentType == "title") return d.content
            else if(d.contentType == "paragraph") return d.content
            else if(d.contentType == "image") return "<img src = 'images/"  + d.content +"'>"
            else if(d.contentType == "footnote") return "<span>" + d.content.symbol + "</span>" + d.content.content
        })

    return caseStudyEl

}



init()