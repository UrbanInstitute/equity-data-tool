var buildingIntervId;
var statusIntervId;
var buildingIndex = 0;


function runAnalysis() {
    
    // console.log(event, JSON.toString(getParams()))
    // event.preventDefault();
  // log.textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  var datasetType = getDatasetType(),
        params = getParams()
        postURL = "https://httpbin.org/post",
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

    $.ajax({
        url: postURL,
        method: "POST",
        contentType: false,
        processData: false,
        data:formData,
        success: function(msg, status, jqXHR){
            console.log(msg)
            showLoadingScreen();
            statusIntervId = setInterval(checkStatus, 2000, msg)
        }
    }); 
}

function showLoadingScreen(){
    showLoaderSection("loading")
    loopBuildings();
}

function hideLoadingScreen(){
    
}

function showErrorScreen(){

}

function checkStatus(msg){
    console.log("checking status")
    console.log(msg)
    console.log("\n\n")
    // ping the status api
    // check updates.finished
    var status = {"updates": {"finished": false } }
    if(status.updates.finished){
        hideLoadingScreen()
        clearInterval(buildingIntervId);
        clearInterval(statusIntervId);
    }

    //if error
    if(false){
        clearInterval(buildingIntervId);
        clearInterval(statusIntervId);
        showErrorScreen()
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