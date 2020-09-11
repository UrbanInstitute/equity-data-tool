function buildTakeawaysData(){
    var sections = content.contents.map(function(o){ return o.slug } )

    // a1.splice.apply(a1, [2, 0].concat(a2));

    var takeaways = []
    for(var i = 0; i < sections.length; i++){
        var section = sections[i]
        var page = content["pages"][section]
        // console.log(section, page)
        if(typeof(page) == "undefined") continue
        var takeawayList = page.filter(function(o){ return o.contentType == "takeaways" })
        if(takeawayList.length == 0) continue
        else var takeaway = takeawayList[0]
        var bullets = takeaway.content.filter(function(o){ return o.contentType == "takeaway" })
        var title = page.filter(function(o){ return o.contentType == "title" })[0].content

        takeaways.push({"contentType" : "sectionHeader", "content" : title })

        takeaways.push({"contentType" : "unorderedList", "content" : (bullets.map(function(o){ return o.content } )) })


    }
    console.log(takeaways)
    content.pages.takeaways.splice.apply(content.pages.takeaways, [3,0].concat(takeaways))
    console.log(content.pages.takeaways)

}
function init(){
    d3.select("#toc").selectAll("*").remove()
    d3.select("#page").selectAll("*").remove()


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
    window.location.hash = "#" + section
    d3.select("#page").selectAll("*").remove()
    if(!isPrintPage){
        d3.selectAll(".contentsHeader").classed("active", false)

        if(!content.pages.hasOwnProperty(section)) section = content["contents"][0]["slug"]

        var contentsHeader = d3.select(".contentsHeader." + section)
        contentsHeader.classed("active", true)
        if(contentsHeader.classed("question")) d3.select(".contentsHeader.questions").classed("active", true)
    }

// console.log(content["pages"][section])
    var page = d3.select("#page").selectAll(".contentBlock")
        .data(content["pages"][section])
        .enter()
        .append("div")
        .attr("class", function(d){
            var pageType = (["intro","takeaways","conclusion","acknowledgments","resources"].indexOf(section) != -1) ? " topLevel" : " question"
            return "contentBlock " + d.contentType + " " + section + pageType
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
            else if(d.contentType == "video") contentEl = getVideoEl(d.content)
            else if(d.contentType == "quote") contentEl = getQuoteEl(d.content)
            else if(d.contentType == "expand") contentEl = getExpandEl(d.content)
            else if(d.contentType == "sectionHeader") contentEl = getHeaderEl(d.content)
            else if(d.contentType == "unorderedList") contentEl = getUnorderedListEl(d.content)
            else if(d.contentType == "toolBox") contentEl = getToolBoxEl(d.content)
            else if(d.contentType == "printParagraph") contentEl = getPrintParagraphEl(d.content)
            else if(d.contentType == "urbanLogo") contentEl = getPrintLogo()
            else if(d.contentType == "credits") contentEl = getCreditsEl(d.content)
            
            else contentEl = d3.select("body").append("div").html(d.content)

            if(isPrintPage) d3.select("body").classed("print", true)
            else d3.select("body").classed("print", false)

            var contentHtml = contentEl.node().outerHTML
            contentEl.remove()
            return contentHtml
        })

    initEvents()
}
function initEvents(){
    d3.selectAll(".expandControl").on("click", function(d){
        var heightSmall = d3.select(this).attr("data-heightSmall")
        var heightLarge = d3.select(this).attr("data-heightLarge")
        console.log(heightSmall, heightLarge)
        if(d3.select(this).classed("plus")){
            d3.select(this).classed("plus", false)
            d3.select(this).select(".expandControlText").text("less")
            d3.select(this).select(".expandVert").transition().style("transform","rotate(90deg)")
            d3.select(this.parentNode).select(".expandSmall").style("display","none")
            d3.select(this.parentNode).select(".expandFull").style("display","block")
            d3.select(this.parentNode).transition().style("height", heightLarge + "px")
        }else{
            d3.select(this).classed("plus", true)
            d3.select(this).select(".expandControlText").text("more")
            d3.select(this).select(".expandVert").transition().style("transform","rotate(0deg)")
            d3.select(this.parentNode).select(".expandSmall").style("display","block")
            d3.select(this.parentNode).select(".expandFull").style("display","none")
            d3.select(this.parentNode).transition().style("height", heightSmall + "px")
        }
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
function getPrintParagraphEl(content){
    var printParagraphEl = d3.select("body").append("p").classed("printView", true).html(content)
    return printParagraphEl
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
function getVideoEl(content){
    var videoEl = d3.select("body").append("video")
    videoEl.property("autoplay", true)
        .style("width","100%")
        .property("loop", true)
        .attr("muted", true)
        // .property("controls", true)
        .attr("preload", "auto")
    videoEl.append("source")
        .attr("src", "images/" + content)
        .attr("type", "video/mp4")
    return videoEl

}
function getQuoteEl(content){
    var quoteEl = d3.select("body").append("div")
        .attr("class", "quoteContainer")
    quoteEl.append("div")
        .attr("class", "quoteQuote")
        .html("&ldquo;" + content.quote + "&rdquo;")
    var source = quoteEl.append("div")
        .attr("class", "quoteSource")
    source.append("div")
        .attr("class", "quoteSourceName")
        .html(content.sourceName)
    source.append("div")
        .attr("class", "quoteSourceInfo")
        .html(", " + content.sourceInfo)

    return quoteEl;
}
function getExpandEl(content){
    var expandEl = d3.select("#page").append("div")
        .attr("class", "expandContainer")

    expandEl.append("div")
        .attr("class","expandTitle")
        .html(content.title)
    var expandSmall = expandEl.append("div")
        .attr("class","expandSmall")
        .html(content.small + "&hellip;")

    var heightSmall = expandEl.node().getBoundingClientRect().height - 103

    expandSmall.style("display","none")

    var expandFull = expandEl.append("div")
        .attr("class", "expandFull")

    expandFull.selectAll(".expandSubEl")
        .data(content.content)
        .enter()
        .append("div")
        .attr("class", function(d){
            return "expandSubEl " + d.contentType
        })
        .html(function(d){
            if(d.contentType == "paragraph") return d.content
            else if(d.contentType == "orderedList"){
                var olHtml = "<ol>"
                for(var i = 0; i < d.content.length; i++){
                    olHtml += "<li>" + d.content[i] + "</li>"
                }
                olHtml += "</ol>"
                return olHtml
            }
            else if(d.contentType == "unorderedList"){
                var ulHtml = "<ul>"
                for(var i = 0; i < d.content.length; i++){
                    ulHtml += "<li>" + d.content[i] + "</li>"
                }
                ulHtml += "</ul>"
                return ulHtml
            }
        })

    var heightLarge = expandEl.node().getBoundingClientRect().height - 103

    expandSmall.style("display","block")
    expandFull.style("display","none")

    var expandControl = expandEl.append("div")
        .attr("class", "expandControl plus")
        .attr("data-heightSmall", heightSmall)
        .attr("data-heightLarge", heightLarge)
    expandControl.append("div")
        .attr("class", "expandControlText")
        .text("more")
    var plus = expandControl.append("div")
        .attr("class", "expandPlus")
    plus.append("div")
        .attr("class", "expandVert")
    plus.append("div")
        .attr("class", "expandHor")
    expandEl.style("height", heightSmall + "px")


    // console.log(heightSmall, heightLarge)

    return expandEl

}
function getHeaderEl(content){
    var headerEl = d3.select("body").append("h3").html(content)
    return headerEl
}
function getUnorderedListEl(content){
    var ulEl = d3.select("body").append("ul")
        .attr("class", "mainContentUl")

    ulEl.selectAll("li")
        .data(content)
        .enter()
        .append("li")
        .html(function(d){ return d})

    return ulEl
}
function getToolBoxEl(content){
    var toolboxEl = d3.select("body").append("div")
        .attr("class", "toolboxEl")
    toolboxEl.selectAll(".toolBoxSubEl")
        .data(content)
        .enter()
        .append("div")
        .attr("class", function(d){
            return "toolBoxSubEl " + d.contentType
        })
        .html(function(d){
            if(d.contentType == "title") return d.content
            else if(d.contentType == "paragraph") return d.content
            else if(d.contentType == "image"){
                var imgHtml = "<div class = 'toolBoxImg'>"
                imgHtml += "<img src = 'images/"  + d.content +"'>"
                imgHtml += "<div><a href = '' target = '_blank'>Click to learn more</a></div>"
                return imgHtml
            }
        })

    return toolboxEl
}
function getPrintLogo(){
    var logoEl = d3.select("body").append("img").attr("src", "images/print-logo-full.png")
    return logoEl
}
function getCreditsEl(content){
    var creditsEl = d3.select("body").append("div")
    creditsEl.append("div")
        .attr("class","credHed")
        .text("Project Credits")

    var creditBlock = creditsEl.selectAll(".creditBlock")
        .data(content.credits)
        .enter()
        .append("div")
        .attr("class","creditBlock")

    creditBlock.append("div")
        .attr("class", "jobTitle")
        .text(function(d){ return d[0] })
    creditBlock.append("div")
        .attr("class", "jobNames")
        .text(function(d){ return d[1] })

    creditsEl.append("div")
        .attr("class","ghLink")
        .html("<a href = \"" + content.github + "\" target = \"_blank\">View this project on GitHub</a>")


    return creditsEl
}

buildTakeawaysData()
if(!isPrintPage) init()
else{
    loadSection("takeaways")
    window.print();  
}