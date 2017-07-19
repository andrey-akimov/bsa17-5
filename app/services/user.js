class User {
	constructor(id, name, alias) {
		this.id = id;
		this.name = name;
		this.alias = alias;
	}
}

let users = [];

module.exports = {
	allUsers () {
		return users;
	},

	newUser (data) {
		return new User(Date.now(), data.name, data.alias);
	},

	findUser (id) {
		return users.find(user => user.id == id);
	},

	addUser (user) {
		users.push(user);
	},

	deleteUser (id) {
		users = users.filter(user => user.id !== id);
	},

	updateUser (id, props) {
		let updatedUser = module.exports.findUser(id);
		for (let prop in props) {
			if (updatedUser.hasOwnProperty(prop)) {
				updatedUser[prop] = props[prop];
			}
		}
		return updatedUser;
	}
};