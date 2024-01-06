import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import cors from 'cors';
import expressSession from 'express-session';
import { User as CSUser } from './types/interfaces/User';
import UserModel from './models/UserModel';
import { authenticateUser } from './controllers/AuthController';
import config from './utils/config';
import { router } from './routes';

const app = express();
dotenv.config();

declare global {
  namespace Express {
    interface User extends CSUser {}
  }
}

// Setup Mongo and swap to dev if localized development  -------------
const db = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/letterstoisabel';
mongoose.connect(db, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
});

// Setup express middleware    ---------------------------------------
app.use(cors({ credentials: true, origin: config.clientURL }));
app.use(expressSession({
  secret: process.env.EXPRESS_SECRET || 'letters-to-isabel',
  resave: false,
  saveUninitialized: false,
}));

app.use(bodyParser.json({ limit: '3gb' }));
app.use(bodyParser.urlencoded({ limit: '3gb', extended: false }));

// Configure Passport
passport.use(new LocalStrategy(authenticateUser));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UserModel.findById(id, (err: any, user: CSUser) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// Kickoff API   -----------------------------------------------------
app.use(router);

app.listen(6001, () => {
  console.log('Find the server at: localhost:6001/api'); // eslint-disable-line no-console
});
