# Spotify Clone Backend API 🎵

A comprehensive Node.js and Express backend built to power a Spotify-like music discovery and playlist creation application. 

This project was built to demonstrate advanced backend concepts, including a dual-database architecture, hybrid API design (REST + GraphQL), session-based authentication, and multipart file uploads.



## ✨ Features

* **Dual-Database Architecture:** * **MySQL (Sequelize):** Handles highly relational data (Users, Playlists, and a bridge table linking playlists to songs).
  * **MongoDB (Mongoose):** Manages flexible, document-based data (Song catalog with dynamic attributes).
* **Cross-Database Synchronization:** Custom logic ensures data integrity (e.g., when a song is deleted from MongoDB, all references are automatically purged from MySQL user playlists).
* **Hybrid APIs:**
  * **REST API:** Handles standard CRUD operations, authentication, and file uploads.
  * **GraphQL:** Powers a highly efficient song search and discovery endpoint, preventing over-fetching.
* **Authentication & Authorization:** Session-based auth with encrypted cookies, bcrypt password hashing, and Role-Based Access Control (Admin vs. Standard User).
* **Automated Emails:** Integrates with Twilio SendGrid to dispatch welcome emails upon user registration.
* **File Processing:** Uses `multer` to intercept, filter, and save image files locally to the server for song album art.
* **Pagination:** Implemented on song fetching endpoints to handle large catalogs efficiently.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Databases:** MySQL2, MongoDB Atlas
* **ORMs/ODMs:** Sequelize, Mongoose
* **Authentication:** express-session, bcryptjs
* **API:** express-graphql, graphql
* **Utilities:** multer (file uploads), nodemailer (emails), cors, dotenv

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed and set up:
* [Node.js](https://nodejs.org/) (v14 or higher)
* A local or remote **MySQL Server** running.
* A **MongoDB Atlas** cluster (or local MongoDB instance).
* A **Twilio SendGrid** account with a verified sender email and API key.

## 🚀 Installation & Setup

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
\`\`\`

**2. Install dependencies**
\`\`\`bash
npm install
\`\`\`

**3. Set up Environment Variables**
Create a `.env` file in the root directory and add the following variables. Replace the placeholder values with your actual credentials:

\`\`\`env
PORT=8080
SQL_HOST=localhost
SQL_USER=root
SQL_PASSWORD=your_mysql_password
SQL_DATABASE=spotify_clone_db
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/spotify_clone?retryWrites=true&w=majority
SESSION_SECRET=your_super_secret_string
SENDGRID_API_KEY=SG.your_sendgrid_api_key
\`\`\`

**4. Create local directories**
Ensure you have the directory structure for local file uploads:
\`\`\`bash
mkdir -p public/images
\`\`\`

**5. Start the server**
\`\`\`bash
# For development with auto-restart
npm run dev

# For production
npm start
\`\`\`
*Note: Sequelize will automatically create the MySQL tables on the first run!*

## 🛣️ API Endpoints Overview

### Auth (REST)
* `POST /auth/signup` - Register a new user (sends welcome email).
* `POST /auth/login` - Authenticate and establish a session.
* `POST /auth/logout` - Destroy the current session.

### Playlists (REST - Requires Auth)
* `GET /playlists` - Fetch all playlists for the logged-in user.
* `POST /playlists/create` - Create a new playlist.
* `PUT /playlists/edit/:id` - Edit playlist details.
* `POST /playlists/add-song` - Add a song (MongoDB ID) to a playlist (MySQL).
* `DELETE /playlists/remove-song` - Remove a song from a playlist.
* `DELETE /playlists/delete/:id` - Delete a playlist.

### Songs (REST)
* `GET /songs?page=1` - Fetch all songs with pagination (Requires Auth).
* `POST /songs/create` - Upload an image and create a song (Requires Admin).
* `PUT /songs/edit/:id` - Edit song details/image (Requires Admin).
* `DELETE /songs/delete/:id` - Delete song, clean up image file, and remove MySQL references (Requires Admin).

### Discovery (GraphQL)
* `POST /graphql` - Accepts queries for `getSong(id)` and `searchSongs(searchTerm)`. Access via browser to use GraphiQL UI.