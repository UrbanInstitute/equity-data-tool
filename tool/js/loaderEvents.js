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
    if(fileList[0]["type"] != "text/csv" && fileList[0]["type"] != "application/vnd.ms-excel" ){
        loaderError("Your file is not a CSV.", "upload")
        return false
    }
    
    globalFile = fileList[0]

    var fileSize = fileList[0]["size"]
    var fileName = fileList[0]["name"]

    if(+fileSize > 2147483648){
        loaderError("Your file exceeds the maximum size limit.", "upload")
    }

    d3.select("#dropboxClick").text("File uploaded")
    d3.select("#dropboxDrag").text(fileName).classed("filename", true)


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
        
    });

}

function deselectSampleData(){
    window.location.hash = "#" + "sample"

    d3.selectAll(".sampleRect").classed("active", false)

    d3.selectAll(".sampleDetails").classed("active",false)

    d3.selectAll(".hideOption.sample").classed("hiddenSection",true)

    d3.select("#sampleDefaultText").classed("hiddenSection", false)

    d3.selectAll(".sampleCard").classed("inactive", false).classed("singleCard", false)

    d3.selectAll(".sampleDownload").style("display","none")

}
function guessLatLon(colNames, l){
    var guesses = (l == "lat") ? ["latitude", "lat", "x"] : ["longitude", "lon","long","y"];
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
  
}
function populateDropdowns(colNames){
    clearFilterOptions()

    var guessedLat = guessLatLon(colNames, "lat")
    var guessedLon = guessLatLon(colNames, "lon")

    // console.log(guessedLon, guessedLat)
    if(guessedLat == "" || guessedLon == "") d3.selectAll(".runButton").classed("disabled", true)
    else d3.selectAll(".runButton").classed("disabled", false)

    var colOptionsLat = ["<option value = '' selected>none selected</option>"],
        colOptionsLon = ["<option value = '' selected>none selected</option>"],
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
    // console.log(colOptionsLat)
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
                        loaderError("Oops&hellip; looks like our tool isn’t reading this column as numeric. Please choose another column or see our  <a href = \"spatial_equity_faq.pdf\" target = \"_blank\">FAQ</a> for help.","weight")
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


d3.select("#sampleButton").on("click", function(){
    setDatasetType("sample")
    showLoaderSection("sample")    
})


d3.select("#userButton").on("click", function(){
    setDatasetType("user")
    showLoaderSection("user")    
})



d3.selectAll(".backButton.user.data").on("click", function(){
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
    showLoaderSection(getDatasetType())
})
d3.selectAll(".startOver").on("click", function(){
    startOver()
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



d3.selectAll(".sampleRect").on("click", function(){

    var sample;
    if(d3.select(this).classed("three11")) sample = "three11"
    else if(d3.select(this).classed("hotspots")) sample = "hotspots"
    else if(d3.select(this).classed("bike")) sample = "bike"
    selectSampleData(sample)
})


$('#advancedOptionsUser')
    .selectmenu({
        select: function(event, d){
            showLoaderSection(d.item.value)
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
            showLoaderSection(d.item.value)
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
    showLoaderSection(getDatasetType())    
})
d3.select(".saveButton.filter").on("click", function(){
    var filters = []
    filters = filters.concat(d3.selectAll(".filterTag.visible").data())
    updateParams("filters", filters)
    
    if(getDatasetType() == "sample"){
        updateSampleParams("filters", getWeight())
    }


    showLoaderSection(getDatasetType())    
})

d3.select("#errorNavBack")
    .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/backArrowBold.png")
    })
    .on("mouseout", function(){
      d3.select(this).select("img").attr("src", "images/backArrow.png")  
    })
    .on("click", function(){
        d3.select(".loaderSection.loading .loaderHeader")
            .html("Sit tight! We’re analyzing your data.")
        showLoaderSection(getDatasetType())
    })
d3.select("#errorNavBackFilter")
    .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/backArrowBold.png")
    })
    .on("mouseout", function(){
      d3.select(this).select("img").attr("src", "images/backArrow.png")  
    })
    .on("click", function(){
        d3.select(".loaderSection.loading .loaderHeader")
            .html("Sit tight! We’re analyzing your data.")
        showLoaderSection("filters")
    })
d3.select("#errorStartOver")
    .on("mouseover", function(){
        d3.select(this).select("img").attr("src", "images/startOverBlueBold.png")
    })
    .on("mouseout", function(){
      d3.select(this).select("img").attr("src", "images/startOverBlue.png")  
    })
    .on("click", function(){
        startOver()
    })

//click ALL cancel buttons
d3.selectAll(".cancelButton").on("click", function(){
    showLoaderSection(getDatasetType())
    hideLoaderError("weight") 
})




// click run analysis
// PULL THE LEVER KRONK
d3.selectAll(".runButton").on("click", function(){
  runAnalysis()
})


