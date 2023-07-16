import express, { Application, Response, Request } from "express";
import morgan from "morgan";
import dotenv from "dotenv"
import { currentUserRouter } from "./routes/currentuser";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/errorHandler";
import sbError from "./errors/sbError";
import { NOT_FOUND_ERR } from "./errors/errorTypes";
import mongoose from 'mongoose'

dotenv.config();

console.log(process.env.PORT)
const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.all('*', () => {
    throw new sbError(NOT_FOUND_ERR, "Auth");
})

app.use(errorHandler)

const startService = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth').then(() => { console.log('connected to db') })
    }
    catch (err) {
        console.log(err);
    }

    app.listen(PORT, () => {
        console.log(`🖥️ is running on port ${PORT}!`)
    })

}

startService()