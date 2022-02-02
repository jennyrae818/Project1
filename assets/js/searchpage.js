function getrecipe(e) {
    e.preventDefault()
    var mykey = "" // if needed
    var recipesearch = document.querySelector("#").value // recipe search box value
    var recipeapi= `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${mykey}&units=imperial`
    
  
    fetch(recipeapi)
    .then (res => res.json()) 
    .then (data => {
      console.log(data)
      var image = document.querySelector(".img")
      img = ` ${// unsure how to pull an image... }`
      var price = document.querySelector(".price")
      price.innerText = `Price: $ ${data.//look up through console - data path}`
      var aisle = document.querySelector(".aisle")
      aisle.innerText = `Aisle: ${data.//look up}`
     
    })
}

var searchbtn = document.querySelector("#ingredients-btn")
searchbtn.addEventListener("click", getrecipe)