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
        var ingredients = $('#ingredients').val();
        var ingredientList = $('<li>');
        if (ingredients.trim() === '') {
            $('#ingredients').val('');
            ingredients.attr('placeholder', 'Add the ingredients you have here!');
            return;
        }
        ingredientList.text(ingredients.trim());
        listContainer.append(ingredientList).addClass(listedItems);
        $('#ingredients').val('');
    }
    $(document).on('click', '#generateBtn', function(event) {
        event.preventDefault();
        displayRecipes();
    })
    
    var apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';
    var apiKey = 'b70ec2d513aa1a6ac6fbc26bbc3410906bb8f2be';
    var recipeContainer = $('#recipeContainer');
    var mealType = getMealType($('#mealType').val());
    
    function getMealType() {
        if ($('#mealType').val() === '1') {
            return 'breakfast';
        }
        if ($('#mealType').val() === '2') {
            return 'snack';
        }
        if ($('#mealType').val() === '3') {
            return 'main-course'
        }
    };
})
