export default (req, res, next) => {
	res.locals.user = req.user ? req.user : null;
	res.locals.info = req.flash('info');
	res.locals.errors = req.flash('error');
	next();
};
