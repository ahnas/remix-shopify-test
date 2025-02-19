import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export const useAuth = (id) => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`https://candidate-testing.api.royal-apps.io/api/v2/authors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthor(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch author details.");
        setLoading(false);
      });
  }, [id, navigate, setAuthor, author]);

  const updateProfile = async (authorId, updatedData) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `https://candidate-testing.api.royal-apps.io/api/v2/authors/${authorId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const updatedAuthor = await response.json();
      setAuthor(updatedAuthor);
      return updatedAuthor;
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  return { author, loading, error, updateProfile, setAuthor };
};
