Stack-Plus

A full-stack chat application that enables users to communicate in real time. This project includes a React frontend, a Node.js backend, and a PostgreSQL database for data persistence.

Tech Stack

Frontend

React: Frontend framework.

CSS: For styling.

Axios: For making API calls.

Backend

Node.js: Server-side runtime.

Express.js: Web framework.

PostgreSQL: Database for storing user and message data.

Deployment

Frontend Deployment

Build the project:

npm run build

Upload the build/ folder to a hosting service like Netlify or Vercel.

Backend Deployment (Render)

Push the backend code to a GitHub repository.

Follow these steps on Render:

Create a new Web Service.

Connect your GitHub repository.

Set the start command (e.g., node index.js).

Add environment variables (e.g., DATABASE_URL, JWT_SECRET).

Deploy and note the public URL for your backend.

API Endpoints

Auth

POST /api/auth/register: Register a new user.

POST /api/auth/login: Log in an existing user.

Messages

GET /api/messages: Fetch all messages.

POST /api/messages: Send a new message.

License

This project is licensed under the MIT License.

Acknowledgements

Special thanks to the developers Brijae Williams, Kurt Thomas, Rafael Agredano, and Louis Pogorelc that made this project possible.

also a big thank you and credit to to "Danny" from freeCodeCamp for guidance and various examples of how to write code within this project.
