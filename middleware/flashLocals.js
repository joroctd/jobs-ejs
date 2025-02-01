export default (req, res, next) => {
	res.locals.info = req.flash('info');
	res.locals.errors = req.flash('error');
	next();
};
