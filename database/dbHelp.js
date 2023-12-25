import query from "./database.js"; 

class dbFunctions {
    constructor(){}; 

    async getAllBooks() {
        const books = await query("SELECT book_id, b_name, book_cover, rating, read_date, author FROM book_name JOIN book_details ON book_name.id = book_details.book_id"); 

        if (books.rowCount === 0) return false; 
        return books.rows;
    };

    async getBookDetails(book_id) {
        const book = await query("SELECT book_name.id, b_name, book_cover, rating, read_date, author FROM book_name JOIN book_details ON book_name.id = book_details.book_id WHERE book_name.id = $1", [book_id]); 

        if (book.rowCount === 0) return false; 
        return book.rows[0];
    };

    async getBookNotes(book_id) {
        const notes = await query("SELECT book_note.id, note_id, note FROM book_note JOIN book_name ON book_name.id = book_note.note_id WHERE book_name.id = $1", [book_id]); 

        if (notes.rowCount === 0) return false; 
        return notes.rows; 
    };

    async insertBook(book_name, book_details) {
        try {
            const newBookId = (await query("INSERT INTO book_name(b_name) VALUES ($1) RETURNING id", [book_name])).rows[0].id;

            book_details.push(newBookId); 

            const bookDetails = await query("INSERT INTO book_details (book_cover, rating, read_date, author, book_id) VALUES ($1, $2, $3, $4, $5) RETURNING book_id, book_cover, rating, read_date, author", book_details);
            
            return bookDetails.rows[0]; 
            
        } catch (error) {
            console.error(error) 
            return false; 
        }
    };

    async insertNote(bookId, text) {
        const newNote = (await query("INSERT INTO book_note (note_id, note) VALUES ($1, $2) RETURNING id, note", [bookId, text])).rows[0];

        return newNote; 
    }

    async updateBookDetails(book_id, new_details) {
        // User can only modify previous rating or date 

        const {rating, read_date} = new_details;

        const updatedData = await query("UPDATE book_details SET rating = $1, read_date = $2 WHERE book_id = $3", [parseInt(rating), read_date, book_id]);

        return updatedData; 
    };

    async updateNote(noteId, text) {
        const newNote = (await query("UPDATE book_note SET note = $1 WHERE book_note.id = $2 RETURNING book_note.id, note", [text, noteId])).rows[0];
    
        return newNote; 
    };

    async deleteBook(book_id) {
        // First, delete all notes and book_details associated with that book. 
        await query("DELETE FROM book_note WHERE note_id = $1", [book_id]); 
        await query("DELETE FROM book_details WHERE book_id = $1", [book_id]); 
    
        // Delete book entry per si 
        await query("DELETE FROM book_name WHERE book_name.id = $1", [book_id]); 
    
        if ((await query("SELECT * FROM book_name WHERE book_name.id = $1", [book_id])).rowCount == 0) return true; 
        return false; 
    };

    async noteDelete(note_id) {
        try {
            await query("DELETE FROM book_note WHERE id = $1", [note_id]); return true; 
        } catch (error) {
            console.error(error); return false;    
        }
    };

    async sortingByCondition(condition) {
        try {
            const result = (await query("SELECT book_id, b_name, book_cover, rating, read_date, author FROM book_details JOIN book_name ON book_name.id = book_id ORDER BY " + condition + " DESC")).rows; 

            return result; 
        } catch (error) {
            console.error(error); return false;
        };  
    };
}



export default dbFunctions; 