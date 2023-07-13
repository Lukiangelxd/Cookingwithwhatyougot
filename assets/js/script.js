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
        listContainer.append(ingredientList);
        $('#ingredients').val('');
    }
})
