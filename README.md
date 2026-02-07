# LexSpecifica

LexSpecifica is a speculative legal framework generator for fiction writers. It uses AI to generate detailed legal systems, policies, and narrative conflicts based on your world concept, technology level, and government type.

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Google Gemini API Key**: You need an API key from [Google AI Studio](https://makersuite.google.com/app/apikey) to generate content.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/zekusmaximus/LexSpecifica.git
    cd LexSpecifica
    ```

2.  **Install dependencies:**
    This project uses a root `package.json` to manage scripts for both frontend and backend.
    ```bash
    # Install dependencies for root, backend, and frontend
    npm run install-all
    ```
    *Alternatively, you can install them individually:*
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```

## Configuration

1.  **Backend Environment Variables:**
    Create a `.env` file in the `backend/` directory:
    ```bash
    cd backend
    # Create .env file
    ```

    Add the following variables to `backend/.env`:
    ```env
    PORT=3001
    GOOGLE_API_KEY=your_google_api_key_here
    # Optional: Database storage path (defaults to backend/database.sqlite)
    # DB_STORAGE_PATH=./custom/path/to/database.sqlite
    ```

## Running the Application

### Development Mode
To run both the backend (API) and frontend (React app) concurrently:

```bash
# From the root directory
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Running Services Individually

- **Backend only:**
  ```bash
  npm run dev:backend
  ```
- **Frontend only:**
  ```bash
  npm run dev:frontend
  ```

## Project Structure

- **backend/**: Express.js API server.
  - `src/controllers/`: Request handlers.
  - `src/models/`: Sequelize database models (SQLite).
  - `src/services/`: Services including the Google Gemini AI integration.
  - `src/routes/`: API route definitions.
- **frontend/**: React application built with Vite.
  - `src/components/`: Reusable UI components.
  - `src/api/`: API client for backend communication.

## Testing

To run the backend integration tests:

```bash
cd backend
npm test
```
