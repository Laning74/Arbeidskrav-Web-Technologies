
# Arbeidskrav-Web-Technologies 

Mandatory Assignment for the subject Web technology Front-end development second year Gokstad Academy.



## This project
The task we were given was to create a purchase tracking system.
We were to build an API and the system should register and track grocery products that are scanned when the card is drawn in the store and stored in a database. The item that is purchased must then be retrieved from the database by searching for the card number, store, location or date the item was purchased.
## Program
 - Visual Studio Code

 - Node.js 

 - Postman

 - DB Browser for SQLite
## Installation

Install my-project with npm

```bash
  npm install express
  npm install sqlite3
  npm install body-parser
  npm install nodemon
```
Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js.

SQLite3 we need to install when we are creating SQLite database.

Body-parser is the Node.js body parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it.

Nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes.
    
## Run Locally

const port = process.env.PORT || 8080;

app.listen(port, () => console.log("Server has started on port", port));

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Database

const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(__dirname + "/database.sqlite");

const groceryTable = "grocerydata";

const CREATE_GROCERY_TABLE = `CREATE TABLE if not exists ${groceryTable} (ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, categories TEXT, price INT, cardNumber INT, store TEXT, location TEXT, date TEXT);`;

I used the program postman.com to "shop" grocery and swipe the card, which was then stored in my SQLite database. Also used Postman to retrieve data from the database.

To see what is in the database, I used the program DB Browser for SQLite3.
## API Reference

#### Post item

```http
  POST /item
```
    {   
    "name": "Milk",   
    "category": "Dairy",
    "price": 33
    }

Items will be stored in memory until a card number is posted.

#### Post card

```http
  POST /card
```

    {   
    "cardNumber": 1222,   
    "store": "Kiwi",
    "lcation": "Kragerø",
    "date": "09.11.22"
    }

All items in memory will be registered to the posted card (CardNumber) together with which store, location and date.

#### Get all items on cardNumber

```http
  GET /card/:card_number
```

Returns all items registered to the card number.

Return format: json

#### GET all items purchased on a specific date

```http
  GET /day/:date
```

Returns all items registered on the given date.

(This includes dates and card numbers)

Return format: json

#### GET all items purchased in a specific month and year

```http
  GET /month/:month_number/:year_number
```

Returns all items registered on the given month-year combination.

(This includes dates and card numbers)

Return format: json

#### GET data from the database for a type of store

```http
  GET /store/:store_name
```

Returns all data registered on the store name

Return format: json

#### GET data from the database for a location

```http
  GET /location/:location_name
```

Returns all data registered on the location name

Return format: json

#### DELETE all data registered on a cardNumber

```http
  DELETE /card/:card_number
```

Deletes all items and data registered to the given card.


## Authors

- Ingvild Langeland

