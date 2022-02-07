// Set a variable for a POST access token call 
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.kroger.com/v1/connect/oauth2/token",
  "method": "POST",
  "headers": {
    "Access-Control-Allow-Origin": "\*",
    "Vary": "Origin",
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Basic Y29va2lmeS1iMjI2ODI0YmRiNzI2MjE1NDk0YTRlYmVhNzU3N2UxZDE3NTMxNjM3Nzk1NDI5MjQ2ODpEN1hrR2t1NjJkRklZcVdNcnFFTktQekxJQkJZSEc3SG9QZ2JFTVZ2",

  },
  "data": {
    "grant_type": "client_credentials",
    "scope": "product.compact"
  }
}

// Post API jQuery call establishing the OAuth to retrieve and save access token in local storage
$.ajax(settings).done(function (data) {

  if (data !== null) {
    localStorage.setItem("token", data.access_token);
  } else {
    console.log(data);
  }
});

// Retrieve the accessToken from local storage 
var accessToken = localStorage.getItem("token");

// Making an ingredients array hardcoded for initial release
/* TODO: 
When recipe API is wired  
Re-use array to append recipe ingredients to array based on ingredients list of a recipe
*/
let ingredients = ['Bread', 'Jam', 'Peanut butter'];

// Function for displaying ingredients data 
var getProductDetails = function () {
  if (ingredients.length === 0) {
    console.log("No ingredients found!");
    return;
  };

  const baseProductsURL = "https://api.kroger.com/v1/products";

  for (let i = 0; i < ingredients.length; i++) {

    let ingredientName = ingredients[i];

    var filters = "?filter.term=" + ingredientName + "&filter.limit=1";

    fetch(baseProductsURL + filters, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + accessToken
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data)
        // Creating variables for all necessary ingredient card components 
        var productsContainer = document.querySelector(".ingr-section");
        var productSection = document.createElement("section");
        var ingredient = document.createElement("h3");
        /*
        The commented out code for 'productImage' was used to  
        create image element and add it to the product section   
        instead of setting it as background image
         */
        // var productImage = document.createElement("img");
        var productDetailsList = document.createElement("ul");
        var productTitle = document.createElement("li");
        var productCategory = document.createElement("li");
        var productImgUrl = data.data[0].images[0].sizes[2].url;
        /*
        Commenting out product price and isle for now, 
        need to wire up customer location to display the data
        */
        // var productLocation; 
        // var productPrice = document.createElement("li");
        

        // Adding classes to created components
        productSection.classList.add("ingr-card", "col-3");
        ingredient.classList.add("ingr-name");
        productTitle.classList.add("title");
        productCategory.classList.add("category");

        // Setting content for the section elements
        ingredient.textContent = ingredientName;
        productTitle.textContent = "Product Title: " + data.data[0].description;
        productCategory.textContent = "Product Department: " + data.data[0].categories[0];
        // productImage.setAttribute("src", data.data[0].images[0].sizes[2].url);
        productSection.style.backgroundImage = "url(" + productImgUrl + ")";

        // Appending all the elements together
        productsContainer.append(productSection);
        productSection.append(ingredient);
        // productSection.append(productImage);
        productSection.append(productDetailsList);
        productDetailsList.append(productTitle);
        productDetailsList.append(productCategory);  

      })
      .catch(error => console.log(error))
  }
}

var ingrBtn = document.querySelector("#ingredients-btn");

ingrBtn.addEventListener("click", getProductDetails);