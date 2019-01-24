/**
 * Created by user on 1/24/2019.
 */
/**
 * Created by user on 1/15/2019.
 */
var xhr = new XMLHttpRequest();

var heroes = [];
var itemsArr = [];
var img_holder;
var star = document.getElementsByTagName('i');
var idArr = [];
var historyArr = [];
var selectedStar;
var arrayFromLS = [];
var arrayItemFromLS;
var starId;
var numbers = [];

// Setup our listener to process completed requests
xhr.onload = function () {
    var myObj , itemContainer = "";
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        myObj = JSON.parse(this.responseText);
        heroes = myObj.data.results;

        for (var x in heroes) {
            var urlForImg = heroes[x].thumbnail.path + "." + heroes[x].thumbnail.extension;
            var name = heroes[x].name;
            var id = heroes[x].id;
            idArr.push(heroes[x].id);
            itemContainer += "<div class='imgHolder'><img class='sliderImg' src="+ urlForImg +"><i id=" + id + " class='far fa-star'></i><div>" + name + "</div></div>";
            itemsArr.push(heroes[x].name.replace(/\./g,' ').replace(/\s/g, ""));
        }
        document.getElementById("itemHolder").innerHTML = itemContainer;

    } else {
        // What do when the request fails
        console.log('The request failed!');
    }

};

// Create and send a GET request
// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
// The second argument is the endpoint URL
xhr.open('GET', 'http://gateway.marvel.com/v1/public/characters?ts=1&apikey=5294812ca141e51ca26f382ff583287f&hash=a26d53a6841e18d633859b8f1d291106');
xhr.send();


var search = document.getElementById("search");
search.addEventListener("keyup", function () {
    if (search.value) {
        filterHero();
    } else if(search.value == ""){
        updateGrid();
    }else {

    }
});

//Function for filter hero
function filterHero() {
    checkBookmarkStar();
    var searchInput = document.getElementById('search').value.toUpperCase().replace(/\s/g, "");
    for (var i = 0; i < itemsArr.length; i++){
        var a = itemsArr[i];
        img_holder = document.querySelectorAll('.imgHolder');
        if (a.toUpperCase().indexOf(searchInput) > -1){
            img_holder[i].style.display = 'inline-block';
        }else {
            img_holder[i].style.display = 'none';
        }
    }
    for ( let w=0; w<itemsArr.length; w++){
        star[w].addEventListener('click' , function () {
            starId = star[w].id;
            if(this.style.color === 'yellow'){
                this.style.color = 'black';
                deleteFunction();
            }else{
                this.style.color = 'yellow';
                numbers.push(starId);
                localStorage.setItem('historyArr' , numbers);
            }
        });
    }

}

//Save data in local storage
window.onload = function () {
    if (localStorage.getItem("historyArr") !== null) {
        var removeComma = localStorage.getItem('historyArr');
        while(removeComma.charAt(0) === ','){
            removeComma = removeComma.substr(1);
        }
        localStorage.setItem('historyArr' , removeComma);
        numbers = JSON.parse("[" + removeComma + "]");
    }
};

//Marked stars after reload
function checkBookmarkStar() {
    if (localStorage.getItem('historyArr') !== null){
        var storedId = localStorage.getItem('historyArr');
        historyArr.push(storedId);
        arrayFromLS = JSON.parse("[" + historyArr + "]");
        for (var r=0; r<arrayFromLS.length; r++){
            arrayItemFromLS = arrayFromLS[r];
            selectedStar = document.querySelector("[id='" + arrayItemFromLS + "']");
            selectedStar.style.color = 'yellow';
        }
    }

}

//Delete item from local storage array
function deleteFunction() {
    var starInLS = localStorage.getItem('historyArr');
    var starInLSarray = JSON.parse("[" + starInLS + "]");
    numbers = starInLSarray.map(function (a) {
        return a.toString();
    });
    for (let r=0; r<starInLSarray.length; r++){
        var arrayItemFromStarLS = starInLSarray[r];
        if (starId.indexOf(arrayItemFromStarLS) !== -1) {
            numbers.splice(r, 1);
        }
        localStorage.setItem('historyArr' , numbers);
    }
}

//Focus on input when page is load
search.focus();

//Function for delete hero when search input is empty
function updateGrid() {
    for (var i = 0; i < itemsArr.length; i++){
        img_holder[i].style.display = 'none';
    }
}

document.getElementById('clearHistory').addEventListener('click' , function () {
    localStorage.clear();
});





