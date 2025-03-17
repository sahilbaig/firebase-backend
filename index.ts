import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();
import { db, rtdb, auth } from "./firebase";
// Middleware
app.use(cors());
app.use(express.json());
import { DecodedIdToken } from "firebase-admin/auth";
interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}
export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
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
    const snapshot = await rtdb.ref("messages").once("value");
    const messages = snapshot.val();

    // Return the data
    return res.json({ messages });
  } catch (error) {
    console.error("Error fetching RTDB data: ", error);
    res.status(500).send("Error fetching RTDB data");
  }
});

app.post("/realtime", async (req: Request, res: Response) => {
  const { message } = req.body;
  const ref = rtdb.ref("messages").push();
  await ref.set({ message });
  res.status(201).json({ id: ref.key, message });
});

app.post("/realtime/5", async (req: Request, res: Response) => {
  try {
    for (let i = 1; i <= 5; i++) {
      setTimeout(async () => {
        const message = `Delay of ${i}`;
        const ref = rtdb.ref("messages").push();
        await ref.set({ message });
      }, i * 1000);
    }

    res
      .status(201)
      .json({ message: "Adding 5 messages with 1-second delay..." });
  } catch (error) {
    console.error("Error adding messages:", error);
    res.status(500).json({ error: "Failed to add messages" });
  }
});

app.get("/auth", authenticateUser, async (req: Request, res: Response) => {
  res.status(500).json({ message: "successul" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
