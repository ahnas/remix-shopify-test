import React, { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import Header from "~/components/Header";

export default function AddBook() {
    const navigate = useNavigate();
    const [authors, setAuthors] = useState<any>([]);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState<any>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isbn, setIsbn] = useState("");
    const [format, setFormat] = useState("");
    const [numberOfPages, setNumberOfPages] = useState("");
    const [releaseDate, setReleaseDate] = useState('');
    const [data, setData] = useState<any>(null);


    const limit = 5;

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchAuthors(token);
        fetchBooks(token, currentPage);
    }, [navigate, currentPage]);

    const fetchAuthors = async (token: string) => {
        try {
            const response = await fetch("https://candidate-testing.api.royal-apps.io/api/v2/authors", {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch authors");

            const data = await response.json();
            setAuthors(data.items);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const fetchBooks = async (token: string, page: number) => {
        try {
            const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books?limit=${limit}&page=${page}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch books");

            const data = await response.json();
            setBooks(data.items);
            setFilteredBooks(data.items);
            setTotalBooks(data.total_results);
            setTotalPages(data.total_pages);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(books.filter((book: any) => book.title.toLowerCase().includes(query)));
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleDeleteBook = async (bookId: number) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setError("Unauthorized. Please log in.");
                return;
            }
            const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books/${bookId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to delete book");

            alert("Book deleted successfully");
            fetchBooks(token, currentPage);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const logActivity = (message: string) => {
        const logs = JSON.parse(localStorage.getItem("activity_logs") || "[]");
        console.log(message);
        logs.unshift(`${new Date().toLocaleString()}: ${message}`);
        localStorage.setItem("activity_logs", JSON.stringify(logs));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("auth_token");

        if (!token) {
            setError("Unauthorized. Please log in.");
            return;
        }

        const bookData = {
            author: { id: selectedAuthor },
            title,
            release_date: new Date(releaseDate).toISOString().split("T")[0],
            description,
            isbn,
            format,
            number_of_pages: Number(numberOfPages),
        };

        try {
            const url = data?.id
                ? `https://candidate-testing.api.royal-apps.io/api/v2/books/${data.id}`
                : "https://candidate-testing.api.royal-apps.io/api/v2/books";

            const method = data?.id ? "PUT" : "POST";
            console.log(method);

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookData),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${data?.id ? "update" : "create"} book`);
            }

            setTitle("");
            setReleaseDate("");
            setDescription("");
            setIsbn("");
            setFormat("");
            setNumberOfPages("");
            fetchBooks(token, currentPage);
            logActivity(`Book ${method === "PUT" ? "updated" : "added"}: ${title}`);
            alert(`Book ${data?.id ? "updated" : "added"} successfully!`);
        } catch (err: any) {
            setError(err.message);
        }
    };


    const handleEditBook = async (bookId: number) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setError("Unauthorized. Please log in.");
                return;
            }

            const response = await fetch(`https://candidate-testing.api.royal-apps.io/api/v2/books/${bookId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch book details");

            const data = await response.json();
            setData(data);
            setSelectedAuthor(data.author.id);
            setTitle(data.title);
            setReleaseDate(new Date(data.release_date).toISOString().split("T")[0]);
            setDescription(data.description);
            setIsbn(data.isbn);
            setFormat(data.format);
            setNumberOfPages(data.number_of_pages);
        } catch (error: any) {
            console.error("Error fetching book:", error.message);
        }
    };


    return (
        <div>
            <Header />
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-2 gap-4 p-6">
                {/* Book List */}
                <div className="bg-white shadow-md rounded p-4">
                    <h2 className="text-xl font-bold mb-4">Book List</h2>

                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search by book title..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full p-2 border rounded mb-4"
                        />
                     
                    </div>
                    <p className="mb-2">Total Books: {totalBooks}</p>

                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">No:</th>
                                <th className="border p-2">Title</th>
                                <th className="border p-2">Release Date</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="border p-2 text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map((book: any, index: number) => (
                                    <tr key={book.id} className="border text-center">
                                        <td className="border p-2">{(currentPage - 1) * limit + index + 1}</td>
                                        <td className="border p-2">{book.title}</td>
                                        <td className="border p-2">{new Date(book.release_date).toISOString().split("T")[0]}</td>
                                        <td className="border p-2 text-right">
                                            <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                                                onClick={() => handleEditBook(book.id)}
                                            >
                                                Edit
                                            </button>
                                            <button className="px-4 py-2 bg-red-500 text-white rounded"
                                                onClick={() => handleDeleteBook(book.id)}
                                            >
                                                Delete
                                            </button>

                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 bg-gray-300 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            <span> Pages: </span>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <span key={page}>
                                    <button
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-2 py-1 ${currentPage === page ? 'bg-blue-500 text-white' : ''}`}
                                    >
                                        {page}
                                    </button>
                                </span>
                            ))}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 bg-gray-300 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Add Book Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4">
                    <h2 className="text-xl font-bold mb-4">Add a New Book</h2>
                    <label>Author</label>
                    <select
                        value={selectedAuthor ?? ""}
                        onChange={(e) => setSelectedAuthor(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="" disabled>
                            Select an Author
                        </option>
                        {authors.map((author: any) => (
                            <option key={author.id} value={author.id}>
                                {author.first_name} {author.last_name}
                            </option>
                        ))}
                    </select>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <label>Release Date</label>
                    <input
                        type="date"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <label>ISBN</label>
                    <input
                        type="text"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <label>Format</label>
                    <input
                        type="text"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <label>Number of Pages</label>
                    <input
                        type="number"
                        value={numberOfPages}
                        onChange={(e) => setNumberOfPages(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded" >
                        {data?.id ? "Update Book" : " Add Book"}
                    </button>
                </form>
            </div>
        </div>
    );
}
