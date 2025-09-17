# PDF Annotator - Full Stack (React + Node (Express) + MongoDB)

## Overview

A full-stack PDF annotator allowing users to register/login, upload PDFs (stored on server), highlight text (persists in MongoDB), and reload PDFs with stored highlights.

## Features

- Email/password auth (JWT)
- Upload PDF files to server
- In-browser viewing with pagination & zoom (react-pdf)
- Text selection & highlight across pages
- Highlights saved with PDF UUID, page number, highlighted text, relative bounding boxes
- My Library dashboard per user

## Local Setup

### Backend

1. `cd backend`
2. `cp .env.example .env` and edit values
3. `npm install`
4. `npm run dev`

- Backend runs on `http://localhost:4000`

### Frontend

1. `cd frontend`
2. `npm install`
3. Create `.env` with `VITE_API_BASE=http://localhost:4000`
4. `npm run dev`

- Frontend runs on `http://localhost:5173`

## Sample .env

Backend `.env`:

PORT=4000
MONGO_URI=mongodb://localhost:27017/pdf-annotator
JWT_SECRET=your_secret_here
UPLOAD_DIR=uploads

## cURL examples

Register:

```bash
curl -X POST http://localhost:4000/api/auth/register
-H "Content-Type: application/json" -d '{"email":"test@example.com
","password":"pass123"}'
```

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login
 -H "Content-Type: application/json" -d '{"email":"test@example.com
","password":"pass123"}'
```

Upload PDF (replace TOKEN and file path):

```bash
curl -X POST http://localhost:4000/api/pdfs/upload
 -H "Authorization: Bearer TOKEN" -F "file=@/path/to/file.pdf"
```

List PDFs:

```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/pdfs
```

Save highlight:

```bash
curl -X POST http://localhost:4000/api/pdfs/<UUID>/highlights -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"pageNumber":1,"text":"hello","rects":[{"xPct":10,"yPct":20,"wPct":30,"hPct":3}]}'
```

## License

[MIT License](LICENSE)
