"use strict";

let $searchForm = $('#search-form');
let $bookList = $('#book-list');
let $currentBook = $('#current-book');
let $bookDescription = $('.book-description');
let arrBooks = [];

$searchForm.on("submit", function (event) {
  event.preventDefault();
  let query = $(this).find('[name="srch-term"]').val().replace(/\s/g, "+");

  getBooks(query);
});

function getBooks(query) {
  let server = 'https://www.googleapis.com/books/v1/volumes';

  $.ajax({
    url: server,
    method: "GET",
    data: `q=${query}`
  }).done(function (response) {
    arrBooks = response.items;
    $bookList.empty();

    arrBooks.forEach(function (book) {
      $('<a href="">').addClass('list-group-item')
        .text(book.volumeInfo.title)
        .attr('data-id', book.id)
        .appendTo($bookList);
    })

  }).fail(function (error) {
    console.log(error);
  });
}

$bookList.on('click', '[data-id]', function (event) {
  event.preventDefault();
  let bookId = $(this).data('id')

  let book = arrBooks.find(function(item) {
    return item.id === bookId;
  });

  $currentBook.fadeIn();

  console.log(book.volumeInfo);

  $currentBook.find('.book-title')
    .text(`${book.volumeInfo.title} 
    | ${book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "No author"} 
    ${book.volumeInfo.publishedDate}`);

  $bookDescription.empty();

  // Add new info

  $('<img>').attr('src', book.volumeInfo.imageLinks.thumbnail)
    .appendTo($bookDescription);

  $('<p>').text(book.volumeInfo.description)
    .appendTo($bookDescription);

  $('<a>').attr('href', book.volumeInfo.previewLink)
    .attr('target','_blank')
    .text('Read more...')
    .addClass('read-link')
    .appendTo($bookDescription)
});