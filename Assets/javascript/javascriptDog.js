var animalIndex = 0;
var animalBreeds = [];
var listOfBreeds;
var currentPage = 1;
var resultLimit = 30;
var pf = new petfinder.Client({ apiKey: "OtOAvPPs5IfYjeg1yJ697I85pHRMkUZN3cTmFWoNp8U0AZIrp4", secret: "OhXZcmAgBeyDIUVmIJRqEFBOX6XYdZu59k7mXDPn" });

getAnimals("Dog", currentPage, resultLimit);

function getAnimals(type, page, numResults) {
    var paramObject = {
        page: page,
        limit: numResults,
        type: type
    };
    pf.animal.search(paramObject)
        .then(function (response) {
            //console.log(response);
            // Do something with response.data.animals
            var results = response.data.animals;
            console.log(results)
            //showAnimals(results);

            listOfBreeds = showAnimals(results);
            console.log(listOfBreeds);
            //console.log("listOfBreeds", listOfBreeds);

            showOneAnimal(listOfBreeds[animalIndex]);
            wikiInfo(listOfBreeds[animalIndex].breeds.primary);
        })
        .catch(function (error) {
            // Handle the error
        });
}


function showAnimals(animalData) {
    for (var i = 0; i < animalData.length - 1; i++) {
        if (animalData[i].photos.length > 0) {
            animalBreeds.push(animalData[i]);
        }
    }
    return animalBreeds;
}

function showOneAnimal(animalData) {
    console.log(animalData)
    console.log(animalIndex)
    var animalImage = $("<img>");
    animalImage.attr("src", animalData.photos[0].medium);
    $("#pet-images").html(animalImage);

}

function wikiInfo(animalBreed) {
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" + animalBreed,
        method: "GET"
    }).then(function (response) {
        var animalArtical = response.query.pages[Object.keys(response.query.pages)[0]].extract;
        var animalBreedInfo = $("<p>");
        var animalArticalInfo = $("<p>");
        animalBreedInfo.text(animalBreed);
        animalArticalInfo.text(animalArtical);
        $("#wiki-info").html(animalBreedInfo);
        $("#wiki-info").append(animalArticalInfo);
    })
}

$("#reject-animal").on("click", function () {
    animalIndex++;
    if (animalIndex <= listOfBreeds.length - 1) {
        console.log(animalBreeds[animalIndex]);
        showOneAnimal(animalBreeds[animalIndex]);
        wikiInfo(listOfBreeds[animalIndex].breeds.primary)
        console.log(listOfBreeds[animalIndex].breeds.primary)
    } else {
        animalIndex = 0;
        listOfBreeds = [];
        getAnimals("Dog", currentPage++, resultLimit);
    }

})