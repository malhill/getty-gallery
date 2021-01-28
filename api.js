
//Check whether or not someone has already clicked for the first time
let alreadyLoaded = false;

// ivan start
// create function that states pulls id of city button, calls API to gather images and append to carousel
function displayImg() {
  // pull ID of city to use in queryURL - need variable to contain ID - this is determine when city button is clicked
  var cityName = $(this).attr("id");
  //console.log(cityName);

  // ivan Stop

  // update queryURL; inserting city name via variable
  var queryURL = "https://api.unsplash.com/photos/random?query=" + cityName + "&count=10&client_id=pFIWUHqX-OP7nX7XPXSeK2lpEddTVseWjHAQ0ct9mQI";
  // 3. call ajax method to send a request
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // receive response; with this we can pull image link to display onto page
    .then(function (response) {
      // Log the queryURL
      //console.log(queryURL);
      // Log the resulting object
      //console.log(response);
      //Jess stop

      //Ivan start
      //for-loop to create tags for images and append to carousel

      //Assign the differnt locations for each loop.
      if (alreadyLoaded) {
        $("img").each(function (i) {
          $(this).attr("src", response[i].urls.regular);
          $(this).attr("alt", response[i].location.city);
        });//end of each function
      }

      else {

        for (var i = 0; i < 10; i++) {
          //create div tag that will contain img and append carousel-item classes
          var divImg = $("<div>").addClass("carousel-item");

          //create img tag that will contain city img and append d-block w-100 classes
          var cityImg = $("<img>").addClass("d-block w-100");
          // add src and alt attributes - THIS IS WHERE THE MAGIC NEEDS TO HAPPEN
          //console.log(response[i]);
          //console.log(response[i].urls.regular);
          //console.log(response[i].location.city);

          $(cityImg).attr("src", `${response[i].urls.regular}`);
          $(cityImg).attr("alt", `${response[i].location.city}`);
          // append cityImg to divImg
          $(divImg).append(cityImg);

          // append divImg to carousel-inner class
          $(".carousel-inner").append(divImg);

          alreadyLoaded = true;
        }
      }//end of else statement

    });
}

// playing with event listener when a city button is clicked to display pics for that city in carousel - calling displayImg function
$("button").on("click", displayImg);
// ivan stop

/*Added the functionality to load different images for each city
Commented out distracting console logs
Jessica
*/
