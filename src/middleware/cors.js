// src/middleware/cors.js
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:3000", // مسموح للـ React
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
