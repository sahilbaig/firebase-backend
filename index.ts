import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();
import { db, rtdb } from "./firebase";
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/test", (req: Request, res: Response) => {
  return res.json({ message: "This works" });
});

app.get("/posts", async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("posts").get();
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.json({ posts });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    res.status(500).send("Error fetching documents");
  }
});

app.post("/posts", async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const docRef = await db.collection("posts").add({ title, content });
    res.status(201).json({ id: docRef.id, title, content });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).send("Error adding document");
  }
});

app.get("/realtime", async (req: Request, res: Response) => {
  try {
    // Fetch data from the "messages" node in RTDB
    const snapshot = await rtdb.ref("messages").once("value");
    const messages = snapshot.val();

    // Return the data
    return res.json({ messages });
  } catch (error) {
    console.error("Error fetching RTDB data: ", error);
    res.status(500).send("Error fetching RTDB data");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
