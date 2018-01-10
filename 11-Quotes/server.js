var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Arseface04!",
  database: "quotes_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Express and MySQL code should go here.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM quotes;", function(err, data) {
    if (err) throw err;

    // Test it
    console.log('The response is: ', data);

    res.render("index", { quotes: data });
  });
});

app.get("/:id?", function(req, res) {
  connection.query(`SELECT * FROM quotes WHERE id="${req.params.id}"`, function(err, data) {
    if (err) throw err;

    console.log('Param is: ', req.params.id);
    console.log(data[0].id);
    
    res.render("single-quote", {"id": data[0].id, "author": data[0].author, "quote": data[0].quote} );
  });
});

app.listen(port, function() {
  console.log("Listening on PORT " + port);
});
