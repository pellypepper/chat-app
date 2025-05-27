import express from 'express';
import {Register} from '../controller/registerController';
const router = express.Router();



router.post('/', Register)