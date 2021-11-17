var buildingIntervId;
var statusIntervId;
var buildingIndex = 0;



function humanFileSize(bytes, si, dp) {
if(typeof(si) == "undefined") si = false
if(typeof(dp) == "undefined") dp = 1

  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = Math.pow(10,dp);

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}



function runAnalysis() {
    
  var datasetType = getDatasetType(),
        params = getParams(),
        postURL,
        // postURL = "https://httpbin.org/post"
        formData = new FormData();
        var callFullApi;

    if(datasetType == "user"){
        // formData.append("upload_file", $("#fileInput").prop("files")[0])
        formData.append("upload_file", globalFile)
        postURL = baseApiUrl + "upload-file/"
        callFullApi = true;
    }else{
        var sample_dataset_id = getSampleDatasetId()
        if(sample_dataset_id == "") throwError(["unknown"])

        var params = getParams(),
            defaultParams = sampleParams[getSampleDatasetSlug()]["defaultParams"]
        var sameFilters = true;
        if(params.filters.length != defaultParams.filters.length){
            sameFilters = false;
        }else{
            for(var i = 0; i < params.length; i++){
                if(
                    params["filters"][i]["filter_column"] != defaultParams["filters"][i]["filter_column"] ||
                    params["filters"][i]["filter_comparison"] != defaultParams["filters"][i]["filter_comparison"] ||
                    params["filters"][i]["filter_val"] != defaultParams["filters"][i]["filter_val"]
                ){
                    sameFilters = false;
                    break
                }
            }
        }
        if(
            params.weight == defaultParams.weight &&
            params.lat_column == defaultParams.lat_column &&
            params.lon_column == defaultParams.lon_column &&
            sameFilters
        ){
            callFullApi = false;
        }else{
            formData.append("sample_dataset_id", sample_dataset_id)
            postURL = baseApiUrl + "upload-sample-file/"
            callFullApi = true;
        }
        

    }
    if(callFullApi){
        params["geo"] = getGeographyLevel()

        for(var k in params){
            if(params.hasOwnProperty(k)){
                if(k != "filters"){
                    formData.append(k, params[k])
                }else{
                    formData.append(k, JSON.stringify(params[k]))
                }
                
            }
        }

        $.ajax({
            url: postURL,
            method: "POST",
            contentType: false,
            cache: false,
            processData: false,
            data:formData,
            crossDomain: true,
            beforeSend: function (xhr) {
                
                showLoadingScreen();    
                
                if(TOKEN){
                    xhr.setRequestHeader("Authorization", "Token " + TOKEN);
                    xhr.setRequestHeader("X-Mobile", "true");
                }
            },
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = d3.format(".1%")(evt.loaded / evt.total);
                        //Do something with upload progress here
                        if(getDatasetType() == "user"){
                            d3.select("#statusLoading").html("Uploading " + humanFileSize(evt.loaded,true) + " of " + humanFileSize(evt.total, true) + " (" + percentComplete + ")")    
                        }else{
                            d3.select("#statusLoading").html("Retrieving sample data&hellip;")
                        }
                        
                    }
               }, false);
               return xhr;
            },

            error: function(e){
                console.log(e)
                throwError(["upload"])
            },
            success: function(msg, status, jqXHR){
                statusIntervId = setInterval(loopStatus, PROCESSING_INTERVAL, msg);
            }
        }); 
    }else{
        showResults(getSampleDatasetId().replace(".csv",""))
        return false;
    }
}

function showLoadingScreen(){
    d3.selectAll(".loaderSectionStatus").style("display","none")
    d3.select("#statusLoading").style("display","block")

    showLoaderSection("loading", getGeographyLevel())
    loopBuildings();
}

function showResults(fileId){
    d3.select("#header-pinned").attr("class", "no-touch results")
    d3.selectAll(".resultsContainer").style("display", "block")
    d3.select("#loaderContainer").style("display", "none")
    d3.select("#loaderContainer").style("display", "none")
    d3.select(".loaderHome").style("display","none")

    drawResultsData(fileId)
    
}

function drawResultsData(fileId){
    var resultsUrl = baseApiUrl + "get-equity-file/" + fileId
    $.ajax({
        url: resultsUrl,
        method: "GET",
        crossDomain: true,
        beforeSend: function (xhr) {
            if(TOKEN){
                xhr.setRequestHeader("Authorization", "Token " + TOKEN);
                xhr.setRequestHeader("X-Mobile", "true");
            }
        }, 
        error: function(e){
            throwError(["api"])
        },
        success: function(msg, status, xhr){
            var params = getParams()

            var barBaseline;
            if(params.baseline == "pop") barBaseline = "total_pop"
            else if(params.baseline == "chi") barBaseline = "under18_pop"
            else if(params.baseline == "pov") barBaseline = "pov_pop"
            else barBaseline = "total_pop"

    // if(baseline == "total_pop") pplLabel = "residents"
    // else if(baseline == "under18_pop") pplLabel = "children"
    // else if(baseline == "pov_pop") pplLabel = "residents with extremely low incomes"
            setHash("results-" + getGeographyLevel())

            drawBarChart(msg.results.result.demographic_bias_data, "dynamic", barBaseline, "", function(){})
            drawMaps(msg.results.result.bbox, msg.results.result.geo_bias_data.features, params.baseline, msg.results.result.bounds)
            populateSummaries(msg.results.result.messages, params)
            populateDownloadLinks(msg.results.result.download_links)
            var animateTime = (widthBelow(768) || widthBelow(500)) ? 10 : 1200
            $('html, body').animate({ scrollTop: 0 }, animateTime);

        }
    }); 
}

function throwError(errorKeys, fullStateName, fileid){
    setHash("error")

    var sanitizedKeys = errorKeys.filter(function(e){ return errorMessages.hasOwnProperty(e)})
    clearInterval(buildingIntervId);
    clearInterval(statusIntervId);
    showErrorScreen(sanitizedKeys, fullStateName, fileid);
}
function showErrorScreen(errorKeys, fullStateName, fileid){
    showLoaderSection("loading", getGeographyLevel())
    setHash("error")
    d3.select("#header-pinned").classed("loading", false) 

    d3.select(".loaderSection.loading .loaderHeader")
        .html("Oops! Something went wrong. <span class = 'errorLight'>For help, see our <a href = 'Spatial_Equity_Tool_FAQs.pdf' target = '_blank'> FAQ</a>.</span>")
    
    d3.selectAll(".loadingError").style("display","block")
    
    // d3.selectAll(".loadingImg").style("animation-play-state","paused")
    d3.selectAll(".loadingImgTire").style("animation-play-state","paused")
    d3.select(".loadingImg.l1").style("animation","none")
    

    d3.select("#errorNavBackAdvanced").style("display", "inline-block")
    d3.select("#errorNavBack div span").text(function(){
        return (getDatasetType() == "user") ? " upload your data" : " select sample data"
    })

    if(errorKeys.indexOf("few_sub_geos_flag_state") != -1 || errorKeys.indexOf("few_sub_geos_flag_national") != -1 || errorKeys.indexOf("dc_treated_as_state") != -1){
        d3.selectAll(".errorNavStandard").style("display","none")
        d3.selectAll(".errorNavSubgeo").style("display","block")
        d3.select("#errorYesContinue").on("click", function(){
            showResults(fileid)
        })
        d3.select("#theHoleIsYourHome").on("click", function(){
            startOver()
        })
    }else{
        d3.selectAll(".errorNavStandard").style("display","block")
        d3.selectAll(".errorNavSubgeo").style("display","none")
    }

    d3.selectAll(".loadingErrorRow").remove()
    d3.selectAll(".loaderSectionStatus").style("display","none")

    var row = d3.select("#loadingErrorContainer").selectAll(".loadingErrorRow")
        .data(errorKeys)
        .enter()
        .append("div")
        .attr("class", "loadingErrorRow loadingError")
        .style("display", "flow-root")

    row.append("img")
        .attr("class" ,"errorX loading")
        .attr("src", "images/errorX.png")
    row.append("div")
        .attr("class", "loadingErrorText")
        .html(function(d){
            console.log(d)
            return errorMessages[d].replace("{FULL_STATE_NAME}",fullStateName)
        })


}

function loopStatus(msg){
    var statusURL = baseApiUrl + "get-equity-status/" + msg.file_id
    $.ajax({
        url: statusURL,
        method: "GET",
        crossDomain: true,
        beforeSend: function (xhr) {
            if(TOKEN){
                xhr.setRequestHeader("Authorization", "Token " + TOKEN);
                xhr.setRequestHeader("X-Mobile", "true");
            }
        }, 
        error: function(e){
            throwError(["api"])
        },
        success: function(msg, status, xhr){
            checkStatus(msg.results)
        }
    }); 
}

var loopCount = 0;
function checkStatus(status){
    if(loopCount >= MAX_PROCESSING_TIME/PROCESSING_INTERVAL){
        throwError(["processing_time_out"])
    }
    if(!status.file_exists){
        loopCount += 1;
        return false
    }
    else if(status.formdata.updates.started_processing == false){
        loopCount += 1;
        return false;
    }
    else if(status["formdata"]["updates"]["error-messages"]){
        Object.keys(status["formdata"]["error-messages"]).forEach(function(key){
            if (!status["formdata"]["error-messages"][key]) delete status["formdata"]["error-messages"][key];
        });
        throwError(Object.keys(status["formdata"]["error-messages"]))
    }
    else if(status.formdata.updates.finished){
        d3.selectAll(".loaderSectionStatus").style("display","none")
        d3.select("#statusDone").style("display","block")

        d3.select("#num_rows_processed").text(status.formdata.updates.num_rows_processed)
        d3.select("#num_rows_file").text(status.formdata.updates.num_rows_file)

        if(status.formdata.warnings.few_sub_geos_flag){
            throwError(["few_sub_geos_flag_" + getGeographyLevel()], status.formdata.updates.g_disp, status.fileid)
            clearInterval(buildingIntervId);
            clearInterval(statusIntervId);
        }
        else if(status.formdata.updates.g_disp_fips == "11" && getGeographyLevel() == "state"){
            throwError(["dc_treated_as_state"], status.formdata.updates.g_disp, status.fileid)
            clearInterval(buildingIntervId);
            clearInterval(statusIntervId);
        }
        else{
            showResults(status.fileid);
            clearInterval(buildingIntervId);
            clearInterval(statusIntervId);
        }
    }
    else if(status.formdata.updates.num_rows_for_processing == status.formdata.updates.num_rows_processed && status.formdata.updates.num_rows_for_processing != null && status.formdata.updates.num_rows_processed != null){
        d3.selectAll(".loaderSectionStatus").style("display","none")
        d3.select("#statusDone").style("display","block")
    }
    else{
        d3.selectAll(".loaderSectionStatus").style("display","none")
        d3.select("#statusProcessing").style("display","block")
        var processed = (status.formdata.updates.num_rows_processed == null) ? 0 : status.formdata.updates.num_rows_processed
        d3.select("#num_rows_processed").text(d3.format(",")(processed))
        d3.select("#num_rows_file").text(d3.format(",")(status.formdata.updates.num_rows_file))
    }

}


function loopBuildings() {
    d3.selectAll(".loadingImg").style("opacity",1).style("animation-play-state","running")
    d3.select("#header-pinned").classed("loading", false)
}

// function addBuilding() {
//     var currentIndex = (buildingIndex%20) + 1
//     if(currentIndex == 1){
//         d3.selectAll(".loadingImg").style("opacity",0)
//     }
//     d3.select(".loadingImg.l" + currentIndex).style("opacity",1)
//     buildingIndex += 1
// }