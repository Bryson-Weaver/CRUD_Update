const express = require('express');
const app = express();
 
const bookRoute = express.Router();
let Book = require('../model/Book');
 
// Get all Books
bookRoute.route('/').get((req, res) => {
    Book.find().then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(`Could not get books: ${error}`);
  })
})

// Add a book
bookRoute.route('/add-book').post((req, res) => {
    Book.create(req.body).then(() => {
    console.log('Book added successfully.');
    res.status(200);
  })
  .catch((error) => {
    console.error(`Could not save book: ${error}`);
    res.status(400).send(`Could not save book: ${error}`);
  })
})

// delete a book
bookRoute.route('/delete-book/:id').delete((req, res) => {
  console.log(`Deleting book with id: ${req.params.id}`);
  Book.findByIdAndDelete(req.params.id).then(() => {
    console.log('Book deleted successfully.');
    res.status(200);
  })
  .catch((error) => {
    console.error(`Could not delete book: ${error}`);
  })
})

// Get a book by id
bookRoute.route('/:id').get((req, res) => {
  Book.findById(req.params.id).then((book) => {
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.status(200).json(book);
  }).catch((error) => {
    console.error(`Could not get book: ${error}`);
    res.status(400).send(`Could not get book: ${error}`);
  })
})

// Update a book
bookRoute.route('/update-book/:id').put((req, res) => {
  Book.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
  .then((updatedBook) => {
    if (!updatedBook) {
      return res.status(404).send('Book not found');
    }
    console.log('Book updated successfully.');
    res.status(200).json(updatedBook);
  })
  .catch((error) => {
    console.error(`Could not update book: ${error}`);
    res.status(400).send(`Could not update book: ${error}`);
  })
})

module.exports = bookRoute;