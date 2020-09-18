var buildingIntervId;
var statusIntervId;
var buildingIndex = 0;

var TOKEN = "4b7aa32e17731af9e97d0d2edd061f1b46d7d117"

function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}



function runAnalysis() {
    
    // console.log(event, JSON.toString(getParams()))
    // event.preventDefault();
  // log.textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  var datasetType = getDatasetType(),
        params = getParams(),
        postURL,
        // postURL = "https://httpbin.org/post"
        formData = new FormData();

    if(datasetType == "user"){
        // formData.append("upload_file", $("#fileInput").prop("files")[0])
        formData.append("upload_file", globalFile)
        postURL = "https://equity-tool-api-stg.urban.org/api/v1/upload-file/"
    }else{
        // formData.append("upload_file", "foo")
        var sample_dataset_id = getSampleDatasetId()
        if(sample_dataset_id == "") throwError(["unknown"])
        
        formData.append("sample_dataset_id", sample_dataset_id)
        postURL = "https://equity-tool-api-stg.urban.org/api/v1/upload-sample-file/"
    }

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
            
            xhr.setRequestHeader("Authorization", "Token " + TOKEN);
            xhr.setRequestHeader("X-Mobile", "true");
        },
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    // console.log(humanFileSize(evt.loaded,true), humanFileSize(evt.total, true))
                    var percentComplete = d3.format(".1%")(evt.loaded / evt.total);
                    //Do something with upload progress here
                    // console.log(percentComplete)
                    d3.select("#statusLoading").html("Uploading " + humanFileSize(evt.loaded,true) + " of " + humanFileSize(evt.total, true) + " (" + percentComplete + ")")
                }
           }, false);
           return xhr;
        },

        error: function(e){
            throwError(["upload"])
        },
        success: function(msg, status, jqXHR){
            statusIntervId = setInterval(loopStatus, PROCESSING_INTERVAL, msg);
        }
    }); 
}

function showLoadingScreen(){
    d3.selectAll(".loaderSectionStatus").style("display","none")
    d3.select("#statusLoading").style("display","block")

    showLoaderSection("loading")
    loopBuildings();
}

function showResults(fileId){
    d3.selectAll(".resultsContainer").style("display", "block")
    d3.select("#loaderContainer").style("display", "none")
    d3.select("#loaderContainer").style("display", "none")
    d3.select(".loaderHome").style("display","none")

    drawResultsData(fileId)
    
}

function drawResultsData(fileId){
    var resultsUrl = "https://equity-tool-api-stg.urban.org/api/v1/get-equity-file/" + fileId
    $.ajax({
        url: resultsUrl,
        method: "GET",
        crossDomain: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Token " + TOKEN);
            xhr.setRequestHeader("X-Mobile", "true");
        }, 
        error: function(e){
            throwError(["api"])
        },
        success: function(msg, status, xhr){
            var params = getParams()
            drawBarChart(msg.results.result.demographic_bias_data, "dynamic", function(){})
            drawMaps(msg.results.result.bbox, msg.results.result.geo_bias_data.features, msg.results.result.bounds)
            populateSummaries(msg.results.result.messages, params)
            populateDownloadLinks(msg.results.result.download_links)
        }
    }); 
}

function throwError(errorKeys){
    clearInterval(buildingIntervId);
    clearInterval(statusIntervId);
    showErrorScreen(errorKeys);
}
function showErrorScreen(errorKeys){
    console.log("kaplooie")
    showLoaderSection("loading")

    d3.select(".loaderSection.loading .loaderHeader")
        .html("Oops! Something went wrong. <span class = 'errorLight'>For help, see our <a href = 'spatial_equity_faq.pdf' target = '_blank'> FAQ</a>.</span>")
    
    d3.selectAll(".loadingError").style("display","block")
    d3.selectAll(".loadingErrorRow").remove()
    d3.selectAll(".loadingImg").style("opacity", 0)
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
            return errorMessages[d]
        })

}

function loopStatus(msg){
    var statusURL = "https://equity-tool-api-stg.urban.org/api/v1/get-equity-status/" + msg.file_id
    $.ajax({
        url: statusURL,
        method: "GET",
        crossDomain: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Token " + TOKEN);
            xhr.setRequestHeader("X-Mobile", "true");
        }, 
        error: function(e){
            throwError(["api"])
        },
        success: function(msg2, status, xhr){
            checkStatus(msg2.results)
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
        console.log(status)
        throwError(Object.keys(status["formdata"]["error-messages"]))
    }
    else if(status.formdata.updates.finished){
        d3.selectAll(".loaderSectionStatus").style("display","none")
        d3.select("#statusDone").style("display","block")

        d3.select("#num_rows_processed").text(status.formdata.updates.num_rows_processed)
        d3.select("#num_rows_file").text(status.formdata.updates.num_rows_file)

        showResults(status.fileid);
        clearInterval(buildingIntervId);
        clearInterval(statusIntervId);
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
    buildingIntervId = setInterval(addBuilding, 75);
}

function addBuilding() {
    var currentIndex = (buildingIndex%20) + 1
    if(currentIndex == 1){
        d3.selectAll(".loadingImg").style("opacity",0)
    }
    d3.select(".loadingImg.l" + currentIndex).style("opacity",1)
    buildingIndex += 1
}