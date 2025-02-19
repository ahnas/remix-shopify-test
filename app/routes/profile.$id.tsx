import { useState, useEffect } from "react";
import { useParams } from "@remix-run/react";
import Header from "~/components/Header";
import { useAuth } from "~/utils/auth";

const Profile = () => {
    const { id } = useParams();
    const { author, updateProfile, setAuthor } = useAuth(id) as any;

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        birthday: "",
        biography: "",
        gender: "",
        place_of_birth: "",
    });

    useEffect(() => {
        if (author) {
            setFormData({
                first_name: author.first_name || "",
                last_name: author.last_name || "",
                birthday: author.birthday?.split("T")[0] || "",
                biography: author.biography || "",
                gender: author.gender || "",
                place_of_birth: author.place_of_birth || "",
            });
        }
    }, [author]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(id, formData);
            alert("Profile updated successfully!");
            setAuthor(author);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div>
            <Header />
            <div className="container py-6 flex justify-evenly">
                {/* Profile Section */}
                <div className="w-1/2">
                    <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded">
                        <label className="block mb-2">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            required
                        />

                        <label className="block mb-2">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                            required
                        />

                        <label className="block mb-2">Birthday</label>
                        <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            disabled
                            className="w-full p-2 border rounded mb-4 bg-gray-200"
                        />

                        <label className="block mb-2">Biography</label>
                        <textarea
                            name="biography"
                            value={formData.biography}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <label className="block mb-2">Place of Birth</label>
                        <input
                            type="text"
                            name="place_of_birth"
                            value={formData.place_of_birth}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <label className="block mb-2">Gender</label>
                        <input
                            type="text"
                            name="gender"
                            value={formData.gender}
                            disabled
                            className="w-full p-2 border rounded mb-4 bg-gray-200"
                        />

                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Update Profile
                        </button>
                    </form>
                </div>
                <div>
                    {/* Books Section */}
                    <h2 className="text-2xl font-bold mt-6">Books</h2>
                    <div className="mt-4">

                        {author?.books?.length > 0 ? (
                            console.log(author),
                            author.books.map((book: any) => (
                                <div key={book.id} className="border p-4 rounded mb-4">
                                    <h3 className="text-lg font-semibold">{book.title}</h3>
                                    <p><strong>Release Date:</strong> {book.release_date.split("T")[0]}</p>
                                    <p><strong>Pages:</strong> {book.number_of_pages}</p>
                                    <p><strong>Description:</strong> {book.description}</p>
                                    <p><strong>ISBN:</strong> {book.isbn}</p>
                                    <p><strong>Format:</strong> {book.format}</p>
                                </div>
                            ))
                        ) : (
                            <p>No books available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
