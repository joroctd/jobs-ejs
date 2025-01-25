import Job from '../models/Job.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';

export const jobShowAll = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user?.userId }).sort(
		'createdAt'
	);
	res.json({ jobs, count: jobs.length });
};

export const jobShow = async (req, res) => {
	const job = await Job.findOne({
		createdBy: req.user?.userId,
		_id: req.params.id
	});

	if (!job) throw new NotFoundError('Job not found.');

	res.json({ job });
};

export const jobCreate = async (req, res) => {
	const newJob = { ...req.body };
	newJob.createdBy = req.user.userId;
	const job = await Job.create(newJob);
	res.status(201).json({ job });
};

export const jobUpdate = async (req, res) => {
	const { company, position, status } = req.body;
	if (company === '' || position === '' || status === '') {
		throw new BadRequestError('Job fields cannot be an empty string.');
	}

	const job = await Job.findOneAndUpdate(
		{
			createdBy: req.user?.userId,
			_id: req.params.id
		},
		{ company, position, status },
		{ new: true, runValidators: true }
	);

	if (!job) throw new NotFoundError('Job not found.');

	res.json({ job });
};

export const jobDelete = async (req, res) => {
	const job = await Job.findOneAndDelete({
		createdBy: req.user?.userId,
		_id: req.params.id
	});

	if (!job) throw new NotFoundError('Job not found.');

	res.status(204).send();
};
