
//get books from inputted json file
async function loadBooks() {
    const response = await fetch(JSON_SRC);
    const books = await response.json();
    return books;
}

//sort books based on author, title, series, or date
function sortBooks(books) {
    switch (SORT_MODE) {
        case "author":
            return books.sort((a, b) => a.author.localeCompare(b.author));
        case "title":
            return books.sort((a, b) => a.title.localeCompare(b.title));
        case "series":
			return books.sort((a, b) => 
        		a.series.localeCompare(b.series) || 
        		Number(a.series_order) - Number(b.series_order)
			);
        case "date":
        default:
            return books; // already ordered by date in JSON
    }
}

//display books
function renderBooks(books) {
    const list = document.getElementById("book-list");
    list.innerHTML = "";

    books.forEach(book => {
        const item = document.createElement("div");
        item.classList.add("book-item");

        item.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Series:</strong> ${book.series}</p>
            <p><strong>Date:</strong> ${book.date_added ?? ""}</p>
        `;

        list.appendChild(item);
    });
}
