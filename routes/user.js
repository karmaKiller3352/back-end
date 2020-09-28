const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const response = require('../utils/res');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res, next) => {
	const checkUser = await User.find({ email: req.body.email });
	if (checkUser.length > 0) {
		response(res, 409, 'User exists');
	} else {
		bcrypt.hash(req.body.password, 10, (err, hash) => {
			if (err) {
				return res.status(500).json({
					error: err,
				});
			} else {
				const user = new User({
					email: req.body.email,
					password: hash,
					role: req.body.role,
				});
				try {
					user.save().then(() => {
						response(res, 409, 'User created');
					});
				} catch (error) {
					response(res, 500, error);
				}
			}
		});
	}
});

router.delete('/:userId', async (req, res) => {
	try {
		await User.deleteOne({ _id: req.params.userId });
		response(res, 204, 'User deleted');
	} catch (error) {
		response(res, 500, error);
	}
});

router.get('/', async (req, res) => {
	try {
		const users = await User.find();
		response(res, 200, users);
	} catch (error) {
		response(res, 500, error);
	}
});

router.post('/signin', async (req, res) => {
	try {
		const user = await User.find({ email: req.body.email });
		if (user.length < 1) {
			response(res, 401, 'Auth failed');
			return;
		}
		const match = await bcrypt.compare(req.body.password, user[0].password);
		if (match) {
			const token = jwt.sign(
				{
					email: user[0],
					userId: user[0]._id,
				},
				process.env.JWT_KEY,
				{
					expiresIn: '8h',
        },
      );
      console.log(token)
			response(res, 200, 'Auth successfull', {token});
		} else {
			response(res, 401, 'Auth failed');
			return;
		}
	} catch (error) {
		response(res, 500, error);
	}
});

module.exports = router;
