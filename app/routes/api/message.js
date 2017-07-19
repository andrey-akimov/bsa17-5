const router = require('express').Router();
const messageService = require('../../services/message');

router.get('/all', (req, res, next) => {
	try {
		res.data = messageService.allMessages();
		res.json(res.data);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

router.get('/:id', (req, res, next) => {
	try {
		res.data = messageService.findMessage(Number(req.params.id));
		res.json(res.data);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

router.post("/", (req, res, next) => {
	try {
		let user = messageService.newMessage(req.body);
		// FIFO control
		console.log(messageService.allMessages().length);
		
		messageService.addMessage(user);
		res.data = user;
		res.json(res.data);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

router.put('/:id', (req, res, next) => {
	try {
		res.data = messageService.updateMessage(Number(req.params.id), req.body);
		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});


router.delete('/:id', (req, res, next) => {
	try {
		messageService.deleteMessage(Number(req.params.id));
		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(400);
		res.end();
	}
});

module.exports = router;