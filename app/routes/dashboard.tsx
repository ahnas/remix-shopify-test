import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import Header from "~/components/Header";

export const meta: MetaFunction = () => [{ title: "Shopify Remix App - Dashboard" }];

interface Author {
  id: number;
  first_name: string;
  last_name: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [bookCounts, setBookCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }
    setMessage("Welcome to Shopify Remix App!");
    fetchAuthors(token);
  }, [navigate]);

  const fetchAuthors = useCallback(async (token: string) => {
    try {
      const response = await fetch("https://candidate-testing.api.royal-apps.io/api/v2/authors", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch authors");

      const data = await response.json();
      setAuthors(data.items);

      // Fetch book counts for each author
      const bookCountPromises = data.items.map((author: Author) =>
        fetchAuthorBooks(token, author.id)
      );
      await Promise.all(bookCountPromises);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuthorBooks = async (token: string, authorId: number) => {
    try {
      const response = await fetch(
        `https://candidate-testing.api.royal-apps.io/api/v2/authors/${authorId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to fetch books for author ${authorId}`);

      const data = await response.json();
      setBookCounts((prevCounts) => ({
        ...prevCounts,
        [authorId]: data.books.length || 0,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleViewAuthor = (id: number) => {
    navigate(`/authors/${id}`);
  };

  const handleDeleteAuthor = async (id: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch(
        `https://candidate-testing.api.royal-apps.io/api/v2/authors/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to delete author ${id}`);

      setAuthors((prevAuthors) => prevAuthors.filter((author) => author.id !== id));
      alert("Author deleted successfully");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        {loading ? (
          <p>Loading authors...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="mt-10 text-lg font-semibold mb-4">Authors List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border text-left">Name</th>
                    <th className="px-4 py-2 border">Book Count</th>
                    <th className="px-4 py-2 border text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author) => (
                    <tr key={author.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">
                        {author.first_name} {author.last_name}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {bookCounts[author.id] !== undefined ? bookCounts[author.id] : "Loading..."}
                      </td>
                      <td className="flex justify-end px-4 py-2 border">
                        {bookCounts[author.id] === 0 && (
                          <button
                            className="px-3 py-1 mr-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleDeleteAuthor(author.id)}
                          >
                            Delete Author
                          </button>
                        )}
                        <button
                          onClick={() => handleViewAuthor(author.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
