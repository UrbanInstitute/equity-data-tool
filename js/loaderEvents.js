function handleFiles(inputFiles){
    var fileList;
    const p = Object.assign({}, defaultParams)
    d3.select("#paramsData").datum(p)

    if(inputFiles.type == "change"){
        //click to upload
        fileList = this.files
    }else{
        fileList = inputFiles
    }
    if (fileList.length !== 1){
        // loaderError("You may only upload a single file", "upload")
        return false;
    }

    for (var i = 0; i < fileList.length; i++){
        var file = fileList[i]
    }
    if(fileList[0]["type"] != "text/csv" &&
        fileList[0]["type"] != "text/comma-separated-values" &&
        fileList[0]["type"] != "application/vnd.ms-excel" &&
        fileList[0]["type"] != "application/csv" &&
        fileList[0]["type"] != "text/plain" &&
        fileList[0]["type"] != "text/x-csv" &&
        fileList[0]["type"] != "application/x-csv" &&
        fileList[0]["type"] != "text/x-comma-separated-values" &&
        fileList[0]["type"] != "text/tab-separated-values"
    )
    {
        loaderError("Your file is not a CSV.", "upload")
        return false
    }
    
    globalFile = fileList[0]

    var fileSize = fileList[0]["size"]
    var fileName = fileList[0]["name"]

    if(+fileSize > 2147483648){
        loaderError("Your file exceeds the maximum size limit of 2 GB.", "upload")
    }

    d3.select("#dropboxClick").text("File uploaded")
    d3.selectAll(".dropboxDrag").text(fileName).classed("filename", true)


    var navigator = new LineNavigator(fileList[0]);

    var numberOfLines = 500;
    navigator.readLines(0, numberOfLines, function (err, index, lines, isEof, progress) {

        if (err){
            loaderError("An error occurred reading your CSV.", "upload")
        }

        var lineObject = d3.csvParse(lines.join("\n"), d3.autoType)


        var colNames = lineObject.columns
        populateDropdowns(colNames)
        var csvCols = {}
        for(var i = 0; i < colNames.length; i++){
            var k = colNames[i]
            csvCols[k] = []
            for(var j = 0; j < lineObject.length; j++){
                var v = lineObject[j][k]
                if(v == null) continue

                var colType = (Object.prototype.toString.call(v) === '[object Date]') ? "date" : typeof(v)

                if(csvCols[k].indexOf(colType) == -1) csvCols[k].push(colType)

            }
        }

        
        for(var col in csvCols){
            if(csvCols.hasOwnProperty(col)){
                if(csvCols[col].length == 1) csvCols[col] = csvCols[col][0]
                else csvCols[col] = "string"
            }
        }
        d3.select("#csvProperties").datum({"size": fileSize, "cols": csvCols })

        hideLoaderError()
        populateDropdowns(colNames)
        d3.selectAll(".hideOption.user").classed("hiddenSection",false)
        d3.select("#mobileAdvanced").classed("hidden", false)
        resizeLoader()
        
    });

}

function deselectSampleData(){
    setHash("sample-" + getGeographyLevel())

    d3.selectAll(".sampleRect").classed("active", false)

    d3.selectAll(".sampleDetails").classed("active",false)

    d3.selectAll(".hideOption.sample").classed("hiddenSection",true)

    d3.select("#mobileAdvanced").classed("hidden", true)

    d3.select("#sampleDefaultText").classed("hiddenSection", false)

    d3.selectAll(".sampleCard").classed("inactive", false).classed("singleCard", false)

    d3.selectAll(".sampleDownload").style("display","none")

    d3.select("#sampleCardContainer").classed("single", false)

    resizeLoader()

}
function guessLatLon(colNames, l){
    var guesses = (l == "lat") ? ["latitude", "lat", "y"] : ["longitud", "longitude", "lon","long","x"];
    for(var g = 0; g < guesses.length; g++){
        var guess = guesses[g]
        for(var c = 0; c < colNames.length; c++){
            var col = colNames[c]
            if(col.toUpperCase() == guess.toUpperCase()){
                if(l == "lat") updateParams("lat_column",col)
                if(l == "lon") updateParams("lon_column",col)
                return col;
            }
        }
    }

    return ""
}

function showFilterOptions(filterType){
  clearFilterOptions();
  var addPad = (typeof(filterType) == "undefined") ? "-17px" : "-30px"
  // addButton -17 -30
  d3.select("#addButton").style("margin-top", addPad) 
  d3.selectAll(".filterContainer").classed("active", false)
  d3.select(".filterContainer." + filterType).classed("active", true)
  d3.selectAll(".loaderNote.filters").classed("active", false)
  d3.selectAll(".loaderNote.filters." + filterType).classed("active", true)

  d3.select("#filterControls").attr("class", filterType)

  resizeLoader()
  
}
function populateDropdowns(colNames){
    // console.log(colNames)
    clearFilterOptions()

    var guessedLat = guessLatLon(colNames, "lat")
    var guessedLon = guessLatLon(colNames, "lon")
    if(guessedLat == "" || guessedLon == "") d3.selectAll(".runButton").classed("disabled", true)
    else d3.selectAll(".runButton").classed("disabled", false)

    var colOptionsLat = ["<option value = ''>none selected</option>"],
        colOptionsLon = ["<option value = ''>none selected</option>"],
        colOptions = ["<option value = '' selected>none selected</option>"]
    for (i = 0; i < colNames.length; i++) {
        var latSelected = (colNames[i] == guessedLat) ? "selected" : "",
            lonSelected = (colNames[i] == guessedLon) ? "selected" : ""

        colOptionsLat.push("<option " + latSelected + " value='" + colNames[i] + "'>" + colNames[i] + "</option>");
        colOptionsLon.push("<option " + lonSelected + " value='" + colNames[i] + "'>" + colNames[i] + "</option>");
        colOptions.push("<option value='" + colNames[i] + "'>" + colNames[i] + "</option>");
    }
    
    d3.select("#latSelect").selectAll("option").remove()
    d3.select("#lonSelect").selectAll("option").remove()
    d3.select("#weightSelect").selectAll("option").remove()
    d3.select("#columnSelect").selectAll("option").remove()

    if(d3.select("#columnSelect-button").node() != null){
        $("#latSelect").append(colOptionsLat.join("")).selectmenu("refresh")
        $("#lonSelect").append(colOptionsLon.join("")).selectmenu("refresh")
        $("#weightSelect").append(colOptions.join("")).selectmenu("refresh")
        $("#columnSelect").append(colOptions.join("")).selectmenu("refresh")
    }
    else{
        $('#latSelect')
            .append(colOptionsLat.join(""))
            .selectmenu({
                change: function(event, d){
                    if(getCSVProperties()["cols"][d.item.value] == "number"){
                        updateParams("lat_column",d.item.value)
                        if(getCSVProperties()["cols"][ d3.select("#lonSelect").node().value ] == "number"){
                            hideLoaderError()
                        }
                    }else{
                        loaderError("Lat/lon cols need to be numeric", "latlon")
                    }
                }
            });

        $('#lonSelect')
            .append(colOptionsLon.join(""))
            .selectmenu({
                change: function(event, d){
                    if(getCSVProperties()["cols"][d.item.value] == "number"){
                        updateParams("lon_column",d.item.value)
                        if(getCSVProperties()["cols"][ d3.select("#latSelect").node().value ] == "number"){
                            hideLoaderError()
                        }
                    }else{
                        loaderError("Lat/lon cols need to be numeric", "latlon")
                    }
                }
            });


        $('#weightSelect')
            .append(colOptions.join(""))
            .selectmenu({
                change: function(event, d){
                    if(getCSVProperties()["cols"][d.item.value] != "number" && d.item.value != ""){
                        d3.select("#weightSelected").html("none selected")
                        loaderError("Oops&hellip; looks like our tool isn’t reading this column as numeric. Please choose another column or see our  <a href = \"Spatial_Equity_Tool_FAQs.pdf\" target = \"_blank\">FAQ</a> for help.","weight")
                    }else{
                        d3.select("#weightSelected").html(function(){
                          return (d.item.value == "") ? "none selected" : d.item.value
                        })
                        hideLoaderError()
                    }

                }
            });
            
        $('#columnSelect')
            .append(colOptions.join(""))
            .selectmenu({
                change: function(event, d){
                    var col = d.item.value
                    var filterType = getCSVProperties()["cols"][col]
                    checkValidFilter("columnSelect", col)
                    showFilterOptions(filterType)
                }
            });
    }

    d3.select(".uploadLatLonContainer").classed("hidden", false)
    if(widthBelow(768) || widthBelow(500)){
        d3.select("#uploadInstructions").classed("hidden", true)
    }

    // resizeLoader()

}

function dropboxDragenter(e) {
  e.stopPropagation();
  e.preventDefault();

  d3.select("#dropbox").classed("active", true)
}

function dropboxDragexit(e) {
  e.stopPropagation();
  e.preventDefault();

  d3.select("#dropbox").classed("active", false)
}


function dropboxDragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dropboxDrop(e) {
  event.stopPropagation();
  event.preventDefault();

  const dt = e.dataTransfer;
  const files = dt.files;

  d3.select("#dropbox").classed("active", false)

  handleFiles(files);
}
function dropboxClick(e){
  e.stopPropagation();
  e.preventDefault();

  document.getElementById("fileInput").click()

}
function checkValidFilter(inputName, val){
    var validFilter;
    if(val == ""){
        console.log("vf", validFilter)
        validFilter = false
    }else{
        var colName = d3.select("#columnSelect").node().value,
            filterType = (inputName == "columnSelect") ? getCSVProperties()["cols"][val] : getCSVProperties()["cols"][colName],
            validCol = (colName != "" || inputName == "columnSelect"),
            validCompare = (d3.select("#numComSel").node().value != "" || inputName == "compareSelect"),
            validNumeric = (d3.select("#numericSelect").node().value != "" || inputName == "numericSelect"),
            validText = (d3.select("#textSelect").node().value != "" || inputName == "textSelect"),
            startDate = d3.select("#startDateSelect").node().value.replace(/\-/g,"/"),
            endDate = d3.select("#endDateSelect").node().value.replace(/\-/g,"/"),
            validStartDate = (startDate != "" || inputName == "startDateSelect"),
            validEndDate = (endDate != "" || inputName == "endDateSelect")
        if(filterType == "number"){
            validFilter = validCol && validCompare && validNumeric
        }
        else if(filterType == "string"){
            validFilter = validText
        }
        else if(filterType == "date"){
            validFilter = (d3.select("#dateRangeBox").classed("active")) ? (validStartDate && validEndDate && (new Date(startDate) < new Date(endDate))) : validStartDate;
        }else{
            validFilter = false;
        }
    }

    d3.select("#addButton").classed("disabled", !validFilter)
    return validFilter
}


d3.selectAll(".homeButton.sample").on("click", function(){
    setDatasetType("sample", d3.select(this).attr("data-geo"))
    showLoaderSection("sample", getGeographyLevel())
})


d3.selectAll(".homeButton.user").on("click", function(){
    setDatasetType("user", d3.select(this).attr("data-geo"))
    showLoaderSection("user", getGeographyLevel())    
})


d3.selectAll(".homeButtonContainer")
    .on("click", function(){
        var scootch = (widthBelow(1100)) ? "66px" : "72px"
        d3.select(this).select(".homeButton.user")
            .transition()
            .style("top", scootch)
        d3.select(this).select(".homeButton.sample")
            .transition()
            .style("opacity",1)
        d3.select(this).select(".homeButton.geographyLevel")
            .style("opacity", 0)
            .style("z-index",-1)
    })
    // .on("mouseout", function(){
    //     d3.select(this).select(".homeButton.user")
    //         .transition()
    //         .style("top", "0px")
    //     d3.select(this).select(".homeButton.sample")
    //         .transition()
    //         .style("opacity",0)
    //     d3.select(this).select(".homeButton.geographyLevel")
    //         .style("opacity", 1)
    //         .style("z-index",1)
    // })


d3.selectAll(".backButton").on("click", function(){
    if(d3.select(this).classed("user") || d3.select(this).classed("sample")){
        startOver()
    }
    else if(d3.select(this).classed("filters") || d3.select(this).classed("weight")){
        showLoaderSection(getDatasetType(), getGeographyLevel())
        hideLoaderError("weight") 
    }
    else{
        deselectSampleData()
    }
    // startOver()
})
d3.selectAll(".inlineHome").on("click", function(){
    startOver()
})
d3.selectAll(".startOverInline").on("click", function(){
    startOver()
})
d3.selectAll(".startOver").on("click", function(){
    startOver()
})

d3.selectAll(".backButton.sample.data").on("click", function(){
    if(d3.selectAll(".sampleCard.inactive").nodes().length == 0){
        startOver()
    }else{
        deselectSampleData()
    }
})
d3.selectAll(".backButton.advanced").on("click", function(){
    showLoaderSection(getDatasetType(), getGeographyLevel())
})




/******** start drag and drop handlers *************/
let dropbox;

dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dropboxDragenter, false);
dropbox.addEventListener("dragexit", dropboxDragexit, false);
dropbox.addEventListener("dragover", dropboxDragover, false);
dropbox.addEventListener("drop", dropboxDrop, false);
dropbox.addEventListener("click", dropboxClick, false)





/******** end drag and drop handlers *************/


const inputElement = document.getElementById("fileInput");
inputElement.addEventListener("change", handleFiles, false);



d3.selectAll(".sampleCard").on("click", function(){

    var sample;

    for(var prop in sampleParams){
        if(d3.select(this).classed(prop)) sample = prop
    }
    selectSampleData(sample)
})
.on("mouseover", function(){
    if(d3.select(this).classed("singleCard")){
        return false;
    }else{
        d3.select(this).select("img.fg")
            .transition()
            .style("opacity",1)
    }
})
.on("mouseout", function(){
    if(d3.select(this).classed("singleCard")){
        return false;
    }else{
        d3.select(this).select("img.fg")
            .transition()
            .style("opacity",.8)
    }
})


d3.select("#caseStudyWrapper")
    .on("mouseenter", function(){
        d3.select("#caseStudyContainer")
            .style("opacity",1)
            .transition()
            .style("height", (d3.select(".caseStudyLink.top").node().getBoundingClientRect().height + d3.select(".caseStudyLink.bottom").node().getBoundingClientRect().height) + "px")
    })
    .on("mouseleave", function(){
        d3.select("#caseStudyContainer")
            .transition()
            .style("height", "0px")
            .on("end", function(){
                d3.select(this).style("opacity",0)
            })
    })


$('#advancedOptionsUser')
    .selectmenu({
        select: function(event, d){
            showLoaderSection(d.item.value, getGeographyLevel())
        },
        open: function(){
            d3.select("#advancedTextOverlayUser img").style("transform","rotate(180deg)")
        },
        close: function(){
            d3.select("#advancedTextOverlayUser img").style("transform","rotate(0deg)")
        }
    })

$('#advancedOptionsSample')
    .selectmenu({
        select: function(event, d){
            showLoaderSection(d.item.value, getGeographyLevel())
        },
        open: function(){
            d3.select("#advancedTextOverlaySample img").style("transform","rotate(180deg)")
        },
        close: function(){
            d3.select("#advancedTextOverlaySample img").style("transform","rotate(0deg)")
        }
    })





d3.select("#addButton").on("click", function(){
    if(checkValidFilter("saveButton", "save")){
        addToFilterList(getCurrentFilter())
    }
    d3.select("#columnSelect").selectAll("option")
        .property("selected", function(){
            return this.value == ""
        })
    $('#columnSelect').selectmenu("refresh")
    d3.select(this).classed("disabled", true)
})




$('.numeric.compareSelect')
    .selectmenu({
        select: function(event, d){
            checkValidFilter("compareSelect", d.item.value)
        }
    })

$('.text.compareSelect')
    .selectmenu()

d3.select("#textSelect").on("input", function(){
    checkValidFilter(this.value, "textSelect")
})

d3.select("#numericSelect").on("input", function(){
    checkValidFilter(this.value, "numericSelect")
})


d3.select("#dateRangeRow").on("click", function(){
    if(d3.select("#dateRangeBox").classed("active")){
        d3.selectAll(".endDateComponent").classed("hidden", true)
        d3.select("#dateRangeBox").classed("active", false)
    }else{
        d3.selectAll(".endDateComponent").classed("hidden", false)
        d3.select("#dateRangeBox").classed("active", true)
    }
    checkValidFilter(null,null)
})


d3.select("#startDateSelect").on("input", function(){
    checkValidFilter(this.value, "startDateSelect")
})

d3.select("#endDateSelect").on("input", function(){
    checkValidFilter(this.value, "endDateSelect")
})


d3.selectAll(".baselineRow").on("click", function(){
    var baseline = d3.select(this).attr("data-baseline")
    setLoaderBaseline(baseline)
})

d3.select(".saveButton.weight").on("click", function(){
    updateParams("weight", getWeight())
    if(getDatasetType() == "sample"){
        updateSampleParams("weight", getWeight())
    }
    showLoaderSection(getDatasetType(), getGeographyLevel())    
})
d3.select(".saveButton.filter").on("click", function(){
    var filters = []
    filters = filters.concat(d3.selectAll(".filterTag.visible").data())
    updateParams("filters", filters)
    
    if(getDatasetType() == "sample"){
        updateSampleParams("filters", getWeight())
    }


    showLoaderSection(getDatasetType(), getGeographyLevel())    
})

function restartAnimations(){
    d3.select(".loaderSection.loading .loaderHeader")
        .html("Sit tight! We’re analyzing your data.")
    d3.select(".loadingImg.l1").style("animation","trees 1.5s infinite")
    d3.select(".loadingImg.l1").style("animation-timing-function","linear")
    d3.selectAll(".loadingImgTire").style("animation-play-state","running")
}

d3.select("#errorNavBack")
    .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/backArrowBold.png")
    })
    .on("mouseout", function(){
      d3.select(this).select("img").attr("src", "images/backArrow.png")  
    })
    .on("click", function(){
        restartAnimations()
        showLoaderSection(getDatasetType(), getGeographyLevel())
        if(getDatasetType() == "sample"){
            deselectSampleData()
        }else{
            startOver("user", getGeographyLevel())
        }
    })
d3.select("#errorNavBackAdvanced")
    .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/backArrowBold.png")
    })
    .on("mouseout", function(){
      d3.select(this).select("img").attr("src", "images/backArrow.png")  
    })
    .on("click", function(){
        restartAnimations()
        showLoaderSection(getDatasetType(), getGeographyLevel())
    })
d3.select("#errorStartOver")
    .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/backArrowBold.png")
    })
    .on("mouseout", function(){
      d3.select(this).select("img").attr("src", "images/backArrow.png")  
    })
    .on("click", function(){
        startOver()
    })

//click ALL cancel buttons
d3.selectAll(".cancelButton").on("click", function(){
    showLoaderSection(getDatasetType(), getGeographyLevel())
    hideLoaderError("weight") 
})




// click run analysis
// PULL THE LEVER KRONK
d3.selectAll(".runButton").on("click", function(){
  runAnalysis()
})


d3.select("#advancedTextOverlaySample").on("click", function(){
    if(widthBelow(768) || widthBelow(500)){
        showMobileAdvanced()
    }
})
d3.select("#advancedTextOverlayUser").on("click", function(){
    if(widthBelow(768) || widthBelow(500)){
        showMobileAdvanced()
    }
})
// showMobileMain
var lastAdvanced = false;
d3.select("#mobileFilter").on("click", function(){
    lastAdvanced = false;
    hideMobileMain()
    showLoaderSection("filters", getGeographyLevel())
})
d3.select("#mobileWeight").on("click", function(){
    lastAdvanced = false;
    hideMobileMain()
    showLoaderSection("weight", getGeographyLevel())
})
d3.select("#mobileAdvancedBack").on("click", function(){
    if(lastAdvanced) showMobileMain()
    else{
        hideMobileMain()
        showLoaderSection(getDatasetType(), getGeographyLevel())
    }
})
d3.select("#mobileHome").on("click", function(){
    lastAdvanced = false;
    startOver()
})
d3.select("#mobileAdvanced").on("click", function(){
    lastAdvanced = true;
    showMobileAdvanced()
})
d3.select("#boorgerContainer").on("click", function(){
    lastAdvanced = false;
    if(d3.select(this).classed("ex")){
        hideMobileMain()
        hideMobileTT()
    }else{
        showMobileMain()
    }
})
d3.selectAll(".mobileTabSample").on("click", function(){
    startOver("sample", getGeographyLevel())
})
d3.selectAll(".mobileTabUser").on("click", function(){
    startOver("user", getGeographyLevel())
})
d3.select(".mobileTabFilter").on("click", function(){
    d3.select(this).classed("active", true)
    d3.select(".mobileTabFilterList").classed("active", false)
    d3.select("#filterControls").style("display", "block")
    d3.select("#filterListContainer").style("display", "none")
    d3.select(".loaderSection.filters .mobileOnlyHeader").style("display", "block")
    d3.select("#filterColumnContainer .advancedButtonRow").style("display", "table")
    resizeLoader()
})
d3.selectAll(".mobileTabFilterList").on("click", function(){
    d3.select(this).classed("active", true)
    d3.select(".mobileTabFilter").classed("active", false)
    d3.select("#filterControls").style("display", "none")
    d3.select("#filterListContainer").style("display", "block")
    d3.select(".loaderSection.filters .mobileOnlyHeader").style("display", "none")
    d3.select("#filterColumnContainer .advancedButtonRow").style("display", "none")
    resizeLoader()
})


document.onmouseover = function() {
    //User's mouse is inside the page.
    window.innerDocClick = true;
}

document.onmouseleave = function() {
    //User's mouse has left the page.
    window.innerDocClick = false;
}

window.onhashchange = function() {
    var hash = window.location.hash.replace("#","")
    // console.log(hash)
    if (window.innerDocClick || keyNav) {
        //Your own in-page mechanism triggered the hash change
        // console.log("asdf")
    } else {
        //Browser back button was clicked
        hashNav(hash)

    }
}


function setHash(hash, skipURL){
    if(typeof(skipURL) == "undefined"){ window.location.hash = "#" + hash }
    d3.select("#headerBack").attr("class", "header backButton " + hash.replace("-"," "))
}

function hashNav(hash){
    if(hash == ""){
        startOver()
    }
    else if(hash.search("sample") != -1){
        deselectSampleData()
    }
    else if(hash.search("user") != -1){
        var geo = hash.split("-")[1]
        setDatasetType("user", geo)
        showLoaderSection("user", geo)

    }
    else if(hash.search(getGeographyLevel())  != -1 && hash.search("results") == -1){
        showLoaderSection(getDatasetType(), getGeographyLevel())
    }
    else if(hash == "loading"){
        showLoaderSection(getDatasetType(), getGeographyLevel())   
    }
    else if(hash == "filters" || hash == "weight"){
        showLoaderSection(hash, getGeographyLevel())
    }
    else if(hash == "error"){
        // startOver()
    }
    else if(hash.indexOf("results") != -1){
        return false;
    }
}

// 91 command
// 18 alt
// 37 arrow left
// 39 arrow right
// 8 backspace
// detect if alt key or command key (on mac) is being held down
var altDown = false;
var keyNav = false;
document.addEventListener("keydown", function(e){
    if(e.keyCode == 91 || e.keyCode == 18) altDown = true
    if(altDown){
        if(e.keyCode == 37 || e.keyCode == 39){
            keyNav = true;
            setTimeout(() => {hashNav(window.location.hash.replace("#",""))}, 500)
            setTimeout(() => { keyNav = false}, 1000)
        }
    }
})
document.addEventListener("keyup", function(e){
    if(e.keyCode == 91 || e.keyCode == 18) altDown = false
})



