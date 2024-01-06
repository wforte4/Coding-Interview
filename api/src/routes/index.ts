import express from 'express';
import routes from './api';

export const router = express.Router();
// Pulls all routes from ./api folder and places them in /api route on BE
router.use('/api', routes);
