// Necessary packages
import express from "express";
import bodyParser from "body-parser";
import dbFunctions from "./database/dbHelp.js";
import bookInfo from "./controller/controller.js";
// Access to path for this project
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Useful variables 
const app = express(); 
const port = 3000; 
const bookModel = new dbFunctions();
let serverMessage = ''; 
let bookDetails = null; 
let notes =[];
let date = new Date(); 
const dateFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;

// Server config and middlewares
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public")); 
app.use(bodyParser.urlencoded({extended: true})); 

// Formatting Functions
function formatDate(date) {
    const exactMonth = new Date(date).getMonth() + 1

    return `${new Date(date).getFullYear()}-${exactMonth < 10 ? '0' + exactMonth : exactMonth}-${new Date(date).getDate() < 10 ? '0' + new Date(date).getDate() : new Date(date).getDate()}`
}

// Handling routes
app.get("/", async (req, res) => {
    let allBooks = []; 

    allBooks = await bookModel.getAllBooks();

    res.render("index", {books: allBooks});    
})

app.get("/add", (req, res) => {
    res.render("book-form", {bName: '', ratingM: '', dateHolder: dateFormat});
});

app.get("/post/:bid", async (req, res) => {
    const bookId = parseInt(req.params.bid); 

    const getBook = await bookModel.getBookDetails(bookId); 

    const sDate = formatDate(getBook.read_date);

    notes = await bookModel.getBookNotes(bookId); 

    if (notes) {
        res.render("book-view", {book: getBook, read_date: sDate, notes}); 
    } else {
        res.render("book-view", {book: getBook, read_date: sDate, notes: []}); 
    }
});

app.get("/add-note/:bid", async (req, res) => {
    const getBook = await bookModel.getBookDetails(parseInt(req.params.bid)); 

    res.render("note-form", {book: getBook, note: '', message: {upper: "Add your note: ", lower: "Add it!"}}); 
});

app.get("/edit/:nid/:bid", async (req, res) => {
    const getBook = await bookModel.getBookDetails(parseInt(req.params.bid)); 
    
    notes = await bookModel.getBookNotes(getBook.id); 

    const getNote = notes.find((note) => note.id == req.params.nid); 

    res.render("note-form", {book: getBook, note: getNote.note, message: {upper: "Update your note: ", lower: "Update it!"}});
});

app.get("/delete/:nid/:bid", async (req, res) => {
    const deleteRes = await bookModel.noteDelete(parseInt(req.params.nid)); 

    if (deleteRes) {
        res.redirect("/post/" + req.params.bid);
    } else {
        res.sendStatus(500); 
    };
});

app.get("/book-delete/:bid", async (req, res) => {
    const deleteId = parseInt(req.params.bid);

    await bookModel.deleteBook(deleteId); 

    res.redirect("/"); 
});

app.get("/edit-book/:bid", async (req, res) => {
    const bDetails = await bookModel.getBookDetails(parseInt(req.params.bid)); 

    res.render("book-form", {bName: bDetails.b_name, rating: bDetails.rating, dateHolder: formatDate(bDetails.read_date)});
});

app.get("/sorted", async (req, res) => {
    const sortCondition = Object.keys(req.query)[0]; 

    let sortedBooks = [];

    if (sortCondition === 'rating') {
        sortedBooks = await bookModel.sortingByCondition(sortCondition);
    } else if (sortCondition === 'name') {
        sortedBooks = await bookModel.sortingByCondition('b_name');
        sortedBooks = sortedBooks.reverse();
    } else {
        sortedBooks = await bookModel.sortingByCondition('read_date'); 
    };

    res.render("index", {books: sortedBooks}); 
});

app.post("/add", async (req, res) => {
    const newBook = {
        name: req.body.bname,
        read_date: req.body.read_date, 
        rating: parseInt(req.body.rating),
        note: req.body.fnote
    };

    bookDetails = new bookInfo(newBook.name); 

    if (!await bookDetails.getBookCover) {
        serverMessage = "Sorry, but book was not found. :("
        res.render("book-form", {dateHolder: formatDate(dateFormat), serverMessage});
    } else {
        await bookModel.insertBook(newBook.name, [(await bookDetails.getBookCover).book_cover_link, newBook.rating, newBook.read_date, (await bookDetails.getAuthor).book_author]);

        res.redirect("/");
    }
});

app.post("/add-note/:bid", async (req, res) => {
    const bookId = parseInt(req.params.bid); 
    const noteText = req.body.notearea;
    
    if (!noteText) {
        res.redirect("/add-note/" + bookId);
    } else {
        await bookModel.insertNote(bookId, noteText);

        res.redirect("/post/" + bookId); 
    }
});

app.post("/edit/:nid/:bid", async (req, res) => {
    const idNoteUpdate = parseInt(req.params.nid); 
    const noteText = req.body.notearea;

    if (!noteText) {
        res.redirect("/post/" + req.params.bid); 
    } else {
        await bookModel.updateNote(idNoteUpdate, noteText); 

        res.redirect("/post/" + req.params.bid); 
    };
});

app.post("/edit-book/:bid", async (req, res) => {
    
    await bookModel.updateBookDetails(parseInt(req.params.bid), req.body); 

    res.redirect("/post/" + req.params.bid); 
});

app.listen(port, () => {
    console.log("Server is listening on port: " + port); 
});
