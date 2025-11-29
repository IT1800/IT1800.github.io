// Load JSON file
async function loadBooks() {
    try {
        const response = await fetch(JSON_SRC); // use global path
        const books = await response.json();
        return books;
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

// ---- SORTING FUNCTIONS ----

// Sort by author
function sortByAuthor(books) {
    return books.sort((a, b) => a.author.localeCompare(b.author));
}

// Sort by title
function sortByTitle(books) {
    return books.sort((a, b) => a.title.localeCompare(b.title));
}

// Sort by series (then numeric series order)
function sortBySeries(books) {
    return books.sort((a, b) => {
        const seriesCompare = a.series.localeCompare(b.series);
        if (seriesCompare !== 0) return seriesCompare;
        return Number(a.series_order) - Number(b.series_order);
    });
}

// Sort by date (mm/yyyy), placing null dates FIRST
function sortByDate(books) {
    return books.sort((a, b) => {
        if (!a.date_added && !b.date_added) return 0;
        if (!a.date_added) return -1; // null comes FIRST
        if (!b.date_added) return 1;

        const [aMonth, aYear] = a.date_added.split("/").map(Number);
        const [bMonth, bYear] = b.date_added.split("/").map(Number);

        const aTime = new Date(aYear, aMonth - 1);
        const bTime = new Date(bYear, bMonth - 1);

        return aTime - bTime;
    });
}

// ---- DISPLAY ----
function displayBooks(books) {
    const container = document.getElementById("book-container");
    container.innerHTML = "";

    books.forEach(book => {
        const div = document.createElement("div");
        div.className = "book-item";
        div.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Series:</strong> ${book.series} (#${book.series_order})</p>
            <p><strong>Date Added:</strong> ${book.date_added ?? "N/A"}</p>
            <hr>
        ';
        container.appendChild(div);
    });
}

// ---- INITIALIZATION ----
loadBooks().then(books => {

    let sorted;

    switch (SORT_MODE) {
        case "author":
            sorted = sortByAuthor(books);
            break;
        case "title":
            sorted = sortByTitle(books);
            break;
        case "series":
            sorted = sortBySeries(books);
            break;
        case "date":
            sorted = sortByDate(books);
            break;
        default:
            sorted = books;
    }

    displayBooks(sorted);
});



