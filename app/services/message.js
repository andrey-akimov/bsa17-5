class Message {
	constructor (id, sender, receiver, text) {
		this.id = id;
		this.sender = sender;
		this.receiver = receiver;
		this.text = text;
	}
}

let messages = [];

module.exports = {
	allMessages () {
		return messages;
	},

	newMessage (data) {
		return new Message(Date.now(), data.sender, data.receiver, data.text);
	},

	findMessage (id) {
		return messages.find(message => message.id == id);
	},

	findSender (sender) {
		return messages.filter(message => message.sender == sender);
	},

	// FIFO
	addMessage (message) {
		if (messages.length === 100) {
			messages.shift();
			messages.push(message);
		} else {
			messages.push(message);
		}
	},

	deleteMessage (id) {
		messages = messages.filter(message => message.id !== id);
	},

	updateMessage (id, props) {
		let message = module.exports.findMessage(id);
		for (let prop in props) {
			if (message.hasOwnProperty(prop)) {
				message[prop] = props[prop];
			}
		}
		return message;
	}
};