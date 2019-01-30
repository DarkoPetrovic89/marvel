/**
 * Created by user on 1/24/2019.
 */
/**
 * Created by user on 1/15/2019.
 */
var xhr = new XMLHttpRequest();

var itemsArr = [];
var img_holder;
var star = document.getElementsByTagName('i');
var historyArr = [];
var starId;
var numbers = [];
var searchArr = [];
var itemsPerPage = 10;
var searchInput;
var restArr = [];
var myFunc;
var searchCount;

// Setup our listener to process completed requests
xhr.onload = function () {
    var myObj , itemContainer = "";
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        myObj = JSON.parse(this.responseText);
        var heroes = myObj.data.results;

        for (var x in heroes) {
            var urlForImg = heroes[x].thumbnail.path + "." + heroes[x].thumbnail.extension;
            var name = heroes[x].name;
            var id = heroes[x].id;
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
searchCount = 0;
search.addEventListener("keyup", function () {
    if (search.value) {
        searchCount++;
    filterHero();
    } else if(search.value == ""){
        updateGrid();
    }
});

//Function for filter hero
function filterHero() {
    checkBookmarkStar();
    searchInput = document.getElementById('search').value.toUpperCase().replace(/\s/g, "");
    if (searchInput){
        for (var i = 0; i < itemsArr.length; i++){
            var a = itemsArr[i];
            img_holder = document.querySelectorAll('.imgHolder');
            if (a.toUpperCase().indexOf(searchInput) > -1){
                img_holder[i].classList.remove('hide');
                img_holder[i].classList.add('show');
                img_holder[i].classList.add('checked');
                searchResult();
                if(searchArr.length > itemsPerPage){
                    img_holder[i].classList.remove('show');
                    img_holder[i].classList.add('rest');
                }
            }else {
                img_holder[i].classList.remove('show');
                img_holder[i].classList.add('hide');
                img_holder[i].classList.remove('checked');
            }

        }
    }
    paginateArr();
    showMore();
    itemForPagination();

    for ( let w=0; w<itemsArr.length; w++){
        myFunc = function (e) {
            starId = star[w].id;
            if(this.classList.contains('checkMark')){
                this.classList.remove('checkMark');
                deleteFunction();
            }else{
                this.classList.add('checkMark');
                numbers.push(starId);
                localStorage.setItem('historyArr' , numbers);
            }
            e.preventDefault();
            deleteComma();
        };
        star[w].removeEventListener('click' , myFunc , false);
        if(searchCount == 1){
            star[w].addEventListener('click' , myFunc);
        }

    }

}


// //Save data in local storage
window.onload = function () {
   deleteComma();
};


function deleteComma() {
    console.log('tu je');
    if (localStorage.getItem("historyArr") !== null) {
        var removeComma = localStorage.getItem('historyArr');
        while(removeComma.charAt(0) === ','){
            removeComma = removeComma.substr(1);
        }
        while(removeComma.slice(-1) === ','){
            removeComma = removeComma.substr(0, removeComma.length -1);
        }
        localStorage.setItem('historyArr' , removeComma);
        numbers = JSON.parse("[" + removeComma + "]");
    }
}


//Marked stars after reload
function checkBookmarkStar() {
    if (localStorage.getItem('historyArr') !== null){
        var storedId = localStorage.getItem('historyArr');
        historyArr.push(storedId);
        var arrayFromLS = JSON.parse("[" + historyArr + "]");
        for (var r=0; r<arrayFromLS.length; r++){
           var arrayItemFromLS = arrayFromLS[r];
            var selectedStar = document.querySelector("[id='" + arrayItemFromLS + "']");
            selectedStar.classList.add('checkMark');
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
    for (var r=0; r<starInLSarray.length; r++){
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
    for (var k = 0; k < itemsArr.length; k++){
        img_holder[k].classList.remove('show');
        img_holder[k].classList.add('hide');
    }
}

document.getElementById('clearHistory').addEventListener('click' , function () {
    localStorage.clear();
});


function searchResult() {
    searchArr = [];
    for(var c=0; c<document.querySelectorAll('.checked').length; c++){
        searchArr.push(document.querySelectorAll('.checked')[c])
    }
}
function paginateArr() {
    var page_number =  1;
    const z = paginate(searchArr, itemsPerPage , page_number);
    function paginate (array, page_size, page_number) {
        --page_number; // because pages logically start with 1, but technically with 0
        return array.slice(page_number * page_size, (page_number + 1) * page_size);
    }

}

function showMore() {
    var btn = document.createElement("button");
    btn.classList.add('showMore');
    var text = document.createTextNode('SHOW MORE');
    if (searchArr.length > itemsPerPage){
        btn.appendChild(text);
        document.getElementById('itemHolder').appendChild(btn);
        document.querySelector('.showMore').addEventListener('click' , function () {
            for(var b = 0; b<searchArr.length; b++){
                img_holder[b].classList.remove('rest');
                img_holder[b].classList.add('show');
            }
            setTimeout(checkIfYouNeedMore , 100);
        })
    }
}

var count = 0;
document.getElementById('search').oninput = function () {
    count++;
    setTimeout(removeShowMore , 100);
    searchInput = '';
    if(count > 1){
        unchecked();
    }
    itemForPagination();
};

function removeShowMore() {
    if(searchInput == "" && document.querySelector('.showMore') !== null){
        document.querySelector('.showMore').remove()
    }
    if(searchArr.length < itemsPerPage && document.querySelector('.showMore') !== null){
        document.querySelector('.showMore').remove()
    }
}

function itemForPagination() {
    restArr = [];
    for(var a=0; a<document.querySelectorAll('.rest').length; a++){
        restArr.push(document.querySelectorAll('.rest')[a])
    }
}

function checkIfYouNeedMore() {
    itemForPagination();
    if (restArr.length == 0 && document.querySelector('.showMore') !== null){
        document.querySelector('.showMore').remove()
    }
}

function unchecked() {
    for(var o = 0; o<itemsArr.length; o++){
        img_holder[o].classList.remove('checked');
        img_holder[o].classList.remove('rest');
    }
}

