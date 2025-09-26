// src/middleware/cors.js
import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000", // التطوير
  "https://task-manager-react-theta.vercel.app/", // Vercel production
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

export default cors(corsOptions);
