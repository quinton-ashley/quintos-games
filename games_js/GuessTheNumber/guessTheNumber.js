(async () => {
	// your code goes here!

	let num = Math.round(random(1, 100));
	let guess;

	while (guess != num) {
		guess = await prompt('What is your guess?');

		if (guess == num) {
			await alert('Correct!');
		} else if (guess > num) {
			await alert('Too high.');
		} else {
			await alert('Too low.');
		}
	}

	exit();
})();
