var stompClient = null



function sendMessage() {


	let jsonOb = {
		name: localStorage.getItem("name"),
		content: $("#message-value").val()
	}
	if (jsonOb.content !== "") {

		stompClient.send("/app/message", {}, JSON.stringify(jsonOb));
	}

}



function connect() {

	let socket = new SockJS("/server1")

	stompClient = Stomp.over(socket)

	stompClient.connect({}, function(frame) {

		console.log("Connected : " + frame)

		$("#name-from").addClass('d-none')
		$("#chat-room").removeClass('d-none')


		//subscribe
		stompClient.subscribe("/topic/return-to", function(response) {


			showMessage(JSON.parse(response.body))

		})



	})

}


function showMessage(message) {


	$("#message-container-table").prepend(`<tr><td><b>${message.name} :</b> ${message.content} 
	</td></tr>`)





}





$(document).ready((e) => {


	$("#login").click(() => {

		let key_check = $("#key-value").val()
		let key = "abcd";

		let name = $("#name-value").val()
		if (key_check == key && name != "") {

			console.log("this is name checking: " + name);
			console.log("this is key checking: " + key_check);
			localStorage.setItem("name", name)
			$("#name-title").html(`Welcome , <b>${name} </b> !`)
			connect();
		}

		else {
			alert("key not matched");
		}


	})

	$("#send-btn").click(() => {
		sendMessage()
	})

	$("#logout").click(() => {

		localStorage.removeItem("name")
		if (stompClient !== null) {
			stompClient.disconnect()

			$("#name-from").removeClass('d-none')
			$("#chat-room").addClass('d-none')
			console.log("stomp" + stompClient)
		}

	})

})