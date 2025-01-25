import express from 'express';
import {
	jobShowAll,
	jobShow,
	jobCreate,
	jobUpdate,
	jobDelete
} from '../controllers/jobs.js';

const router = express.Router();
router.route('/').get(jobShowAll).post(jobCreate);
router.get('/new', (req, res) => {
	// TODO: render form for new job
	res.status(204).send();
});
router.get('/edit/:id', jobShow);
router.post('/update/:id', jobUpdate);
router.post('/delete/:id', jobDelete);

export default router;
