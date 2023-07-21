$(function () {
    $(document).on('click', '#navBtn', function() {
        window.location.href= 'generator.html';
    });
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
        if (ingredients === '') {
            $('#ingredients').val('');
            $('#ingredients').attr('placeholder', 'Add the ingredients you have here!');
            return;
        };
        ingredientList.text(ingredients);
        var removeBtn = $('<button>').text('Remove').addClass('button is-danger is-small is-responsive ml-4 is-rounded');
        removeBtn.attr('type', 'button');
        removeBtn.on('click', function() {
            ingredientList.remove();
        });
        ingredientList.append(removeBtn);
        listContainer.append(ingredientList);
        $('#ingredients').val('');
    };

    $(document).on('click', '#generateBtn', function(event) {
        event.preventDefault();
        generateRecipes();
    });
    
    function generateRecipes() {
        var ingredientsArray = [];
        $('#container li').each(function () {
            var ingredientText = $(this).clone().children().remove().end().text().trim();
            ingredientsArray.push(ingredientText);
        });

        var mealType = $('#mealType').val();
        
        fetchRecipes(ingredientsArray, mealType)
        .then(data => {
            if(data.hits.length === 0){
                displayError()
            } else {
            displayRecipes(data)
    }});
    };

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
        var queryString = `type=public&q=${encodeURIComponent(ingredientsArray.join(','))}&app_id=${apiId}&app_key=${apiKey}&mealType=${mealType}&random=true`;
        var queryUrl = `${apiUrl}?${queryString}`;
        return fetch(queryUrl)
        .then(response => {
            if (response.status !== 200) {
                displayError();
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        });
    };

    function displayRecipes(data) {
        var recipes = data.hits
        var recipeContainer = $('#recipeContainer');
        recipeContainer.empty();
        for (var i = 0; i < recipes.length; i++) {
            var recipe = recipes[i].recipe;
            var recipeCard = $('<div>');
            var recipeLink = $('<a>').attr('href', recipe.url);
            var recipeImage = $('<img>').attr('src', recipe.image).attr('alt', recipe.label);
            var recipeTitle = $('<h3>').text(recipe.label);
            recipeLink.append(recipeImage, recipeTitle);
            var saveBtn = $('<button>').text('Save').data('recipe', recipe).addClass('button is-success is-small is-responsive m-4 is-rounded');
            saveBtn.on('click', function() {
                var savedRecipe = $(this).data('recipe');
                saveRecipe(savedRecipe.label, savedRecipe.url, savedRecipe.image);
            });
            recipeCard.append(recipeLink, saveBtn);
            recipeContainer.append(recipeCard);
        };
    };

    function saveRecipe(label, url, image) {
        var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        var recipeObject = {
            label: label,
            url: url,
            image: image
        };
        savedRecipes.push(recipeObject);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    };

    function displaySavedRecipes() {
        var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        var savedContainer = $('#savedContainer');
        savedContainer.empty()
        for (var i = 0; i < savedRecipes.length; i++) {
            var recipe = savedRecipes[i];
            var savedCard = $('<div>');
            var savedLink = $('<a>').attr('href', recipe.url);
            var savedImage = $('<img>').attr('src', recipe.image).attr('alt', recipe.label);
            var savedTitle = $('<h3>').text(recipe.label).addClass('savedTitle');
            savedLink.append(savedImage, savedTitle);
            var savedRemoveBtn = $('<button>').text('Remove').addClass('button is-danger is-small is-responsive ml-4 is-rounded');
            savedRemoveBtn.on('click', handleRemoveRecipe(recipe));
            savedCard.append(savedLink, savedRemoveBtn);
            savedContainer.append(savedCard);
        };
    };

    function handleRemoveRecipe(recipe) {
        return function () {
            removeRecipe(recipe);
            displaySavedRecipes();
        };
    };

    function removeRecipe(recipe) {
        var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        var updatedRecipes = savedRecipes.filter(item => item.label !== recipe.label);
        localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    };

    if(window.location.pathname.includes('saved.html')) {
        displaySavedRecipes();
    };

    var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes'));
    if (savedRecipes.length === 0) {
        var borderHide = $('#savedBorder');
        borderHide.addClass('hidden');
    };

    $(document).on('click', '#groceryBtn', function(event) {
        event.preventDefault();
        findNearbyRestaurants();
    });

    function findNearbyRestaurants() {
        navigator.geolocation.getCurrentPosition(
            function(position) {
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
        var queryParams = {
            query: 'restaurant',
            ll: `${latitude},${longitude}`,
            limit: 10,
        };
        var queryString = new URLSearchParams(queryParams);
        var queryUrl = `${apiUrl}?${queryString}`;
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
        for (var i = 0; i < restaurants.length; i++) {
            var restaurant = restaurants[i];
            var restaurantCard = $('<div>');
            var restaurantLink = $('<a>').attr('href', `https://foursquare.com/v/${restaurant.fsq_id}`);
            var restaurantTitle = $('<h3>').text(restaurant.name);
            restaurantLink.append(restaurantTitle);
            restaurantCard.append(restaurantLink);
            restaurantContainer.append(restaurantCard);
        };
    };


});
