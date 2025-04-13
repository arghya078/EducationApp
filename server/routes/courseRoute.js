import express from 'express';
import { getAllCourses } from '../controllers/courseController.js';
import { getCourseId } from '../controllers/courseController.js';


const courseRouter = express.Router();

courseRouter.get('/all', getAllCourses);
courseRouter.get('/:id', getCourseId);

export default courseRouter;