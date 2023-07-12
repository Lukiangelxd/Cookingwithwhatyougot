$(function () {
    $(document).on('click', '#submitBtn', function (event) {
        event.preventDefault();
        formSubmit();
    });
    $(document).on('keypress', '#fname', function (event) {
        if (event.key === 'Enter'){
        event.preventDefault();
        formSubmit();
        }
    });
    function formSubmit() {
        var listContainer = $('#container');
        var ingredients = $('#fname').val();
        var ingredientList = $('<li>');
        ingredientList.text(ingredients);
        listContainer.append(ingredientList);
        $('#fname').val('');
    }
})