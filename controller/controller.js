import axios from "axios"; 

class bookInfo {
    constructor(book_name){
        this.bname = book_name; 
    };

    get getBookCover() {
        return (async () => {
            const bookDetails = await this.getBookDetails(); 

            if (bookDetails) {
                return {book_cover_link: `https://covers.openlibrary.org/b/olid/${bookDetails.cover_edition_key}-M.jpg`};
            }
            return false
        })();
        
    };

    get getAuthor() {
        return (async () => {
            const bookDetails = await this.getBookDetails(); 
            
            if (bookDetails) {
                return {book_author: bookDetails.author_name['0']};
            }

            return false
        })();
        
    };

    async getBookDetails() {
        const response = (await axios.get("https://openlibrary.org/search.json?title=" + this.bname)).data; 

        if (response.docs) {
            return response.docs['0']; 
        } else {
            return false; 
        }
    };
};

export default bookInfo;