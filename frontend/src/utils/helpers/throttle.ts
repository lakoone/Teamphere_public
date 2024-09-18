export function throttle(func: (...args: any[]) => void, wait: number,options = {disableLastCall:false}) {
	let timeout: NodeJS.Timeout | null = null;
	let lastArgs: any[] | null = null;

	const execute = () => {
		if (lastArgs && !options.disableLastCall) {
			func(...lastArgs);
			lastArgs = null;
			timeout = setTimeout(execute, wait);
		} else {
			timeout = null;
		}
	};

	return (...args: any[]) => {
		lastArgs = args;
		if (!timeout) {
			func(...args);
			timeout = setTimeout(execute, wait);
		}
	};
}