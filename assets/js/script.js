$(function () {
    // Event listener to navigate to the generator page on click of the 'Let's Make Some Magic' button.
    $(document).on('click', '#navBtn', function() {
        window.location.href= 'generator.html';
    });
    // Event listeners to append the ingredients typed into the form. Either the enter button or clicking the 'Add Ingredient' button.
    $(document).on('click', '#ingredientBtn', function (event) {
        event.preventDefault();
        formSubmit();
    });
    $(document).on('keypress', '#ingredients', function (event) {
        if (event.key === 'Enter'){
        event.preventDefault();
        formSubmit();
        }
    });
    function formSubmit() {
        var listContainer = $('#container');
        var ingredients = $('#ingredients').val().trim();
        var ingredientList = $('<li>').addClass('mb-4 has-text-weight-bold');
        // Sets the placeholder text if input form is empty and ends the function early to prevent empty strings appending.
        if (ingredients === '') {
            $('#ingredients').val('');
            $('#ingredients').attr('placeholder', 'Add the ingredients you have here!');
            return;
        };
        // Sets the ingredient list to the input text and adds a remove button.
        ingredientList.text(ingredients);
        var removeBtn = $('<button>').text('Remove').addClass('button is-danger is-small is-responsive ml-4 is-rounded');
        removeBtn.attr('type', 'button');
        removeBtn.on('click', function() {
            ingredientList.remove();
        });
        // Appends the remove button to the corresponding ingredient, the ingredient and the button to the empty <div> container, and clears the input form.
        ingredientList.append(removeBtn);
        listContainer.append(ingredientList);
        $('#ingredients').val('');
    };

    // Adds event listener to the 'Generate Recipes' button to call the generateRecipes function.
    $(document).on('click', '#generateBtn', function(event) {
        event.preventDefault();
        generateRecipes();
    });
    
    function generateRecipes() {
        var ingredientsArray = [];
        // Iterates over each of the ingredients in the <div> container
        $('#container li').each(function () {
            // Creates a copy of the <li> element and removes it's child element, the remove button. Then takes the remaining text in the <li> element and adds that text to the array of ingredients.
            var ingredientText = $(this).clone().children().remove().end().text().trim();
            ingredientsArray.push(ingredientText);
        });

        var mealType = $('#mealType').val();
        // Calls the fetchRecipes function with the ingredients and selected meal type as parameters.
        fetchRecipes(ingredientsArray, mealType)
        .then(data => {
            if(data.hits.length === 0){
                // Displays the error message if no recipes are found.
                displayError()
            } else {
                // Displays the recipes if found by the API call.
            displayRecipes(data)
    }});
    };

    // Clears the recipe container <div> and appends an error message as a <p> element.
    function displayError() {
        var recipeContainer = $('#recipeContainer');
        recipeContainer.empty()
        var errorMessage = $('</p>').text('No recipes found that include all the above ingredients. Please amend your ingredient list or make sure to select a meal type and try again!');
        recipeContainer.append(errorMessage);
    };

    function fetchRecipes(ingredientsArray, mealType) {
        var apiId = '99e5feb6'
        var apiKey = '3a64f009b218fd0ca76299a5367492d8';
        var apiUrl = 'https://api.edamam.com/api/recipes/v2';
        // Sets the query string for the API call. The 'q' parameter is used for ingredients and is encoded using encodeURIComponent for special characters. 
        var queryString = `type=public&q=${encodeURIComponent(ingredientsArray.join(','))}&app_id=${apiId}&app_key=${apiKey}&mealType=${mealType}&random=true`;
        var queryUrl = `${apiUrl}?${queryString}`;
        return fetch(queryUrl)
        .then(response => {
            // Displays error message if API call is unsuccessful.
            if (response.status !== 200) {
                displayError();
            }
            // Returns the parsed API response in JSON format.
            return response.json();
        })
        .then(data => {
            return data;
        });
    };

    function displayRecipes(data) {
        // Targets the 'hits' array in the data object to get recipe information.
        var recipes = data.hits
        var recipeContainer = $('#recipeContainer');
        recipeContainer.empty();
        // Iterates through each recipe in the 'hits' array.
        for (var i = 0; i < recipes.length; i++) {
            // Targets the 'recipe' object from each item in the 'hits' array to get the source URL, recipe label, and image.
            var recipe = recipes[i].recipe;
            var recipeCard = $('<div>');
            var recipeLink = $('<a>').attr('href', recipe.url);
            var recipeImage = $('<img>').attr('src', recipe.image).attr('alt', recipe.label);
            var recipeTitle = $('<h3>').text(recipe.label);
            // Appends the recipe label and image to the URL anchor so the user can click the label or image to go to the recipe's URL.
            recipeLink.append(recipeImage, recipeTitle);
            // Adds a save button to each recipe which stores the entire recipe object as data and calls the saveRecipe function on click.
            var saveBtn = $('<button>').text('Save').data('recipe', recipe).addClass('button is-success is-small is-responsive m-4 is-rounded');
            saveBtn.on('click', function() {
                // Targets the data stored in the clicked save button.
                var savedRecipe = $(this).data('recipe');
                saveRecipe(savedRecipe.label, savedRecipe.url, savedRecipe.image);
            });
            // Appends the recipe objects and save buttons to empty <div> elements and appends that to its container <div>.
            recipeCard.append(recipeLink, saveBtn);
            recipeContainer.append(recipeCard);
        };
    };

    function saveRecipe(label, url, image) {
        // Targets the saved recipes under the 'savedRecipes' key in local storage and parses them back to objects. If there is nothing in local storage, creates an empty array instead.
        var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        // Creates an object with the properties of the recipe to be saved and adds it to the savedRecipes array.
        var recipeObject = {
            label: label,
            url: url,
            image: image
        };
        savedRecipes.push(recipeObject);
        // Converts the newly formed array to a string and saves to local storage under the key 'savedRecipes'.
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    };

    function displaySavedRecipes() {
        var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        var savedContainer = $('#savedContainer');
        savedContainer.empty()
        // Iterates over each saved recipe in the 'savedRecipes' array.
        for (var i = 0; i < savedRecipes.length; i++) {
            // Targets the current saved recipe inside the loop.
            var recipe = savedRecipes[i];
            var savedCard = $('<div>');
            var savedLink = $('<a>').attr('href', recipe.url);
            var savedImage = $('<img>').attr('src', recipe.image).attr('alt', recipe.label);
            var savedTitle = $('<h3>').text(recipe.label).addClass('savedTitle');
            // Appends the saved recipe image and label to the anchor URL.
            savedLink.append(savedImage, savedTitle);
            // Creates a remove button for each saved recipe which calls the 'handleRemoveRecipe' function on click.
            var savedRemoveBtn = $('<button>').text('Remove').addClass('button is-danger is-small is-responsive ml-4 is-rounded');
            savedRemoveBtn.on('click', handleRemoveRecipe(recipe));
            // Appends the anchor and remove button to empty <div> elements and then to an empty <div> container.
            savedCard.append(savedLink, savedRemoveBtn);
            savedContainer.append(savedCard);
        };
    };

    function handleRemoveRecipe(recipe) {
        // Returns an anonymous function to capture the recipe object and calls the 'removeRecipe' function and 'displaySavedRecipes' function.
        return function () {
            removeRecipe(recipe);
            displaySavedRecipes();
        };
    };

    function removeRecipe(recipe) {
        // Targets the current list of saved recipes in local storage.
        var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        // Creates a new 'updatedRecipes' array of all the items in the 'savedRecipes' array whose recipe labels are not equal to the one to be removed.
        var updatedRecipes = savedRecipes.filter(item => item.label !== recipe.label);
        // Converts the 'updatedRecipes' array to a string and saves it to local storage under the 'savedRecipes' key.
        localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    };
    
    // Calls the 'displaySavedRecipes' function if on the saved.html page. 
    if(window.location.pathname.includes('saved.html')) {
        displaySavedRecipes();
    };

    // Calls 'findNearbyRestaurants' function on click of the 'Find Nearby Restaurants' button.
    $(document).on('click', '#groceryBtn', function(event) {
        event.preventDefault();
        findNearbyRestaurants();
    });

    function findNearbyRestaurants() {
        // Uses Geolocation API to get the user's current location.
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Targets the latitutde and longitude of the user's position and uses them as parameters in the 'fetchNearbyRestaurants' function.
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                fetchNearbyRestaurants(latitude, longitude)
                .then(data => {
                    displayNearbyRestaurants(data.results);
                })
            }
        )};

    function fetchNearbyRestaurants(latitude, longitude) {
        var apiKey = 'fsq3uVo1P0UFY6J835VuN/deQOPLxB9ICLoktV/VLobsxwc=';
        var apiUrl = 'https://api.foursquare.com/v3/places/search';
        // Sets the query parameters for the API request.
        var queryParams = {
            query: 'restaurant',
            ll: `${latitude},${longitude}`,
            limit: 10,
        };
        // Converts the query parameters into a string.
        var queryString = new URLSearchParams(queryParams);
        var queryUrl = `${apiUrl}?${queryString}`;
        // Calls the API with authorizaton headers.
        return fetch(queryUrl, {
            headers: {
                Authorization: `${apiKey}`,
                accept: 'application/json'
            }
            })
        .then(response => response.json())
        .then(data => {
            return data;
        })
    };

    function displayNearbyRestaurants(restaurants) {
        var restaurantContainer = $('#restaurantContainer');
        restaurantContainer.empty();
        // Iterates through the list of restaurants provided by the API call.
        for (var i = 0; i < restaurants.length; i++) {
            var restaurant = restaurants[i];
            var restaurantCard = $('<div>');
            var restaurantLink = $('<a>').attr('href', `https://foursquare.com/v/${restaurant.fsq_id}`);
            var restaurantTitle = $('<h3>').text(restaurant.name);
            // Appends the restaurant name to the URL anchor, then the anchor to empty <div> elements, and finally to an empty <div> container.
            restaurantLink.append(restaurantTitle);
            restaurantCard.append(restaurantLink);
            restaurantContainer.append(restaurantCard);
        };
    };


});
