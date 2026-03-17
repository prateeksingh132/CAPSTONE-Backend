import express from 'express';
import { askAdvisor } from '../controller/techAdvisorController.js';

const router = express.Router();

// logic: creating the post route for the tech advisor 
// i am not using the protect middleware here bcuz i want any visitor to be able to talk to the tech advisor.
router.route('/ask').post(askAdvisor);

export default router;