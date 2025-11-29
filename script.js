// Load JSON file
async function loadBooks() {
    try {
        const response = await fetch(JSON_SRC);
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

// Sort by series (handles nulls safely)
function sortBySeries(books) {
    return books.sort((a, b) => {
        const seriesA = a.series ?? "";
        const seriesB = b.series ?? "";

        const seriesCompare = seriesA.localeCompare(seriesB);
        if (seriesCompare !== 0) return seriesCompare;

        return Number(a.series_order) - Number(b.series_order);
    });
}

// Sort by date (mm/yyyy), placing null FIRST
function sortByDate(books) {
    return books.sort((a, b) => {
        if (!a.date_added && !b.date_added) return 0;
        if (!a.date_added) return -1;
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

        // Build only the lines that exist
        let html = `<h3>${book.title}</h3>`;
        html += `<p><strong>Author:</strong> ${book.author}</p>`;

        // Only show series line if NOT null or empty
        if (book.series && String(book.series).trim() !== "") {
            html += `<p><strong>Series:</strong> ${book.series}`;
            if (book.series_order) {
                html += ` (#${book.series_order})`;
            }
            html += `</p>`;
        }

        // Only show date if not null/empty
        if (book.date_added && String(book.date_added).trim() !== "") {
            html += `<p><strong>Date Added:</strong> ${book.date_added}</p>`;
        }

        html += `<hr>`;

        div.innerHTML = html;
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
