/* Listener for OutSystems' solutions/deployments to notify the user when finished.
 *
 * Goncalo Soares, 2017-07-28.
 * Ivo Frazao Costeira, 2022-06-02.
 * Ivo Frazao Costeira, 2022-07-14. Code refactor.
 * Ivo Frazao Costeira, 2022-08-09. Automatic detection of ServiceCenter solution or Lifetime deploy.
 * Ivo Frazao Costeira, 2022-12-03. To avoid restrictive CSP policies, the audio is now a simple beep with the AudioContext API.
 */

try {
	window.isPublishDone = false;
	window.isPublishListener = setInterval(() => {
		let context = null;
		const isLifetime = document.location.pathname.split('/')[1].toUpperCase() === 'LIFETIME';
		const lifetimeVars = {
			message: "Deployment done",
			searchString: "deploy completed",
		};
		const serviceCenterVars = {
			message: "Solution completed",
			searchString: "done: the solution was successfully published.",
		};
		const solutionDone = {
			vars: isLifetime ? lifetimeVars : serviceCenterVars,
		};

		let isDone = () => {
			return [...document.getElementsByTagName('td')].filter((element) => {
				return element.innerText.toLowerCase().includes(solutionDone.vars.searchString);
			}).length > 0;
		}

		const beep = (freq = 520, duration = 200, vol = 100) => {
			const oscillator = context.createOscillator();
			const gain = context.createGain();
			oscillator.connect(gain);
			oscillator.frequency.value = freq;
			oscillator.type = "square";
			gain.connect(context.destination);
			gain.gain.value = vol * 0.01;
			oscillator.start(context.currentTime);
			oscillator.stop(context.currentTime + duration * 0.001);
		}

		const playSound = () => {
			context = new AudioContext();
			beep();
			setTimeout(
				() => { alert(solutionDone.vars.message) }
				, 100
			);
		}

		if (isDone() && !window.isPublishDone) {
			playSound();
			clearInterval(window.isPublishListener);
			window.isPublishDone = true;
		}
	}, 1000);
}
catch {
	alert('Error while set-up');
}
