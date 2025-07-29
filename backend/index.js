import express from 'express';
import dotenv  from 'dotenv';
import cookieParser  from 'cookie-parser';
import {DBConnection} from './database/db.js'
import {indexRouter} from './routes/indexRoute.js'
import { dashboardRouter } from './routes/dashboardRoute.js';
import cors from 'cors'

dotenv.config();
const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.use('/',indexRouter);
app.use('/dashboard',dashboardRouter);

app.listen(process.env.PORT,()=>{
    console.log(`server is listening to port ${process.env.PORT}`);
});