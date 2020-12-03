/* global $ */
/* global fetch */
$(document).ready(function(){
    
    $(".favoriteIcon").on("click", function() {
        
        let queryString = window.location.search;
        let urlParams   = new URLSearchParams(queryString);
        let keyword     = urlParams.get("keyword");
        
        let imageUrl = $(this).attr("name");

        if ($(this).attr("src") == "img/favorite.png") {
            $(this).attr("src", "img/favorite_on.png");
            updateFavorite("add", imageUrl, keyword);
            console.log(imageUrl);
        }
        else {
            $(this).attr("src", "img/favorite.png");
            updateFavorite("delete",imageUrl);
        }
    });
    
    async function updateFavorite(action, imageUrl) {
        let url = `/api/updateFavorites?action=${action}&imageUrl=${imageUrl}`;
        await fetch(url);
    }
    
    async function updateDatabase(action, imageUrl, keyword, title, price, url, asin) {
        let myUrl = `/api/updateFavorites?action=${action}&imageUrl=${imageUrl}&keyword=${keyword}&title=${title}&price=${price}&url=${url}&asin=${asin}`;
        await fetch(myUrl);
    }
    
    $(".keywordLink").on("click", async function(){

        let keyword =  $(this).html().trim(); 
        $("#keywordSelected").val(keyword);
        let response = await  fetch(`/api/getFavorites?keyword=${keyword}`);
        let data = await response.json();
     
        $("#favorites").html("");
        let htmlString = "";
    
    
        data.forEach(function(row){
           htmlString += "&nbsp&nbsp<img class='favoriteIcon' src='img/favorite_on.png' width='30'>";
           htmlString += "<img class='image' src='"+row.imageURL+"'><br><br>";
        });
    
        $("#favorites").append(htmlString);
    
    });//keywordLink
    
    //Event for dynamic content generated when clicking on a keyword    
    $("#favorites").on("click", ".favoriteIcon", function(){
                
     let favorite = $(this).next().attr("src");
            
     if ($(this).attr("src") == 'img/favorite.png'){             
      $(this).attr("src","img/favorite_on.png");
      updateFavorite("add",favorite, $("#keywordSelected").val());
    } else {               
       $(this).attr("src","img/favorite.png");
       updateFavorite("delete",favorite);
       }
    });//.favoriteIcon event listener


});


