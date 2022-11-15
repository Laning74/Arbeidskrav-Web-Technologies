const sqlite3 = require("sqlite3");

// const morgan = require("morgan");

const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const app = express();
// const path = require("path");

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//connect to database
// const db = new sqlite3.Database(path.join(__dirname + "/database.sqlite"));
const db = new sqlite3.Database(__dirname + "/database.sqlite");

let shoppingCart = [];

const groceryCategories = {
  Dairy: "",
  Bakery: "",
  FrozenFoods: "",
  Meat: "",
  PersonalCare: "",
};

// GET
app.get("/", (req, res) => {
  res.send(groceryCategories);
});

// POST items to shoppingCart
app.post("/item", (req, res) => {
  let item = req.body;
  shoppingCart.push(item);
  res.status(201).send(shoppingCart);
});

// Create table - SQLite database

const groceryTable = "grocerydata";

const CREATE_GROCERY_TABLE = `CREATE TABLE if not exists ${groceryTable} (ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, categories TEXT, price INT, cardNumber INT, store TEXT, location TEXT, date TEXT);`;
const DROP_TABLE = `DROP TABLE if exists ${groceryTable}`;

app.get("/create", (req, res) => {
  db.run(CREATE_GROCERY_TABLE);
  res.send("Table created!");
});

app.get("/drop", (req, res) => {
  db.run(DROP_TABLE);
  res.send("Table dropped");
});

// POST cardNumber, store, location and date together with the food you bought with your card that day and send it to the database

app.post("/card", shoppingCart, (req, res) => {
  console.log(req.body);

  let cardNumber = req.body.cardNumber;
  let store = req.body.store;
  let location = req.body.location;
  let date = req.body.date;

  for (let i = 0; i < shoppingCart.length; i++) {
    let name = shoppingCart[i].name;
    let categories = shoppingCart[i].categories;
    let price = shoppingCart[i].price;
    console.log(name);

    db.serialize(() => {
      db.each(
        "INSERT INTO grocerydata (name, categories, price, cardNumber, store, location, date) VALUES ('" +
          name +
          "',  '" +
          categories +
          "',  '" +
          price +
          "',  '" +
          cardNumber +
          "', '" +
          store +
          "', '" +
          location +
          "', '" +
          date +
          "')"
      );
    });
  }
  res.send("Saved data to grocerytable");
});

// GET name (grozery items) from database when you insert the cardNumber you hawe used on the Store
app.get("/card/:card_number", (req, res) => {
  let card = [];

  db.serialize(() => {
    db.each(
      `SELECT * FROM ${groceryTable} WHERE cardNumber = ${req.params.card_number}`,
      (err, row) => {
        card.push(row.name);
        console.log();
      },
      () => {
        res.send(card);
      }
    );
  });
});

// GET day (dato) and return all grocery (items) purchased on this day
app.get("/day/:date", (req, res) => {
  if (req.body) {
    res.status(400);
    return res.send(
      "Nothing has been purchased in the selected month and year"
    );
  }

  let dataDate = [];

  db.serialize(() => {
    db.each(
      `SELECT * FROM ${groceryTable} WHERE date = ?`,
      [req.params.date],
      (err, row) => {
        if (err) {
          res.send("error");
        }
        dataDate.push(row.cardNumber);
        dataDate.push(row.name);
        console.log(dataDate);
      },
      () => {
        res.send(dataDate);
      }
    );
  });
});

// GET month/year and return all grocery (items) purchased on this month/year
app.get("/month/:month_number/:year_number", (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Nothing has been purchased in the selected month and year",
    });
  }

  //   if (!req.params.month_number || !req.params.year_number) {
  //     res
  //       .status(404)
  //       .send("Nothing has been purchased in the selected month and year");
  //     return;
  //   }

  let dataMonthYear = [];

  db.serialize(() => {
    db.each(
      `SELECT * FROM ${groceryTable} WHERE date LIKE '%${req.params.month_number}.${req.params.year_number}'`,

      (err, row) => {
        if (err) {
          res.send("error");
        }

        dataMonthYear.push(row.cardNumber);
        dataMonthYear.push(row.name);
        console.log(dataMonthYear);
      },
      () => {
        res.send(dataMonthYear);
      }
    );
  });
});

// DELETE all purchases made on a specific card when you enter the cardNumber

app.delete("/card/:card_number", (req, res) => {
  console.log(req.body);

  db.serialize(() => {
    db.run(
      `DELETE FROM ${groceryTable} WHERE cardNumber = ?`,
      [req.params.card_number],
      () => {
        res.send("Deleted from database");
      }
    );
  });
});

// GET data from the database for each type of store
app.get("/store/:store_name", (req, res) => {
  let dataStore = [];

  db.serialize(() => {
    db.each(
      `SELECT * FROM ${groceryTable} WHERE store = ?`,
      [req.params.store_name],
      (err, row) => {
        if (err) {
          res.send("error");
        }
        dataStore.push(`name: ${row.name}`);
        dataStore.push(`categories: ${row.categories}`);
        dataStore.push(`price: ${row.price}`);
        dataStore.push(`cardNumber: ${row.cardNumber}`);
        dataStore.push(`store: ${row.store}`);
        dataStore.push(`location: ${row.location}`);
        dataStore.push(`date: ${row.date}`);
        console.log(dataStore);
      },
      () => {
        res.send(dataStore);
      }
    );
  });
});

app.listen(port, () => console.log("Server has started on port", port));
