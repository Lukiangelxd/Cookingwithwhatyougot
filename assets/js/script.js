$(function () {
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
            displayRecipes(data.results)
        });
    };

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
            // Change class name for styling.
            var recipeCard = $('<div>').addClass('recipe-card');
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
            // Change class name for styling.
            var savedCard = $('<div>').addClass('recipe-card');
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

})
