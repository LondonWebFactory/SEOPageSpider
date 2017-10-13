chrome.tabs.executeScript(null, { file: "scripts/content-script.js" });

chrome.runtime.onMessage.addListener(function(request, sender) {

    if (request.action == "getSource") {


        document.querySelector("#page-title").innerText = request.title;
        document.querySelector("#title-length").innerText = request.titleLength;
        document.querySelector("#meta-description").innerText = request.metaD;
        document.querySelector("#meta-description-length").innerText = request.metaDLength;
        document.querySelector("#h1").innerText = request.firstH1;
        document.querySelector("#h1-count").innerText = request.h1Count;
        document.querySelector("#p").innerText = request.firstP;
        document.querySelector("#domain-name").innerText = request.hostname;
        document.querySelector("#local-path").innerText = request.pathname;
        document.querySelector("#p").innerText = request.firstP;
        document.querySelector("#word-count").innerHTML = request.filteredWordCount;

    }


});