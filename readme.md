# EduPilot360 Backend (Firebase Functions + MongoDB)

This backend is part of **EduPilot360**, a modern academic management platform for Colombian schools. It is built on **Firebase Cloud Functions v2** (Node.js/Express), uses **MongoDB Atlas** for data storage, and relies on **Firebase Authentication** for secure user management.

---

## 🏗️ Architecture Overview

- **Backend:** Node.js + Express, deployed as a single HTTP function (v2).
- **Database:** MongoDB Atlas (via Mongoose).
- **Authentication:** Firebase Authentication (email/password).
- **Environment Variables:** Managed with `.env.<projectId>` files per environment.
- **Logging:** Uses `firebase-functions/logger` for structured logs.
- **Security:** Middleware validates Firebase Auth JWTs on protected endpoints.

---

## 🚀 Deployment & Environments

### File Structure

functions/
.env.edupilot360-stage # QA environment variables
.env.attendify-app-kirpalamar # Production environment variables
db.js
app.js
index.js
...

text

### Environment Variables

Create a `.env.<projectId>` file for each environment inside the `functions/` directory.

**Example for QA (`.env.edupilot360-stage`):**
MONGO_URI=mongodb+srv://user:password@cluster0.mongodb.net
DB_NAME=edupilot360-qa

text

**Example for Production (`.env.attendify-app-kirpalamar`):**
MONGO_URI=mongodb+srv://user:password@prod-cluster.mongodb.net
DB_NAME=edupilot360-prod

text

- **Do NOT use reserved variable names** (`FIREBASE_`, `GOOGLE_`, `X_GOOGLE_`).
- **Do NOT commit these files to version control** (add to `.gitignore`).

### Deployment Commands

Deploy to QA
firebase use qa
firebase deploy --only functions

Deploy to Production
firebase use default
firebase deploy --only functions

text
The Firebase CLI will automatically load the correct `.env.<projectId>` file based on the selected project.

---

## 🔐 Authentication & Security

- **All protected endpoints require:**
Authorization: Bearer <ID_TOKEN>

text
Where `<ID_TOKEN>` is a valid JWT issued by Firebase Auth from the same project as the deployed Functions.

- **The backend validates the token using Firebase Admin SDK before processing any request.**

### How to Obtain an ID Token

- From your UI (frontend) after logging in with Firebase Auth:
const token = await user.getIdToken();

text
- Or from the browser console (if already authenticated):
firebase.auth().currentUser.getIdToken().then(console.log)

text
- Use this token in API tools (Insomnia, Postman) as the `Authorization` header.

---

## 🧑‍💻 Useful Scripts in `functions/package.json`

"scripts": {
"serve": "firebase emulators:start --only functions",
"deploy:qa": "firebase use qa && firebase deploy --only functions",
"deploy:prod": "firebase use default && firebase deploy --only functions"
}

text

---

## 📋 Best Practices

- Never commit `.env*` files to your repository.
- Do not use dependencies like `dotenv` or `dotenvx` in the backend—Firebase Functions v2 loads env files natively.
- Only allow public invocation of your function if you have proper authentication middleware in place.
- Use `firebase-functions/logger` for all backend logs.
- Always protect endpoints with token validation middleware.

---

## 📚 References

- [Firebase Functions: Environment Configuration](https://firebase.google.com/docs/functions/config-env)
- [Firebase Auth: Verify ID Tokens in Backend](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Firebase Functions: Best Practices](https://firebase.google.com/docs/functions/best-practices)

---

**Questions or suggestions?**  
Contact the EduPilot360 development team.