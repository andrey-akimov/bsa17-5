window.onload = function(){
	$('#modal1').modal('open');
};

(function(){

	let modalBtn = document.getElementById('modal-btn');
	let nameInp = document.getElementById('first_name');
	let aliasInp = document.getElementById('alias');
	let welcome = document.getElementById('welcome');
	let messageInp = document.getElementById('textarea1');
	let sendBtn = document.getElementById('send');
	let userList = document.getElementById('user-list');
	let chat = document.getElementById('chat');
	let user;
	let fName;
	let alias;
	let receiver;
	let users = [];
	
	let request = new XMLHttpRequest();

	function newUser(){
		let params = {
			name: fName,
			alias: alias
		};
		let jsonData = JSON.stringify(params);
		request.open('POST', 'http://localhost:1428/api/user/', true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(jsonData);
		request.onreadystatechange = function(){
			if (this.readyState == 4) {
				user = JSON.parse(request.responseText) || 'user';
				welcome.innerHTML = `Welcome ${user.name}`;
			}
		}
	}

	modalBtn.addEventListener('click', function(){
		if (nameInp.value !== '' && aliasInp.value !== '') {
			fName = nameInp.value;
			alias = aliasInp.value;
			newUser();
		}
	});

	function getAlias(message) {
		let exp = message.match(/@([A-Z0-9])\w+/im);
		return (exp != null && exp[0].slice(1));
	}

	function newMessage () {
		if (user != undefined) {
			let message = messageInp.value;
			receiver = getAlias(message);
			
			if (message != '') {
				let params = {
					sender: user.alias,
					receiver: receiver || '',
					text: message
				};
				let jsonData = JSON.stringify(params);
				request.open('POST', 'http://localhost:1428/api/message/', true);
				request.setRequestHeader('Content-Type', 'application/json');
				request.send(jsonData);
				request.onreadystatechange = function(){
					if (this.readyState == 4) {
						console.log(request.responseText);
					}
				}
				messageInp.value = '';
			}
		} else {
			$('#modal1').modal('open');
		}

	}

	sendBtn.addEventListener('click', newMessage);

	function getUsers () {
		
		request.open('GET', 'http://localhost:1428/api/user/all', true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.send();
		request.onreadystatechange = function(){

			if (this.readyState == 4) {
				userList.innerHTML = '';
				users = JSON.parse(request.responseText);
				users.forEach(function(user) {
					let cutName = (user.name.length > 10) ? (user.name.substr(0, 7) + '...') : user.name;
					let cutAlias = (user.alias.length > 10) ? (user.alias.substr(0, 7) + '...') : user.alias;
					
					let listItem = document.createElement('li');
					listItem.className = 'user online';
					userList.appendChild(listItem);
					let spanName = document.createElement('span');
					spanName.className = 'user__name';
					spanName.innerHTML = cutName;
					listItem.appendChild(spanName);
					let spanAlias = document.createElement('span');
					spanAlias.className = 'user__alias';
					listItem.appendChild(spanAlias);
					spanAlias.innerHTML = `(@${cutAlias})`;

				});
			}

		}

	}
	
	function getHistory () {
		if (user != undefined) {
		
			request.open('GET', 'http://localhost:1428/api/message/all', true);
			request.setRequestHeader('Content-Type', 'application/json');
			request.send();
			request.onreadystatechange = function(){

				if (this.readyState == 4) {
					chat.innerHTML = '';
					let messages = JSON.parse(request.responseText);
					messages.forEach(function(message) {
						for (let i = 0; i < users.length; i++) {
							var userName;
							if (users[i].alias == message.sender) {
								userName = users[i].name;
							}
						}
						if (getAlias(message.text) == user.alias) {
							let msg = document.createElement('div');
							msg.className = 'message to-you';
							chat.appendChild(msg);
							let row = document.createElement('div');
							row.className = 'row';
							msg.appendChild(row);
							let name = document.createElement('div');
							name.className = 'message__name left';
							name.innerHTML = `${userName} (@${message.sender})`;
							row.appendChild(name);
							let time = document.createElement('div');
							time.className = 'message__time right';
							time.innerHTML = `${new Date(message.id).getHours()}: ${new Date(message.id).getMinutes()}`;
							row.appendChild(time);
							let text = document.createElement('div');
							text.className = 'row message__text';
							text.innerHTML = `${message.text}`;
							msg.appendChild(text);
						} else {
							let msg = document.createElement('div');
							msg.className = 'message';
							chat.appendChild(msg);
							let row = document.createElement('div');
							row.className = 'row';
							msg.appendChild(row);
							let name = document.createElement('div');
							name.className = 'message__name left';
							name.innerHTML = `${userName} (@${message.sender})`;
							row.appendChild(name);
							let time = document.createElement('div');
							time.className = 'message__time right';
							time.innerHTML = `${new Date(message.id).getHours()}: ${new Date(message.id).getMinutes()}`;
							row.appendChild(time);
							let text = document.createElement('div');
							text.className = 'row message__text';
							text.innerHTML = `${message.text}`;
							msg.appendChild(text);
						}
					});
				}
			}
		}

	}

	// Sorry about that :(
	setInterval(function(){
		getUsers();
	}, 1000)

	setInterval(function() {
		getHistory();
	}, 1100);

})()