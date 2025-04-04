# 💬 FriendSync
FriendSync is a real-time chat application that enables users to authenticate using GitHub, Facebook, and Google OAuth, manage their profile, and interact with their social connections securely. Users can send messages, and maintain an engaging conversation experience with friends.

## 🚀 Live Demo
Access the live app here: [FriendSync](https://friendsync-8snh.onrender.com)

## ✨ Features
- Real-Time Chat (One-on-One)
- OAuth Authentication using GitHub, Facebook, and Google
- User Profile Management
- Online Status & Presence Indicators
- Secure User Sessions with JWT
- Responsive UI for Mobile & Desktop

## 🛠 Tech Stack
- Frontend: React.js (Vite)
- Backend: Node.js (Express.js)
- Database: MongoDB (Atlas)
- Authentication: OAuth (GitHub, Facebook, Google)
- Hosting: Render

## ⚙️ Installation
### Prerequisites
**Ensure you have the following installed:**
- Node.js (v16+)
- MongoDB (if using locally)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/karanshah1561998/friendsync.git
   cd friendsync

2. **Install dependencies:**
   ```bash
   cd friendsync/frontend
   npm install

   cd friendsync/backend
   npm install

3. **Set up environment variables:**
   Create a `.env` file in the friendsync/backend directory and add:
   ```bash
   # Common
   PORT = 5000
   JWT_SECRET = your_jwt_secret
   MONGO_URI = your_mongodb_uri
   NODE_ENV = development
   SESSION_SECRET = your_session_secret

   # GitHub OAuth Credentials
   GITHUB_CLIENT_ID = your_github_client_id
   GITHUB_CLIENT_SECRET = your_github_client_secret

   # Facebook OAuth Credentials
   FACEBOOK_APP_ID = your_facebook_app_id
   FACEBOOK_APP_SECRET = your_facebook_app_secret

   # Google OAuth Credentials
   GOOGLE_CLIENT_ID = your_google_client_id
   GOOGLE_CLIENT_SECRET = your_google_client_secret
   
   # Backend & Frontend URLs
   DEV_SERVER_URL = http://localhost:5000
   DEV_CLIENT_URL = http://localhost:5173

   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME = name
   CLOUDINARY_API_KEY = key
   CLOUDINARY_API_SECRET = secret

4. **Navigate to the backend directory and start the backend server:**
   ```bash
   cd friendsync/backend
   npm run dev

5. **Navigate to the frontend directory and start the React app:**
   ```bash
   cd friendsync/frontend
   npm run dev

## OAuth Setup

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Create a new OAuth application.
3. Set the following:
- Homepage URL: `http://localhost:5173`
- Authorization Callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Client Secret to your `.env` file.

### Facebook OAuth
1. Go to [Facebook Developer Console](https://developers.facebook.com/).
2. Create an App and add Facebook Login.
3. Configure Valid OAuth Redirect URIs: `http://localhost:5000/api/auth/facebook/callback`
4. Set a valid Privacy Policy URL (e.g., `https://yourdomain.com/privacy-policy`).
5. Copy App ID and App Secret to your `.env` file.

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the OAuth consent screen.
3. Add Authorized Redirect URIs:  `http://localhost:5000/api/auth/google/callback`
4. Copy Client ID and Client Secret to your `.env` file.

## 🧩 Troubleshooting

### 1. Invalid Privacy Policy URL (Facebook)
- Ensure the Privacy Policy URL is publicly accessible.
- Use a valid URL like `https://yourdomain.com/privacy-policy`.

### 2. OAuth Redirect Mismatch
- Ensure OAuth callback URLs match the exact ones registered in GitHub, Facebook, and Google.
- Check if your app is in Live Mode for production.

### 3. App Verification Required (Facebook & Google)
- Make sure your app is in Live Mode.
- Submit the app review request if required.

### 4. Server Not Starting
- Double-check the MongoDB URI and OAuth credentials in `.env`.

### 5. Chat Messages Not Being Sent
- Ensure the Socket.io server is running.
- Check that DEV_SERVER_URL is set correctly.
