/**
 * Created by user on 1/15/2019.
 */
var xhr = new XMLHttpRequest();

var heroes = [];
var itemsArr = [];
var img_holder;
var star = document.getElementsByTagName('i');
var idArr = [];
var cloneArr = [];
var historyArr = [];
var selectedStar;
var arrayFromLS = [];
var arrayItemFromLS;
var starId;
var bookmarkListHistory = document.getElementById('bookmarkListHistory');
var objFromLs = [];
var items = [];
var cloneString;

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
    // test();
    var searchInput = document.getElementById('search').value.toUpperCase().replace(/\s/g, "");
    for (var i = 0; i < itemsArr.length; i++){
        var a = itemsArr[i];
        img_holder = document.querySelectorAll('.imgHolder'),
            bookmarkList = document.getElementById('bookmarkList');
        if (a.toUpperCase().indexOf(searchInput) > -1){
            img_holder[i].style.display = 'inline-block';
        }else {
            img_holder[i].style.display = 'none';
        }
    }
    for ( let w=0; w<itemsArr.length; w++){
        star[w].addEventListener('click' , function () {
            var itm = star[w].parentElement;
            var clone = itm.cloneNode(true),
                bookmarkList = document.getElementById('bookmarkList');
            starId = star[w].id;
            clone.setAttribute('data-id' , starId);
            clone.querySelector('i').remove();
            if(this.style.color === 'yellow' && bookmarkListHistory.childNodes.length > 1){
                console.log(historyArr)
                this.style.color = 'black';
                deleteItemFromBookmarkListHistory();
                var historyHtml = bookmarkListHistory.outerHTML.substr(31).slice(0 , -7);
                while(historyHtml.charAt(0) === ',')
                {
                    historyHtml = historyHtml.substr(1);
                    console.log(historyHtml);
                }
                localStorage.setItem('cloneArr' , cloneArr);
                localStorage.setItem('cloneArr' , historyHtml);
            } else if (this.style.color === 'yellow' && bookmarkList.childNodes.length > 1) {
                this.style.color = 'black';
                bookmarkList.querySelector("[data-id='" + starId + "']").remove();
                deleteItemFromLSarray();
                console.log('if')
            }else{
                this.style.color = 'yellow';
                document.getElementById('bookmarkList').appendChild(clone);
                cloneString = clone.outerHTML;
                cloneArr.push(cloneString);
                historyArr.push(starId);
                localStorage.setItem('cloneArr' , cloneArr);
                localStorage.setItem('historyArr' , historyArr);
                console.log('else')
            }
        });
    }

}

//Save data in local storage
window.onload = function () {
    if (localStorage.getItem("cloneArr") !== null) {
        var storedItems = localStorage.getItem('cloneArr');
        cloneArr.push(storedItems);
        document.getElementById('bookmarkListHistory').insertAdjacentHTML( 'beforeend', storedItems );
        var removeComma = localStorage.getItem('historyArr');
        while(removeComma.charAt(0) === ','){
            removeComma = removeComma.substr(1);
        }
        localStorage.setItem('historyArr' , removeComma);
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
    objFromLs = JSON.parse("[" + arrayFromLS + "]");
    items = objFromLs.map(function (a) {
        return a.toString();
    });
}

//Delete item from bookmark list history
function deleteItemFromBookmarkListHistory() {
    document.getElementById('bookmarkListHistory').querySelector("[data-id='" + starId + "']").remove();
    deleteItemFromLSarray();
}

//Delete item from local storage array
function deleteItemFromLSarray(){
    console.log(items , 'ulazi dare');
    for (var i = 0; i < items.length; i++) {
        var obj = items[i];

        if (starId.indexOf(obj) !== -1) {
            items.splice(i, 1);
        }
        localStorage.setItem('historyArr' , items);
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

//
// var page_number = 1;
// var arrayName = heroes;
// var page_size = 12;
// function dare() {
//     function paginate (arrayName, page_size, page_number) {
//         --page_number; // because pages logically start with 1, but technically with 0
//         return arrayName.slice(page_number * page_size, (page_number + 1) * page_size);
//     }
//
//     const paginator = paginate(heroes , 12 , page_number);
//     console.log(paginator , 'paginator');
//
//     if(heroes.length > 12){
//         document.getElementById('pagination').style.display = 'block';
//     }
//
//     heroes = paginator;
//     console.log(heroes)
//
// // console.log(paginate(arrayName , page_size ,page_number) , 'jaja');
// // console.log(paginate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 4, 1));
//
//     console.log(heroes , 'heroes')
// }
//
// function test() {
//     const element = document.querySelector('.imgHolder');
//     console.log(element , 'element');
//     const display = element.style.display;
//     console.log(display);
// }




