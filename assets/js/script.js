
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
        var ingredientList = $('<li>');
        if (ingredients === '') {
            $('#ingredients').val('');
            $('#ingredients').attr('placeholder', 'Add the ingredients you have here!');
            return;
        }
        ingredientList.text(ingredients);
        var removeBtn = $('<button>').text('Remove').addClass('button is-danger is-small is-responsive');
        removeBtn.on('click', function() {
            ingredientList.remove();
        });
        ingredientList.append(removeBtn);
        listContainer.append(ingredientList);
        $('#ingredients').val('');
    }
    $(document).on('click', '#generateBtn', function(event) {
        event.preventDefault();
        generateRecipes();
    });
    
    function generateRecipes() {
        var ingredientsArray = [];
        $('#container li').each(function () {
            ingredientsArray.push($(this).text().trim());
        });

        var mealType = $('#mealType').val();
        
        fetchRecipes(ingredientsArray, mealType)
        .then(data => {
            if(data.results.length === 0){
                displayError()
            } else {
            displayRecipes(data.results)
    }});
    };

    function displayError() {
        var recipeContainer = $('#recipeContainer');
        recipeContainer.empty()
        var errorMessage = $('</p>').text('No recipes found that include all the above ingredients. Please amend your ingredient list and try again!');
        recipeContainer.append(errorMessage);
    }

    function fetchRecipes(ingredientsArray, mealType) {
        var apiKey = 'c6db27357d8f494387f67c1e0ada60f5';
        var apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';
        var queryString = `apiKey=${apiKey}&includeIngredients=${encodeURIComponent(ingredientsArray.join(','))}&type=${mealType}&addRecipeInformation=true`;
        var queryUrl = `${apiUrl}?${queryString}`;
        return fetch(queryUrl)
        .then(response => response.json())
        .then(data => {
            return data;
        });
    };

    function displayRecipes(recipes) {
        var recipeContainer = $('#recipeContainer');
        recipeContainer.empty();
        for (var i = 0; i < recipes.length; i++) {
            var recipe = recipes[i];
            var recipeCard = $('<div>');
            var recipeLink = $('<a>').attr('href', recipe.sourceUrl);
            var recipeImage = $('<img>').attr('src', recipe.image).attr('alt', recipe.title);
            var recipeTitle = $('<h3>').text(recipe.title);
            recipeLink.append(recipeImage, recipeTitle);
            var saveBtn = $('<button>').text('Save');
            saveBtn.on('click', function() {
                saveRecipe(recipe.title, recipe.sourceUrl, recipe.image);
            });
            recipeCard.append(recipeLink, saveBtn);
            recipeContainer.append(recipeCard);
        }
    }

    function saveRecipe(title, sourceUrl, image) {
        var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        var recipeObject = {
            title: title,
            sourceUrl: sourceUrl,
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
            var savedLink = $('<a>').attr('href', recipe.sourceUrl);
            var savedImage = $('<img>').attr('src', recipe.image).attr('alt', recipe.title);
            var savedTitle = $('<h3>').text(recipe.title);
            savedLink.append(savedImage, savedTitle);
            savedCard.append(savedLink);
            savedContainer.append(savedCard);
        }
    }
    if(window.location.pathname.includes('saved.html')) {
        displaySavedRecipes();
    }

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
        }
    };


})
