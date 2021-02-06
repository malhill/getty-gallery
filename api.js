//Foundation search bar
$(document).foundation();
$('.search').on('click', function (event) {
  $(".search-field").toggleClass("expand-search");
  // if the search field is expanded, focus on it
  if ($(".search-field").hasClass("expand-search")) {
    $(".search-field").focus();
  }
});


//grab the input data before using it
var cityInput = $("#city-input");
var cityName = "";
var cityNameTag = $("<h3>");
var tempTag = $("<p>");
var humidityTag = $("<p>");
var windTag = $("<p>");
var currentWeather = $("#current-weather");
var weatherTag = $("<p>");
var weather = "";
// var gifURLs = [];


const weaBlock = $("#weather-block");
const inputSto = $("#input-storage");

/*
Was tring to insert the entire iframe but getting undefined line 23 error so will leave it for later. I did look very cute when I added it in the html. You can uncomment it in the html to see it-->
const gifBlock = $(document.createElement("iframe"));
gifBlock.attr(title, "Conditions");
gifBlock.attr(width, "100");
gifBlock.attr(height, "50");
gifBlock.attr(src, "https://giphy.com/embed/SAC0wTRQYO2Y0");
gifBlock.attr(frameborder, "0");
gifBlock.addClass("giphy-embed");*/





//Local storage
const storedSearch = localStorage.getItem("list");
const searchList = storedSearch ? JSON.parse(storedSearch) : []


// function for current weather API call
function currentWeatherAPI(e) {
  // stop search unless user presses the Enter key. The Keycode for "enter" is the numer 13 - thanks Jess!
  if (e.keyCode !== 13) {
    return;
  }

  // store the input info from cityInput as value to be passed in function below
  cityName = cityInput.val();
  console.log("city searched: " + cityName);

  // building out container for weather info
  currentWeather.addClass("current-weather");
  // assign cityName to h3 tag
  $(cityNameTag).text(cityName);
  // append h3 tag to page
  currentWeather.append(cityNameTag);

  var apiKey = "c7cde66d595fb98577da25bd96a3df85";
  // query URL for city weather
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

  // API call for city weather
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      console.log("WEATHER QUERY URL - " + queryURL);
      // variable to get icon for todays weather
      var todayIcon = response.weather[0].icon;
      // assign value to todayIconURL
      var todayIconURL = "https://openweathermap.org/img/wn/" + todayIcon + ".png";
      // append todayIconURL next to cityNameTag
      $(cityNameTag).append("<img src =" + todayIconURL + ">");

      // create variables and assign weather info as text
      weather = response.weather[0].main;
      $(weatherTag).text("Weather: " + weather);
      var tempF = Math.floor((response.main.temp - 273.15) * 1.8 + 32);
      $(tempTag).text("Temperature: " + tempF + "°F");
      var humidity = response.main.humidity
      $(humidityTag).text("Humidity: " + humidity + "%");
      var windSpeed = response.wind.speed;
      $(windTag).text("Wind Speed: " + windSpeed + " MPH");

      // append weather info onto page
      $(currentWeather).append(weatherTag, tempTag, humidityTag, windTag,);
      weaBlock.show();
      inputSto.show();

      // call function to retrieve city images and weather gifs
      displayImg();
      createGif();
    });
}

// create function that pulls id of city button, calls API to gather images and append to img-gallery
function displayImg() {

  // clear div containing images
  $("#img-gallery").empty();

  var apiKey = "duheouvYAukp2dG98jzVI1Y2VnHKe-PnTeWRmeKt5ss";
  // API Query call
  var queryURL = "https://api.unsplash.com/search/photos?query=" + cityName + "&count=10&orientation=landscape&client_id=" + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      console.log("UNSPLASH QUERY URL - " + queryURL);

      // for-loop to create tags for images and append to carousel
      for (var i = 0; i < response.results.length; i++) {
        //create div tag that will contain img and append carousel-item classes
        var divImg = $("<div>").addClass("carousel-item");
        divImg.attr("id", "img-" + i);

        //create img tag that will contain city img and append d-block w-100 classes
        var cityImg = $("<img>").addClass("d-block w-100");
        $(cityImg).attr("src", `${response.results[i].urls.regular}`);
        $(cityImg).attr("alt", cityName);

        // append cityImg to divImg
        $(divImg).append(cityImg);
        // append divImg to img-gallery id
        $("#img-gallery").append(divImg);

        var firstImgTag = $("#img-0").addClass("active");
      }

      // calling function to store city name to local storage
      storeData();

    });
}

// using weather from currentWeather, search gifs, create tags and append to gif-gallery
function createGif() {

  var apiKey = "sybBXVqNNyH0EPjFu28Tl0KiGOaCADFu";

  for (var i = 0; i < 10; i++) {

    // query URLs for giphy search - testing out 2 different ones
    // var queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + weather + "&limit=10&api_key=" + apiKey;
    var queryUrl = "https://api.giphy.com/v1/gifs/random?tag=" + weather + "&limit=10&api_key=" + apiKey;

    // ajax for RANDOM queryURL
    $.ajax({
      url: queryUrl,
      method: "GET"
    })
      .then(function (response) {
        console.log("GIF QUERY URL - " + queryUrl);
        var gifURL = response.data.images.fixed_height_small_still.url;
        console.log("GIF URL - " + gifURL);
        var gifTitle = response.data.title;

        // create div tag to contain img tag
        var gifGallery = $("<div>").addClass("carousel-item");
        // create img tag to contain gif
        var weatherGif = $("<img>").addClass("d-block w-100");
        // weatherGif.attr("data-bs-interval", "5000");
        // add link to gif and alt
        $(weatherGif).attr("src", gifURL);
        $(weatherGif).attr("alt", cityName + "-" + gifTitle);
        // append gif to gallery
        $(gifGallery).append(weatherGif);
        // append gallery to page
        $("#gif-gallery").append(gifGallery);
      });

    // ajax for SEARCH queryURL
    // $.ajax({
    //     url: gifURLs[i],
    //     method: "GET"
    // })
    //     .then(function (response) {
    //         var gifURL = response.data[0].images.original.url;
    //         console.log(gifURL);
    //         var gifTitle = response.data[0].title;

    //         // create div tag to contain img tag
    //         var gifGallery = $("<div>").addClass("carousel-item");
    //         // create img tag to contain gif
    //         var weatherGif = $("<img>").addClass("d-block w-100");
    //         // add link to gif and alt
    //         $(weatherGif).attr("src", gifURL);
    //         $(weatherGif).attr("alt", cityName + "-" + gifTitle);
    //         // append gif to gallery
    //         $(gifGallery).append(weatherGif);
    //         // append gallery to page
    //         $("").append(gifGallery);
    //     });
  }
}


// function for local storage :)
function storeData() {
  // Push the input into local storage
  searchList.push(cityName);
  localStorage.setItem("list", JSON.stringify(searchList));
  const listGroup = $(".badge");

  //Limit number of stored items on the page to 5
  if (listGroup.length > 4) {
    $(listGroup.get(4)).remove();
  }

  $("#input-storage").prepend(`<button class="badge rounded-pill bg-light text-dark">${cityName}</button>`);
  searchList.reverse().slice(0, 5).forEach((citySearch) => {
    $("input-storage").append(`<button class="badge rounded-pill bg-light text-dark">${citySearch}</button>`);
  });
}





// user clicks Enter, function kicks off to get current weather and then city images
cityInput.on("keypress", currentWeatherAPI);
