const express = require("express")
const app = express();
const pool = require("./dbPool.js");
const fetch = require("node-fetch");

app.set("view engine", "ejs");
app.use(express.static("public"));

let productArray = [];

//routes
app.get("/", async function(req, res) {
  
    res.render("index");
});

app.get("/search", async function(req, res) {
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }
    
    keywordEncoded = encodeURIComponent(keyword.trim());
    
    let apiUrl = "https://amazon-product-reviews-keywords.p.rapidapi.com/product/search?keyword=outdoor%20" + keywordEncoded + "&category=aps&country=US";
    
    let response = await fetch(apiUrl, {
  	  "method": "GET",
  	  "headers": {
  		"x-rapidapi-key": "c68ddd2c93msh87ac62bb6bd8ccbp14aa77jsn572dc527509e",
  		"x-rapidapi-host": "amazon-product-reviews-keywords.p.rapidapi.com"
    }
    });
   	let data = await response.json();
    
    
    for (let i=0; i < 5;i++) {
      
    } //imageUrl, title, price, url, asin, description

    let maxProducts = 5;
    let numProducts = maxProducts;
    let sql;
    let sqlParams;
    
    if (data.products.length < maxProducts) {
      numProducts = data.products.length;
    }
    
    productArray = null;
    productArray = [numProducts];
    
    console.log("looplength: " + numProducts);
    
    for (let i= 0; i < numProducts; i++) {
      try {
        productArray[i] = [6]; //one extra slot for description
        productArray[i][0] = data.products[i].thumbnail;
        productArray[i][1] = data.products[i].title;
        productArray[i][2] = data.products[i].price.current_price;
        productArray[i][3] = data.products[i].url;
        productArray[i][4] = data.products[i].asin;
        sql = "INSERT INTO products (imageUrl, keyword, title, price, url, asin) VALUES (?,?,?,?,?,?)";
        sqlParams = [productArray[i][0], keyword, productArray[i][1], productArray[i][2], productArray[i][3], productArray[i][4]];
        pool.query(sql, sqlParams, function (err, rows, fields) {
          if (err) throw err;
          console.log(rows);
          res.send(rows.affectedRows.toString());
        });
      }
      catch(err) {
        console.error(err);
      }
    }
    
    if (numProducts == 0)
    {
      productArray = null;
    }
    
    res.render("results", {"productArray":productArray});
});

//this whole function needs to be redirected to a different database for user data
app.get("/api/updateFavorite", function(req, res){ 
  let sql;
  let sqlParams;
  switch (req.query.action) {
    case "favorite": sql = "INSERT INTO products (imageUrl, keyword, title, price, url, asin) VALUES (?,?,?,?,?,?)";
                sqlParams = [req.query.imageUrl];
                break;
    case "unfavorite": sql = "DELETE FROM products WHERE imageUrl = ?";
                sqlParams = [req.query.imageUrl];
                break;
  }//switch
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
  });
    
});//api/updateFavorites

app.get("/api/updateDatabase", function(req, res){
  let sql;
  let sqlParams;
  switch (req.query.action) {
    case "add": sql = "INSERT INTO products (imageUrl, keyword, title, price, url, asin) VALUES (?,?,?,?,?,?)";
                sqlParams = [req.query.imageUrl, req.query.keyword, req.query.title, req.query.price, req.query.url, req.query.asin];
                break;
    case "delete": sql = "DELETE FROM products WHERE imageUrl = ?";
                sqlParams = [req.query.imageUrl];
                break;
  }//switch
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
  });
    
});//api/updateDatabase

app.get("/getKeywords",  function(req, res) {
  let sql = "SELECT DISTINCT keyword FROM products ORDER BY keyword";
  let imageUrl = ["img/favorite.png"];
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("favorites", {"imageUrl": imageUrl, "rows":rows});
  });  
});//getKeywords

app.get("/api/getFavorites", function(req, res){
  let sql = "SELECT imageURL FROM products WHERE keyword = ?";
  let sqlParams = [req.query.keyword];  
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });
    
});//api/getFavorites


//starting server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Express server is running...")
});