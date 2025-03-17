import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/test", (req: Request, res: Response) => {
  return res.json({ message: "This works" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
