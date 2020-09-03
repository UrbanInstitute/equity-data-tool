var buildingIntervId;
var statusIntervId;
var buildingIndex = 0;

var tmpCount = 0;
function runAnalysis() {
    
    // console.log(event, JSON.toString(getParams()))
    // event.preventDefault();
  // log.textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  var datasetType = getDatasetType(),
        params = getParams()
        postURL = "https://equity-tool-api-stg.urban.org/api/v1/upload-file/",
        // postURL = "https://httpbin.org/post"
        formData = new FormData();

    if(datasetType == "user"){
        formData.append("file", $("#fileInput").prop("files")[0])
    }else{
        formData.append("file", "specialIndicator")
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
    console.log(params)

    // formData.append("file", $("#fileInput").prop("files")[0])


    // for(var k in params){
    //     if(params.hasOwnProperty(k)){
    //         if(k != "filters"){
    //             formData.append(k, params[k])
    //         }else{
    //             formData.append(k, JSON.stringify(params[k]))
    //         }
            
    //     }
    // }
    var TOKEN = "4b7aa32e17731af9e97d0d2edd061f1b46d7d117"


// https://equity-tool-api-stg.urban.org/api/v1/get-equity-status/1598889564-517535?access_token=4b7aa32e17731af9e97d0d2edd061f1b46d7d117

    $.ajax({
        url: "https://equity-tool-api-stg.urban.org/api/v1/get-equity-status/1598889564-517535",
        method: "GET",
        // contentType: 'multipart/form-data',
        // processData: false,
        // data:formData,
        crossDomain: true,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Token " + TOKEN);
            xhr.setRequestHeader("X-Mobile", "true");
        },        
        success: function(msg, status, jqXHR){
            console.log(msg)
            showLoadingScreen();    
            tmpCount = 0;        
            statusIntervId = setInterval(loopStatus, 500, msg)
        }
    }); 
// console.log(formData.boundary)
//     $.ajax({
//         url: postURL,
//         method: "POST",
//         // contentType: 'multipart/form-data',
//         // contentType: false,
//         processData: false,
//         data:formData,
//         // boundar:formData.boundary,
//         crossDomain: true,
//         beforeSend: function (xhr) {
//             /* Authorization header */
//             xhr.setRequestHeader("Authorization", "Token " + TOKEN);
//             xhr.setRequestHeader("X-Mobile", "true");
//         },    
//         error: function(e){
//             console.log(e)
//         },
//         success: function(msg, status, jqXHR){
//             console.log(msg)
//             showLoadingScreen();    
//             tmpCount = 0;        
//             statusIntervId = setInterval(loopStatus, 500, msg)
//         }
//     }); 
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
    var jsonURL = "dummy_data.json"
    var params = getParams()
    d3.json(jsonURL).then(function(data) {
      drawBarChart(data.results.result.demographic_bias_data)
      drawMaps(data.results.result.bbox, data.results.result.geo_bias_data.features, data.results.result.bounds)
      populateSummaries(data.results.result.messages, params)
    })
}

function showErrorScreen(){

}

function loopStatus(msg){
    // ping the status api
    // check updates.finished
    var tmpURLS = ["dummy_step1.json", "dummy_step2.json", "dummy_step3.json", "dummy_finished.json"]
    var statusURL = tmpURLS[tmpCount]
    $.ajax({
        url: statusURL,
        method: "GET",
        dataType:"json",
        success: function(status){
            checkStatus(status)
        }
    }); 

    tmpCount += 1;

}


function checkStatus(status){
    if(status.updates.errors){
        clearInterval(buildingIntervId);
        clearInterval(statusIntervId);
        showErrorScreen()
    }
    else if(status.updates.finished){
        d3.selectAll(".loaderSectionStatus").style("display","none")
        d3.select("#statusDone").style("display","block")

        d3.select("#num_rows_processed").text(status.updates.num_rows_processed)
        d3.select("#num_rows_file").text(status.updates.num_rows_file)

        var tmpFileId = "foo"
        showResults(tmpFileId);
        clearInterval(buildingIntervId);
        clearInterval(statusIntervId);
    }
    else{
        d3.selectAll(".loaderSectionStatus").style("display","none")
        d3.select("#statusProcessing").style("display","block")

        d3.select("#num_rows_processed").text(status.updates.num_rows_processed)
        d3.select("#num_rows_file").text(status.updates.num_rows_file)
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

function stopTextColor() {
    clearInterval(buildingIntervId);
}


d3.select("body").on("click", stopTextColor)