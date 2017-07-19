(function(){

	// let request = new XMLHttpRequest();

	// function newUser(e){
	// 	let fName = document.getElementById('first_name').value;
	// 	let alias = document.getElementById('alias').value;
	// 	let params = {
	// 		name: fName,
	// 		alias: alias
	// 	};
	// 	let jsonData = JSON.stringify(params);
	// 	console.log(jsonData);
	// 	request.open('POST', 'http://localhost:1428/api/user/', true);
	// 	request.setRequestHeader('Content-Type', 'application/json');
	// 	request.send(jsonData);
	// 	request.onreadystatechange = function(){
	// 		if (this.readyState == 4) {
	// 			console.log(request.responseText);
	// 		}
	// 		if (this.status != 200) {
	// 			console.log(`Error: ${(this.status ? this.statusText : 'request fail')}`);
	// 		}
	// 	}
	// }
	
	// document.getElementById('login').addEventListener('submit', newUser);

	let nameInp = $('#first_name');
	let aliasInp = $('#alias');
	let messageInp = $('#textarea1');
	
	let userList = $('.user-list');
	let chat = $('.chat');

	let user;
	let receiver;
	let users = [];

	// Add new user
	function newUser(){

		let fName = prompt('name', 'user');
		let alias = prompt('alias', 'alias');
		// let fName = nameInp.val();
		// let alias = aliasInp.val();
		let params = {
			name: fName,
			alias: alias
		};

		$.ajax({
			url         : 'http://localhost:1428/api/user/',
			type        : 'POST',
			ContentType : 'application/json',
			data        : params
		}).done(function(response){
			user = response || 'user';
			$('#welcome').text(`Welcome ${user.name}`);
		}).fail(function(jqXHR, textStatus, errorThrown){
			console.log(`Error: request fail`);
		});

	}

	// $('#modal-btn').on('click', newUser);

	window.onload = function(){
		// $('#modal1').modal('open');
		newUser();
	};

	function getAlias(message) {
		let exp = message.match(/@([A-Z0-9])\w+/im);
		return (exp != null && exp[0].slice(1));
	}


	// Post new message
	function newMessage () {
		let message = messageInp.val();
		receiver = getAlias(message);
		
		if(message != ''){
			let params = {
				sender: user.alias,
				receiver: receiver || '',
				text: message
			};

			$.ajax({
				url         : 'http://localhost:1428/api/message/',
				type        : 'POST',
				ContentType : 'application/json',
				data        : params
			}).done(function(response){
				// console.log(response.sender);
			}).fail(function(jqXHR, textStatus, errorThrown){
				console.log(`Error: request fail`);
			});

			messageInp.val('');
		}

	}

	$('#send').on('click', newMessage);

	
	// Get and render users list
	function getUsers () {
		userList.empty();

		$.ajax({
			url         : 'http://localhost:1428/api/user/all',
			type        : 'GET',
			ContentType : 'application/json'
		}).done(function(response){
			users = response;
			response.forEach(function(user) {
				let cutName = (user.name.length > 8) ? (user.name.substr(0, 8) + '...') : user.name;
				let cutAlias = (user.alias.length > 8) ? (user.alias.substr(0, 8) + '...') : user.alias;
				
				// let userList = document.getElementById('user-list');
				// let listItem = document.createElement('li');
				// listItem.className = 'user online';
				// userList.appendChild(listItem);
				// let span = document.createElement('li');
				// listItem.appendChild(span);
				// span.className = 'user__name';
				// span.innerHTML = cutName;

				userList.append(
					`<li class="user online">
						<span class="user__name">${cutName}</span>
						<span class="user__alias">(@${cutAlias})</span>
					</li>`
				);
			});
		}).fail(function(jqXHR, textStatus, errorThrown){
			console.log(`Error: request fail`);
		});

	}


	// Get and render messages list
	function getHistory () {
		chat.empty();

		$.ajax({
			url         : 'http://localhost:1428/api/message/all',
			type        : 'GET',
			ContentType : 'application/json'
		}).done(function(response){
			response.forEach(function(message) {
				for (let i = 0; i < users.length; i++) {
					var userName = (users[i].alias == message.sender) ? users[i].name : 'anonymous';
				}
				if(getAlias(message.text) == user.alias){
					chat.append(
						`<div class="message to-you">
							<div class="row">
								<div class="message__name left">${userName} (@${message.sender})</div>
								<div class="message__time right">${new Date(message.id).getHours()}: ${new Date(message.id).getMinutes()}</div>
							</div>
							<div class="row message__text">${message.text}</div>
						</div>`
					);
				} else {
					chat.append(
						`<div class="message">
							<div class="row">
								<div class="message__name left">${userName} (@${message.sender})</div>
								<div class="message__time right">${new Date(message.id).getHours()}: ${new Date(message.id).getMinutes()}</div>
							</div>
							<div class="row message__text">${message.text}</div>
						</div>`
					);
				}
			});
		}).fail(function(jqXHR, textStatus, errorThrown){
			console.log(`Error: request fail`);
		});

	}

	setInterval(function(){
		getUsers();
		getHistory();
	}, 2000)

})()