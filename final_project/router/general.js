const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user: username and password are required." });
});

// Task 1 & Task 10: Get the book list available in the shop (using Promise callback)
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });

  get_books
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error retrieving books", error: err });
    });
});

// Task 2 & Task 11: Get book details based on ISBN (using Promise callback)
public_users.get('/isbn/:isbn', function (req, res) {
  const get_book = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  });

  get_book
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});
  
// Task 3 & Task 12: Get book details based on author (using Promise callback)
public_users.get('/author/:author', function (req, res) {
  const get_books_by_author = new Promise((resolve, reject) => {
    const author = req.params.author.toLowerCase();
    let matching_books = {};

    for (let key in books) {
      if (books[key].author.toLowerCase() === author) {
        matching_books[key] = books[key];
      }
    }

    if (Object.keys(matching_books).length > 0) {
      resolve(matching_books);
    } else {
      reject({ status: 404, message: `No books found by author: ${req.params.author}` });
    }
  });

  get_books_by_author
    .then((filteredBooks) => {
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 4 & Task 13: Get all books based on title (using Promise callback)
public_users.get('/title/:title', function (req, res) {
  const get_books_by_title = new Promise((resolve, reject) => {
    const title = req.params.title.toLowerCase();
    let matching_books = {};

    for (let key in books) {
      if (books[key].title.toLowerCase() === title) {
        matching_books[key] = books[key];
      }
    }

    if (Object.keys(matching_books).length > 0) {
      resolve(matching_books);
    } else {
      reject({ status: 404, message: `No books found with title: ${req.params.title}` });
    }
  });

  get_books_by_title
    .then((filteredBooks) => {
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
});

/* ==========================================================================
   Tasks 10 - 13: Async / Axios Client Implementations
   ========================================================================== */

// Task 10: Get all books using async/await with Axios
const getAllBooksAsync = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 11: Get book details based on ISBN using Promises with Axios
const getBookByISBNAsync = (isbn) => {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

// Task 12: Get book details based on Author using async/await with Axios
const getBooksByAuthorAsync = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 13: Get book details based on Title using async/await with Axios
const getBooksByTitleAsync = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
