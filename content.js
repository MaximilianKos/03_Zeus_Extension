let loaded = false;

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
			setTimeout(getSaldoAndDifference(), 50);
			loaded = true;
		}
	});
});

/* --- ^^ If Object on Website loaded (Purple loading top right ^^ --- */
const currentTime = getTime();

function getTime() {
	const date = new Date();
	const hours = addLeadingZero(date.getHours());
	const minutes = addLeadingZero(date.getMinutes());
	return `${hours}:${minutes}`;
}

function addLeadingZero(value) {
	return value < 10 ? `0${value}` : value;
}

function convertToUnixTimestamp(timeString) {
	const [hours, minutes] = timeString.split(':');
	const date = new Date();
	date.setHours(parseInt(hours, 10));
	date.setMinutes(parseInt(minutes, 10));
	date.setSeconds(0);
	date.setMilliseconds(0);
	return Math.floor(date.getTime() / 1000);
}

function convertToNormalTime(timestamp) {
	const date = new Date(timestamp * 1000);
	const hours = addLeadingZero(date.getHours());
	const minutes = addLeadingZero(date.getMinutes());
	return `${hours}:${minutes}`;
}

function addMinutesToCurrentTime(diffHours, diffMinutes) {
	const currentTime = new Date();
	const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
	const diffInMinutes = diffHours * 60 + diffMinutes;
	const totalMinutes = currentTimeInMinutes + diffInMinutes;

	const newDate = new Date();
	newDate.setHours(Math.floor(totalMinutes / 60));
	newDate.setMinutes(totalMinutes % 60);

	const hours = addLeadingZero(newDate.getHours());
	const minutes = addLeadingZero(newDate.getMinutes());
	const seconds = addLeadingZero(newDate.getSeconds());

	return `${hours}:${minutes}:${seconds}`;
}

let getSaldoAndDifference = function () {
	var accountElements = document.getElementsByClassName('account-list-element-value account-column');
	var data = [];
	for (var i = 0; i < accountElements.length; i++) {
		data.push(accountElements[i].textContent);
	}

	const saldo = data[1];
	const difference = data[3];
	console.log('Saldo: ' + saldo);
	console.log('Difference: ' + difference);
	displayElement(calculateSaldoTime(Math.abs(saldo).toString(), Math.abs(difference).toString()), data, 'REAL SALDO');
	displayElement(calculateTimeOfDay(Math.abs(difference).toString(), convertToUnixTimestamp(currentTime)), data, 'DEPARTURE FOR NO DEDUCTIONS');
};

function displayElement(textContent, data, displayName) {
	if (loaded == true) {
		const element = document.querySelector('#main');
		element.remove();
	}
	if (data[0] !== 'Absent' && data[1] < 0) {
		// create a new li element with the account-list-item class
		const liElement = document.createElement('li');
		liElement.className = 'account-list-item';
		liElement.id = 'main';

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
		divDescription.textContent = displayName;

		// create a new div element with the account-list-element-value and account-column classes
		const divValue = document.createElement('div');
		divValue.className = 'account-list-element-value account-column';
		divValue.textContent = textContent;

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

/* --- ^^ Gloabl Functions ^^ */

function calculateSaldoTime(saldo, difference) {
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
	return result;
}

/* --- ^^ Calculate Saldo ^^ --- */

function calculateTimeOfDay(difference, currentTimeInUnix) {
	// Check that the input parameters are in the expected format of 'h.mm'
	if (!/^\d+\.\d{2}$/.test(difference)) {
		return 'Invalid input format. Expected format: h.mm';
	}

	// Extract hours and minutes from the input string
	const [diffHours, diffMinutes] = difference.split('.').map(Number);

	// Calculate the total minutes
	const diffInMinutes = diffHours * 60 + diffMinutes;
	const diffInMilliseconds = diffInMinutes * 60 * 1000;

	// Add UNIX timestamps together
	let newTimestamp = currentTimeInUnix + Math.floor(diffInMilliseconds / 1000);

	// Convert the current Unix timestamp to Zurich time
	const currentTime = new Date(currentTimeInUnix * 1000);
	const currentHour = parseInt(currentTime.toLocaleString('en-CH', { timeZone: 'Europe/Zurich', hour: '2-digit', hour12: false }));

	// Add an hour if the current hour is less than 12
	if (currentHour < 12) {
		newTimestamp += 3600;
	}

	// Convert the new timestamp to Zurich time
	const newTime = new Date(newTimestamp * 1000);
	return newTime.toLocaleString('en-CH', { timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit', hour12: false });
}

/* --- ^^ Caulculate Time Of Day ^^ --- */
