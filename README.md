


https://github.com/user-attachments/assets/98c2b99d-4ebc-4735-aaa5-d7e7913cb98d


# Shopify Remix App - Dashboard

This is a **Remix** application for managing authors and their books in a Shopify-like ecosystem. The dashboard allows users to view, delete, and navigate to individual authors.

## Features

- **Authentication Handling:** Redirects users to login if no authentication token is found.
- **Fetch Authors List:** Retrieves and displays a list of authors from the API.
- **Fetch Books List:** Retrieves and displays a list of books from the API.
- **Pagination in Books List and Search:** Retrieves and Paginated a list of books from the API also added Search.
- **Fetch Book Count for Authors:** Fetches and displays the number of books associated with each author.
- **View Author Details:** Allows users to navigate to individual author details.
- **Delete Author:** Removes an author if they have no associated books.

## Technologies Used

- **Remix (React Framework)** - For server-side rendering and routing.
- **TypeScript** - For type safety and better code maintainability.
- **Tailwind CSS** - For styling the components.
- **Remix Hooks:** `useEffect`, `useState`, `useCallback`.
- **Fetch API** - For making API requests.

## Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/shopify-remix-app.git
   cd shopify-remix-app
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## API Endpoints

### Authentication
- **POST** `https://candidate-testing.api.royal-apps.io/api/v2/token` - Login user

### Fetch Authors
- **Endpoint:** `GET https://candidate-testing.api.royal-apps.io/api/v2/authors`
- **Headers:** `{ Authorization: 'Bearer <token>', Accept: 'application/json' }`


### Fetch Books
- **Endpoint:**  `GET https://candidate-testing.com/api/v2/books/`

### Delete and Edit Book
- **Endpoint:**  `DELETE https://candidate-testing.com/api/v2/books/{book_id}`
- **Endpoint:**  `EDIT https://candidate-testing.com/api/v2/books/{book_id}`

### Fetch Books for an Author
- **Endpoint:** `GET https://candidate-testing.api.royal-apps.io/api/v2/authors/{author_id}/`
- **Headers:** `{ Authorization: 'Bearer <token>', Accept: 'application/json' }`

### Delete an Author
- **Endpoint:** `DELETE https://candidate-testing.api.royal-apps.io/api/v2/authors/{author_id}`
- **Headers:** `{ Authorization: 'Bearer <token>', Accept: 'application/json' }`


---

Happy coding! 🚀

