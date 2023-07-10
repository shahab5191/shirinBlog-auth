import express, { Application, Response, Request } from "express";
import morgan from "morgan";
import dotenv from "dotenv"
dotenv.config();

console.log(process.env.PORT)
const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));

app.get("/", async (req: Request, res: Response) => {
    console.log('initial code');
    res.status(200).send('initial code');
})
console.log('test')
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`)
})
