window.onload = (e) => {
    document.querySelector("#search-button").onclick = newSearch;
    document.querySelector("#prev-button").onclick = searchPrev;
    document.querySelector("#next-button").onclick = searchNext;
};

let offset = 0;
let displayTerm = "";

function newSearch(){
    offset = 0;
    searchButtonClicked();
}

function searchPrev(){
    let limit = document.querySelector("#limit").value;
    offset -= parseInt(limit);
    if (offset < 0){
        offset = 0;
    }
    searchButtonClicked();
}

function searchNext(){
    let limit = document.querySelector("#limit").value;
    offset += parseInt(limit);
    searchButtonClicked();
}

function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    let GIPHY_KEY = "ZSA4kPTD7tbBlz4bQm11BBXCuqThrcMu";

    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    let term = document.querySelector('#search-input').value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    if(term.length < 1) return;

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    url += "&offset=" + offset;

    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    console.log(url);

    getData(url);
}

function getData(url){
    // Searching
    document.querySelector("#status").innerHTML = "<b>Searching...</b><br><br>";
    document.querySelector("#content").innerHTML = "";
    let limit = document.querySelector("#limit").value;
    for (let i = 0; i < limit; i++){
        document.querySelector("#content").innerHTML += "<img src='images/spinner.gif' alt='loading'></img>";
    }

    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET",url);
    xhr.send();
}

function dataLoaded(e){    
    let xhr = e.target;
    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    // no results?
    if(!obj.data || obj.data.length == 0){
        document.querySelector('#status').innerHTML = "<b>No results found for '" + displayTerm + "'</b><br><br>";
        document.querySelector("#content").innerHTML = "";
        return;
    }

    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = ""

    // Loop through results
    for (let i = 0; i < results.length; i++){
        let result = results[i];

        // get GIF URL
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) smallURL = "images/no-image-found.png";

        // get ratings
        let gifRating = result.rating.toUpperCase();
        if (!gifRating) gifRating = "n/a";

        // Build a <div> to hold results
        let line = `<div class='result'><a href='${smallURL}' target='_blank'><img src='${smallURL}' title= '${result.id}' /></a>`;
        line += `<span><p><b>Rating: ${gifRating}</b></p></span>`
        line += "</div>";

        bigString += line;
    }

    document.querySelector("#content").innerHTML = bigString;

    document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e){
    console.log("An error occureed");
}