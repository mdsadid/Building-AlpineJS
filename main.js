let root = document.querySelector('[x-data]');
let rawData = getInitialData();
let data = observe(rawData);

function getInitialData() {
	let dataString = root.getAttribute('x-data');

	return eval(`(${dataString})`);
}

function observe(data) {
	return new Proxy(data, {
		set(target, prop, value) {
			target[prop] = value;

			refreshDOM(root);

			return true;
		}
	});
}

registerListeners();

function registerListeners() {
	walkDOM(root, el => {
		if (el.hasAttribute('@click')) {
			let expression = el.getAttribute('@click');

			el.addEventListener('click', () => {
				eval(`(data.${expression})`);
			});
		}
	});
}

refreshDOM(root);

function refreshDOM(root) {
	walkDOM(root, el => {
		if (el.hasAttribute('x-text')) {
			let expression = el.getAttribute('x-text');

			el.innerText = eval(`(data.${expression})`);
		}
	});
}

function walkDOM(el, callback) {
	callback(el);

	el = el.firstElementChild;

	while (el) {
		walkDOM(el, callback);

		el = el.nextElementSibling;
	}
}
