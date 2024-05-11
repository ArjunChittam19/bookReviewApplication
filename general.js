const Axios=require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(username&&password){
    const present = users.filter((user) => user.username === username);
    if (present.length === 0) {
      users.push({"username": req.body.username, "password": req.body.password });
      return res.status(201).json({ message: "User created successfully" });
    }
    else {
      return res.status(400).json({ message: "Already exists" });
    }
  }
  else if (!username && !password) {
    return res.status(400).json({ message: "Bad request" })
  }
  else if (!username || !password) {
    return res.status(400).json({ message: "Check username and password" });
  }
  
});

// Get the book list available in the shop
public_users.get('/',(req, res) =>{
  //Write your code here
  const getBooks=()=>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve(books);
    },1000);
    
    })
  }
  
  getBooks().then((books)=>{
    res.json(books);
  }).catch((err)=>{
    res.status(500).json({error:"An error occured"});
  });
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const ISBN = req.params.isbn;

  try {
    const book = await booksBasedOnIsbn(ISBN);
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: "Book not found" });
  }
});

function booksBasedOnIsbn(ISBN) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = Object.values(books).find(b => b.isbn === parseInt(ISBN));
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000);
  });
}

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const books = await booksBasedOnAuthor(author);
    res.json(books);
  } catch (err) {
    res.status(400).json({ error: "Book not found" });
  }
});

function booksBasedOnAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(b => b.author === author);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000);
  });
}

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const books = await booksBasedOnTitle(title);
    res.json(books);
  } catch (err) {
    res.status(400).json({ error: "Book not found" });
  }
});

function booksBasedOnTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(b => b.title === title);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000);
  });
}

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const book = await getBookByISBN(isbn);
    if (book.reviews && Object.keys(book.reviews).length > 0) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ message: "Reviews not found for this book" });
    }
  } catch (err) {
    res.status(400).json({ error: "Book not found" });
  }
});

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000);
  });
}

// public_users.get('/review/:isbn', async (req, res) => {
//   //Write your code here
//   const isbn = req.params.isbn;
//   await res.send(JSON.stringify(books[isbn].review), null, 4);
//   return res.status(300).json({ message: "Yet to be implemented" });
// });

module.exports.general = public_users;
