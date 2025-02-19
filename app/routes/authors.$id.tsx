import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@remix-run/react";
import Header from "~/components/Header";
import { MetaFunction } from "@remix-run/node";
import { useAuth } from "~/utils/auth";
export const meta: MetaFunction = () => {
    return [{ title: "Shopify Remix App - Details" }];
};

export default function AuthorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { author, loading, error, setAuthor } = useAuth(id) as any;
    const [title, setTitle] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [description, setDescription] = useState("");
    const [isbn, setIsbn] = useState("");
    const [format, setFormat] = useState("");
    const [numberOfPages, setNumberOfPages] = useState("");
    const [data, setData] = useState<any>(null);



    const logActivity = (message: string) => {
        const logs = JSON.parse(localStorage.getItem("activity_logs") || "[]");
        logs.unshift(`${new Date().toLocaleString()}: ${message}`);
        localStorage.setItem("activity_logs", JSON.stringify(logs));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("auth_token");

        if (!token) {
            console.log("Unauthorized. Please log in.");
            return;
        }

        const bookData = {
            author: { id: Number(id) },
            title,
            release_date: new Date(releaseDate).toISOString(),
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

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookData),
            });

            if (!response.ok) {
                throw new Error("Failed to create book");
            }

            setTitle("");
            setReleaseDate("");
            setDescription("");
            setIsbn("");
            setFormat("");
            setNumberOfPages("");
            await setAuthor(author);
            logActivity(`${method === "PUT" ? "Updated" : "Added"} book: ${title} by ${author.first_name} ${author.last_name}`);
            alert(`Book ${data?.id ? "updated" : "added"} successfully!`);
            setData(null);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const handleDeleteBook = async (bookId: number) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(
                `https://candidate-testing.api.royal-apps.io/api/v2/books/${bookId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to delete book ${bookId}`);
            }
            setAuthor(author);
            logActivity(`Deleted book by ${author.first_name} ${author.last_name}`);
            alert("Book deleted successfully");
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const handleEditBook = async (bookId: number) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                console.log("Unauthorized. Please log in.");
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

            const bookData = await response.json();
            setData(bookData);
            setTitle(bookData.title);
            setReleaseDate(new Date(bookData.release_date).toISOString().split("T")[0]);
            setDescription(bookData.description);
            setIsbn(bookData.isbn);
            setFormat(bookData.format);
            setNumberOfPages(bookData.number_of_pages);
        } catch (err: any) {
            console.log(err.message);
        }
    };


    return (
        <>
            <Header />
            <div className="container mx-auto p-6">
                <div className="mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6 border">
                        <h2 className="text-xl font-bold text-gray-700">Author Details <span onClick={() => navigate(`/profile/${author.id}`)} className="text-blue-500 underline hover:text-blue-700 cursor-pointer">Edit</span> </h2>
                        <p className="text-gray-600"><strong>Full Name:</strong> {author.first_name} {author.last_name}</p>
                        <p className="text-gray-600"><strong>Birthday:</strong> {new Date(author.birthday).toISOString().split("T")[0]}</p>
                        <p className="text-gray-600"><strong>Gender:</strong> {author.gender}</p>
                        <p className="text-gray-600"><strong>Place of Birth:</strong> {author.place_of_birth}</p>
                        <p className="text-gray-600"><strong>Biography:</strong> {author.biography}</p>
                        <h2 className="text-xl font-semibold text-gray-700 mt-10">Books</h2>
                        {author.books.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                {author.books.map((book: any) => (
                                    <li key={book.id} className="flex text-gray-700 justify-between">
                                        <p>{book.title}</p>
                                        <div>
                                            <button
                                                className="right text-blue-500 underline hover:text-blue-700 transition"
                                                onClick={() => handleEditBook(book.id)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeleteBook(book.id)}
                                                className="text-red-500 underline hover:text-red-700 transition ml-4">
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        ) : (
                            <p className="text-gray-500">No books found.</p>
                        )}
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 border h-fit">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New Book</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium">Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                            </div>

                            <div>
                                <label className="block font-medium">Release Date</label>
                                <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                            </div>

                            <div>
                                <label className="block font-medium">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border px-3 py-2 rounded"></textarea>
                            </div>

                            <div>
                                <label className="block font-medium">ISBN</label>
                                <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                            </div>

                            <div>
                                <label className="block font-medium">Format</label>
                                <input type="text" value={format} onChange={(e) => setFormat(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                            </div>

                            <div>
                                <label className="block font-medium">Number of Pages</label>
                                <input type="number" value={numberOfPages} onChange={(e) => setNumberOfPages(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                            </div>

                            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                {data?.id ? "Update Book" : " Add Book"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
