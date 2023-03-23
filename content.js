window.onload = function () {
	// Configure the observer to watch for changes to the style attribute
	observer.observe(workspaceCallbackProcess, { attributes: true });
};

// Select the element to observe
const workspaceCallbackProcess = document.getElementById('workspaceCallbackProcess');

// Create a new MutationObserver
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		// Check if the style attribute was modified
		if (mutation.attributeName === 'style') {
			setTimeout(getSaldo(), 20);
		}
	});
});

var getSaldo = function () {
	var accountElements = document.getElementsByClassName('account-list-element-value account-column');
	var data = [];
	for (var i = 0; i < accountElements.length; i++) {
		data.push(accountElements[i].textContent);
	}

	const saldo = data[1];
	const difference = data[3];
	displaySaldo(calculateTime(Math.abs(saldo).toString(), Math.abs(difference).toString()), data);
};

function calculateTime(saldo, difference) {
	console.log('Saldo: ' + saldo);
	console.log('Difference: ' + difference);
	// Check that the input parameters are in the expected format of 'h.mm'
	if (!/^\d+\.\d{2}$/.test(saldo) || !/^\d+\.\d{2}$/.test(difference)) {
		return 'Invalid input format. Expected format: h.mm';
	}

	// Extract hours and minutes from the input strings
	const [saldoHours, saldoMinutes] = saldo.split('.').map(Number);
	const [diffHours, diffMinutes] = difference.split('.').map(Number);

	// Calculate the total minutes
	let SaldoInMinutes = saldoHours * 60 + saldoMinutes;
	let DiffInMinutes = diffHours * 60 + diffMinutes;

	// Add the decimal part of the saldo to the total minutes
	totalMinutes = DiffInMinutes - SaldoInMinutes;

	// Calculate the final hours and minutes
	const resultHours = Math.floor(totalMinutes / 60);

	const resultMinutes = totalMinutes % 60;

	// Format the result as a string in the 'h.mm' format
	const hoursString = resultHours.toString();
	const minutesString = resultMinutes.toString().padStart(2, '0');

	// Join the hours and minutes strings together with the appropriate formatting
	const result = `${hoursString}.${minutesString}`;
	console.log(result);
	return result;
}

function displaySaldo(time, data) {
	if (data[0] !== 'Absent' && data[1] < 0) {
		// create a new li element with the account-list-item class
		const liElement = document.createElement('li');
		liElement.className = 'account-list-item';

		// create a new div element with the account-row class
		const divRow = document.createElement('div');
		divRow.className = 'account-row';
		divRow.style.color = '#ff675c';

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
		divValue.textContent = time;

		// append the description div to the column div
		divColumn.appendChild(divDescription);

		// close the column div
		divRow.appendChild(divColumn);

		// append the value div to the row div
		divRow.appendChild(divValue);

		// append the row div to the li element
		liElement.appendChild(divRow);

		// get the element with the 'account-info-result' class and append the new li element to it
		const accountInfoResult = document.querySelector('.account-list');
		accountInfoResult.appendChild(liElement);
	} else {
		console.log('Absent');
	}
}
