/**
 * Created by user on 1/15/2019.
 */
var xhr = new XMLHttpRequest();

var items = [];
var itemsArr = [];
var img_holder;
// Setup our listener to process completed requests
xhr.onload = function () {
    var myObj , itemContainer = "";
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        myObj = JSON.parse(this.responseText);
        items = myObj.data.results;

        for (var x in items) {
            var urlForImg = items[x].thumbnail.path + "." + items[x].thumbnail.extension;
            var name = items[x].name;
            itemContainer += "<div class='imgHolder'><img class='sliderImg' src="+ urlForImg +"><div>" + name + "</div></div>";
            // console.log(itemsArr[x].replace(/\./g,' '));

            itemsArr.push(items[x].name.replace(/\./g,' ').replace(/\s/g, ""));

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
}

//Focus on input when page is load
search.focus();

//Function for delete hero when search input is empty
function updateGrid() {
    for (var i = 0; i < itemsArr.length; i++){
        img_holder[i].style.display = 'none';
    }
}
