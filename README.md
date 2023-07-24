# Cooking With What You Got
This projects goal intented to be for those who are looking for easy meals using ingredients they already have in their own kitchen!


## Introduction
This is an application that will help you find delicious recipes using ingredients you already own in your home. The application will also give you nearby restaurants for a fun night out or a quick take out option. There are three pages for the application. The Home page which contains an About Us, a navbar with links to the Generator and Saved pages. The Generator page will allow you to input up to several ingredients that you would like to include in a recipe. It will allow you to pick between Breakfast, Lunch or Dinner and will let you save any recipes you would like to make later. Finally there is the Saved page where any recipes you chose to save from the Generator page will reside. 

For the API's the team used Foursquare, Fetch, Geolocation and Edamam. The response is a list of recipes with a recipe label, URL and image. They are first iterated through a for loop and then generated into empty div container. The Foursquare is done the same way. The Edamam API call's query string is constructed from the ingredients added by the user and the meal type selected. It encodes the ingredients using encodeURIComponent in a template literal to handle any special characters in the URL. Meanwhile the FourSquare API call gets its query parameters from the geolocation API's coordinates. Those coordinates are put into an object with the query 'restaurant' and a limit of 10 restaurants. Those parameters are then encoded into the URL using new URLSearchParams.

Most of the challenges we faced as a team was within CSS and Javascript. The CSS framemwork was very easy to grasp the basic understandings but the application was a bit trickier when paired with vanilla CSS along side the id and class tags. One main issues with the CSS was making sure the media screen was more compatable with other screen sizes such as mobile. When making the webpage reflect the original framework we made changes based off of the realization of how difficult it would be to execute. The main challenges faced while writing the JavaScript code were constructing the query strings for the API and deciding on which APIs to use. To solve the problem of constructing the query string, we looked into encodeURIComponent, new URLSearchParams, and template literals to deal with special characters in the URL. When it came to deciding on which API to use, we originally planned on Spoonacular for the recipes and Yelp for the restaurants. After reading more carefully through Spoonacular's terms, we decided against posting that API Key to a public repo. Meanwhile Yelp was giving us issues with cross-origin resource sharing, so we pivoted to the FourSquare API to achieve our desired outcome.

### Wireframing
#### We Made a front page using figma as well as an idea for how the generator will look
![Front Page](https://github.com/Lukiangelxd/Cookinwithwhatyougot/assets/133689246/8a5f770a-b8c9-4e80-8fb8-9e308a6478b9)
![Generator](https://github.com/Lukiangelxd/Cookinwithwhatyougot/assets/133689246/8242d5c6-9958-4366-9e78-1a6cf12a5d2f)

## Reference
The API's:
[Foursquare] (https://api.foursquare.com/v3/places/search)
[Fetch]
[Geolocation]
[Edamam] (https://api.edamam.com/api/recipes/v2)
[Bulma] (https://bulma.io/)
[Figma] (https://www.figma.com/files/recents-and-sharing?fuid=1260988429407494569)
### Team Collaboration

For the majority of the project we spent toagther we shared screens and delegated the tasks to work amongst one another. The commits to the project are not a full reflection as to the work done as to some work was spent with one another. Wren and Hannah focused on The CSS and HTML framework while Chris focused on the main Javascript and API work.
