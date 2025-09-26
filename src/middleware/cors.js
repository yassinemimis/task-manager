// src/middleware/cors.js
import cors from "cors";

const corsOptions = {
  origin: "https://task-manager-react-97ebkg4gc-la-casas-projects.vercel.app", // مسموح للـ React
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
