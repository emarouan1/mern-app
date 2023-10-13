import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routers/notes";
import userRoutes from "./routers/user";
import morgan from "morgan";
import createHttpError,{isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";


const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl : env.MONGO_CONNECTION_STRING
    }),
}));

//app.use = end points error handling
app.use("/api/users", userRoutes);
app.use("/api/notes",requiresAuth, notesRoutes); // middleware se declanche quand l'user est n'es pas connecter

app.use((req,res,next) => {
    next(createHttpError(404,"endPoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let erroMessage = "An unknow error occured !!";
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        erroMessage = error.message;
    }
    res.status(statusCode).json({ error: erroMessage });    
});

export default app;
