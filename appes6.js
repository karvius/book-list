'use strict';
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  // Add book to list
  addBookToList(book) {
    const list = document.querySelector('#book-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X<a/></td>
  `;
    list.appendChild(row);
  }

  // Show alert
  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent element
    const container = document.querySelector('.container');
    // Get form
    const form = document.querySelector('#book-form');
    // Insert alert
    container.insertBefore(div, form);
    // Timeout after 3 seconds
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  // Delete a book
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  // Clear form fields
  clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Local storage class
class Store {
  // Get books from local storage
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  // Display books from local storage
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => {
      const ui = new UI();
      // Add book to UI
      ui.addBookToList(book);
    });
  }
  // Add book to local storage
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  // Remove book from local storage
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// Event listener for add book
document.querySelector('#book-form').addEventListener('submit', function(e) {
  // Get form values
  const title = document.querySelector('#title').value,
    author = document.querySelector('#author').value,
    isbn = document.querySelector('#isbn').value;
  // Instantiate book
  const book = new Book(title, author, isbn);
  // Instantiate UI
  const ui = new UI();
  // Validate
  if (title === '' || author === '' || isbn === '') {
    // Error aler
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);
    // Add to LS
    Store.addBook(book);
    // Show success
    ui.showAlert('Book Added!', 'success');
    // Clear fields
    ui.clearFields();
  }
  e.preventDefault();
});

// Event listener for delete book
document.querySelector('#book-list').addEventListener('click', function(e) {
  // Instantiate UI
  const ui = new UI();
  // Delete book
  ui.deleteBook(e.target);
  // Remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // Show message
  ui.showAlert('Book Removed!', 'success');
  e.preventDefault();
});
