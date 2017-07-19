const router = require('express').Router();
const userService = require('../../services/user');
const messageService = require('../../services/message');

router.get('/all', (req, res, next) => {
	try {
		res.header("Access-Control-Allow-Origin", "*");
		res.data = userService.allUsers();
		res.json(res.data);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

router.get('/:id', (req, res, next) => {
	try {
		res.header("Access-Control-Allow-Origin", "*");
		res.data = userService.findUser(Number(req.params.id));
		res.json(res.data);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

router.get("/:id/dialogs", (req, res, next) => {
	try {
		res.header("Access-Control-Allow-Origin", "*");
		let dialogs = messageService.findSender(Number(req.params.id));
		let dialogsIds = dialogs.map(dialog => dialog.receiver);
		let speakers = dialogsIds.map(user => userService.findUser(user));
		res.json(speakers);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

router.post("/", (req, res, next) => {
	try {
		// console.log(req.body);
		res.header("Access-Control-Allow-Origin", "*");
		let user = userService.newUser(req.body);
		userService.addUser(user);
		res.data = user;
		res.json(res.data);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

router.put('/:id', (req, res, next) => {
	try {
		res.data = userService.updateUser(Number(req.params.id), req.body);
		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});


router.delete('/:id', (req, res, next) => {
	try {
		userService.deleteUser(Number(req.params.id));
		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

module.exports = router;