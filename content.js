var getSaldo = function() {
	var accountElements = document.getElementsByClassName("account-list-element-value account-column");
	var data = [];
	for (var i = 0; i < accountElements.length; i++) {
		data.push(accountElements[i].textContent);
	}
	calculateSaldo(data)
}

window.onload = function() {
	setTimeout(getSaldo, 2000);
}
function calculateSaldo(data) {
	if (data[0] !== 'Absent') {
		const num1 = data[1];
		const num2 = data[3];

		const [hours1, minutes1] = num1.split(".");
		const [hours2, minutes2] = num2.split(".");

		const totalMinutes = parseInt(minutes1) - parseInt(minutes2);
		const totalHours = parseInt(hours1) - parseInt(hours2) + Math.floor(totalMinutes / 60);

		const saldo = totalHours + "." + (totalMinutes % 60).toString().padStart(2, "0");

		const hours = Math.floor(saldo);
		const minutes = Math.floor((saldo - hours) * 60);
		if (minutes > 59) {
		hours += 1;
		minutes = 0;
		}
		const formattedSaldo = totalHours.toString().padStart(1, '0') + '.' + (60+totalMinutes).toString().padStart(2, '0');
		console.log(formattedSaldo);

		// create a new li element with the account-list-item class
		const liElement = document.createElement('li');
		liElement.className = 'account-list-item';

		// create a new div element with the account-row class
		const divRow = document.createElement('div');
		divRow.className = 'account-row';
		divRow.style.color = "#ff675c"

		// create a new div element with the account-column class
		const divColumn = document.createElement('div');
		divColumn.className = 'account-column';

		// create a new div element with the account-list-item-description and account-inline classes
		const divDescription = document.createElement('div');
		divDescription.className = 'account-list-item-description account-inline';
		divDescription.textContent = 'REAL SALDO';

		// create a new div element with the account-list-element-value and account-column classes
		const divValue = document.createElement('div');
		divValue.className = 'account-list-element-value account-column';
		divValue.textContent = formattedSaldo;

		// append the description div to the column div
		divColumn.appendChild(divDescription);

		// close the column div
		divRow.appendChild(divColumn);

		// append the value div to the row div
		divRow.appendChild(divValue);

		// append the row div to the li element
		liElement.appendChild(divRow);

		// get the element with the "account-info-result" class and append the new li element to it
		const accountInfoResult = document.querySelector('.account-list');
		accountInfoResult.appendChild(liElement);
	} else {
		console.log("Absent")
	}
}
