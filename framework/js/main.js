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
    // d3.select("#tableContainer").selectAll("*").remove()


    var section = (window.location.hash == "") ? content["contents"][0]["slug"] : window.location.hash.replace("#","")
    buildToc(section, function(){
        loadSection(section, function(){
            buildResourceTable()
        })    
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
                    loadSection(d.slug, function(){})
                }
            })
        d3.select("#toc").append("div").attr("id","tocClose")
            .on("click", function(){
                d3.select("#toc")
                    .transition()
                    .ease(d3.easeBackIn.overshoot(1.7))
                    .duration(800)
                    .style("left", "-600px")
            })

    }
    callback()
}
function loadSection(section, callback){
    window.location.hash = "#" + section
    d3.select("#page").selectAll("*").remove()
    // d3.select("#tableContainer").selectAll("*").remove()

    if(!isPrintPage){
        d3.selectAll(".contentsHeader").classed("active", false)

        if(!content.pages.hasOwnProperty(section) && section != "resources") section = content["contents"][0]["slug"]

        var contentsHeader = d3.select(".contentsHeader." + section)
        contentsHeader.classed("active", true)
        if(contentsHeader.classed("question")) d3.select(".contentsHeader.questions").classed("active", true)
    }
    // console.log(section)
    if(section == "resources"){
        d3.select("#resourcesContainer").style("display","block")
        $("table").trigger("update")
    }else{
        d3.select("#resourcesContainer").style("display","none")
        var page = d3.select("#page").selectAll(".contentBlock")
            .data(content["pages"][section])
            .enter()
            .append("div")
            .attr("class", function(d){
                var pageType = (["intro","takeaways","conclusion","acknowledgments","resources"].indexOf(section) != -1) ? " topLevel" : " question"
                return "contentBlock " + d.contentType + " " + section + pageType
            })
            .html(function(d){
                var contentEl;
                if(d.contentType == "title") contentEl = getTitleEl(d.content, section)
                else if(d.contentType == "takeaways") contentEl = getTakeawayEl(d.content)
                else if(d.contentType == "paragraph") contentEl = getParagraphEl(d.content)
                else if(d.contentType == "caseStudy") contentEl = getCaseStudyEl(d.content)
                else if(d.contentType == "video") contentEl = getVideoEl(d.content)
                else if(d.contentType == "quote") contentEl = getQuoteEl(d.content)
                else if(d.contentType == "expand") contentEl = getExpandEl(d.content)
                else if(d.contentType == "sectionHeader") contentEl = getHeaderEl(d.content)
                else if(d.contentType == "orderedList") contentEl = getOrderedListEl(d.content)
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
    }

    initEvents()
    callback()
    window.scrollTo(0,0);
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
    d3.select("#chaptersTablet").on("click", function(){
        d3.select("#toc")
            .transition()
            .ease(d3.easeBackOut.overshoot(1.7))
            .duration(800)
            .style("left", "-60px")
    })
    d3.select("#boorgerContainer").on("click", function(){
        if(d3.select(this).classed("ex")){
            d3.select(this).classed("ex", false)
            d3.select("#boorgerTop")
                .transition()
                .style("transform","rotate(0deg)")
                .style("top","3px")
            d3.select("#boorgerBottom")
                .transition()
                .style("transform","rotate(0deg)")
                .style("bottom","3px")                
        }else{
            d3.select(this).classed("ex", true)
            d3.select("#boorgerTop")
                .transition()
                .style("transform","rotate(45deg)")
                .style("top","7px")
            d3.select("#boorgerBottom")
                .transition()
                .style("transform","rotate(-45deg)")
                .style("bottom","7px")   

        }
    })

    d3.selectAll(".tt-icon").on("mouseover", function(){
        var k = d3.select(this).attr("data-footnote")
        if(d3.select(this).selectAll(".tt-container").nodes().length > 0) return false
        var tt = d3.select(this).append("div").attr("class", "tt-container")
        tt.append("div")
            .html(content["footnotes"][k])
        tt.append("img")
            .attr("class", "tt-close")
            .attr("src","images/closeBlack.png")
            .on("mouseover", function(){
                d3.select(this).attr("src", "images/closeBlue.png")
            })
            .on("mouseout", function(){
                d3.select(this).attr("src", "images/closeBlack.png")
            })
            .on("click", function(){
                d3.select(this.parentNode).remove()
            })
    })

}
function getTitleEl(content, section){
    if(section == "intro"){
        var titleEl = d3.select("body").append("div").html(content)
    }else{
        var titleEl = d3.select("body").append("div")
        titleEl.append("div").attr("class", "eyebrow")
            .html("Creating Equitable Technology Programs")
        titleEl.append("div").html(content)


    }
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
            else if(d.contentType == "unorderedList"){
                var ulHtml = "<ul>"
                for(var i = 0; i < d.content.length; i++){
                    ulHtml += "<li>" + d.content[i] + "</li>"
                }
                ulHtml += "</ul>"
                return ulHtml
            }
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


    var heightLarge = expandEl.node().getBoundingClientRect().height - 133
    if(content.title == "Increasing transparency:"){
        heightLarge += (560*.63)
    }

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
function getOrderedListEl(content){
    var olEl = d3.select("body").append("ol")
        .attr("class", "mainContentUl")

    olEl.selectAll("li")
        .data(content)
        .enter()
        .append("li")
        .html(function(d){ return d})

    return olEl
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
function buildResourceTable(){
    // d3.csv('content/resources.csv')
    //     .then(function(data) {
    //         console.log(data)
    //         var table = d3.select("#tableContainer").append("table")

    //         table.append("thead").append("tr")
    //             .selectAll("th")
    //             .data(data.columns)
    //             .enter()
    //             .append("th")
    //             .html(function(d){ return d })
    //         var tr = table.append("tbody")
    //             .selectAll("tr")
    //             .data(data)
    //             .enter()
    //             .append("tr")

    //         for(var i = 0; i < data.columns.length; i++){
    //             tr.append("td")
    //                 .html(function(d){
    //                     var col = data.columns[i]
    //                     return getTableContent(col, d[col])
    //                 })
    //         }

    //         return (table.node())


    //     })
    //     .then(function(table){
            // var $table = $(table.node())
            $("#resourcesTable").tablesorter({
            theme: 'jui',
            showProcessing: true,
                  widthFixed: true,

            headerTemplate : '{content} {icon}',
            widgets: [ 'filter','uitheme', 'scroller' ],
            widgetOptions : {
              // scroll tbody to top after sorting
              // scroller_upAfterSort: true,
              // pop table header into view while scrolling up the page
              // scroller_jumpToHeader: true,

              scroller_height : 1000,
              // // set number of columns to fix
              // scroller_fixedColumns : 1,
              // // add a fixed column overlay for styling
              // scroller_addFixedOverlay : false,
              // // add hover highlighting to the fixed column (disable if it causes slowing)
              // scroller_rowHighlight : 'hover',

              // // bar width is now calculated; set a value to override
              // scroller_barWidth : 100
              // extra css class applied to the table row containing the filters & the inputs within that row
              // filter_cssFilter   : '',

              // // If there are child rows in the table (rows with class name from "cssChildRow" option)
              // // and this option is true and a match is found anywhere in the child row, then it will make that row
              // // visible; default is false
              // filter_childRows   : false,

              // // if true, filters are collapsed initially, but can be revealed by hovering over the grey bar immediately
              // // below the header row. Additionally, tabbing through the document will open the filter row when an input gets focus
              // filter_hideFilters : false,

              // // Set this option to false to make the searches case sensitive
              // filter_ignoreCase  : true,

              // // jQuery selector string of an element used to reset the filters
              // filter_reset : '.reset',

              // // Use the $.tablesorter.storage utility to save the most recent filters
              // filter_saveFilters : true,

              // // Delay in milliseconds before the filter widget starts searching; This option prevents searching for
              // // every character while typing and should make searching large tables faster.
              // filter_searchDelay : 300,

              // // Set this option to true to use the filter to find text from the start of the column
              // // So typing in "a" will find "albert" but not "frank", both have a's; default is false
              // filter_startsWith  : false,

              // Add select box to 4th column (zero-based index)
              // each option has an associated function that returns a boolean
              // function variables:
              // e = exact text from cell
              // n = normalized value returned by the column parser
              // f = search filter input value
              // i = column index

              filter_functions : {

                // Add select menu to this column
                // set the column value to true, and/or add "filter-select" class name to header
                // '.type' : true,

                // Exact match only
                // 5 : function(e, n, f, i, $r, c, data) {
                //   return e === f;
                // }

                // // Add these options to the select dropdown (regex example)
                // 2 : {
                //   "A - D" : function(e, n, f, i, $r, c, data) { return /^[A-D]/.test(e); },
                //   "E - H" : function(e, n, f, i, $r, c, data) { return /^[E-H]/.test(e); },
                //   "I - L" : function(e, n, f, i, $r, c, data) { return /^[I-L]/.test(e); },
                //   "M - P" : function(e, n, f, i, $r, c, data) { return /^[M-P]/.test(e); },
                //   "Q - T" : function(e, n, f, i, $r, c, data) { return /^[Q-T]/.test(e); },
                //   "U - X" : function(e, n, f, i, $r, c, data) { return /^[U-X]/.test(e); },
                //   "Y - Z" : function(e, n, f, i, $r, c, data) { return /^[Y-Z]/.test(e); }
                // },

                // // Add these options to the select dropdown (numerical comparison example)
                // // Note that only the normalized (n) value will contain numerical data
                // // If you use the exact text, you'll need to parse it (parseFloat or parseInt)
                // 4 : {
                //   "< $10"      : function(e, n, f, i, $r, c, data) { return n < 10; },
                //   "$10 - $100" : function(e, n, f, i, $r, c, data) { return n >= 10 && n <=100; },
                //   "> $100"     : function(e, n, f, i, $r, c, data) { return n > 100; }
                // }
              }

    

            }
          });
        // })
// $("table").trigger("update")

}

// function getTableContent(column, value){
//     if(column == "Link"){
//         return ("<a href = \"" + value + "\">" + value + "</a>")
//     }
//     else if(column == "Contact"){
//         return ("<a href = \"mailto:" + value + "\">" + value + "</a>")   
//     }
//     else if(column == "Referenced In"){
//         var sections = value.split(";").map(function(v){ return v.trim() })
//         var returned = ""
//         for(var i = 0; i < sections.length; i++){
//             returned += "<a href = \"index.html#" + content.contents[+sections[i] + 1]["slug"] + "\"><span class = \"resourceTableQ Q" + (+sections[i]) + "\">Q" + (+sections[i]) + "</span></a>"
//         }
//         return returned
//     }
//     else{
//         return value
//     }
// }
$(document).ready(function(){
    buildTakeawaysData()
    if(!isPrintPage){
        init()
    }
    else{
        loadSection("takeaways", function(){})
        window.print();  
    }

})


