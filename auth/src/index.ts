import express, { Application, Response, Request } from "express";
import morgan from "morgan";
import dotenv from "dotenv"
dotenv.config();

console.log(process.env.PORT)
const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/users/test", async (req: Request, res: Response) => {
    console.log('initial code');
    res.status(200).send('initial code');
})

app.listen(PORT, () => {
    console.log(`🖥️ is running on port ${PORT}!`)
})
