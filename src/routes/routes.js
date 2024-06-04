import { Router } from "express";
import {QuestionController} from "../controllers/question.controller.js";
import {OptionController} from "../controllers/option.controller.js";

const router = Router();
const questionController = new QuestionController();
const optionController = new OptionController

router.get('/api/questions/:questionId', (req, res) => questionController.getQuestionById(req, res));
router.post('/api/questions/create', questionController.createQuestion);
router.delete('/api/questions/:questionId', questionController.deleteQuestion);
// A question or option can't be deleted if it has vote

router.get('/api/options/:questionId', optionController.getOptionByQuesId);
router.post('/api/options/add/:questionId', optionController.addOption);
router.delete('/api/options/:optionId', optionController.deleteOption);
router.get('/api/options/:optionId/add-vote', optionController.addVotes);

export default router;
