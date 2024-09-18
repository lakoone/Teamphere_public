import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (callback: IntersectionObserverCallback, options: IntersectionObserverInit) => {
	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		observer.current = new IntersectionObserver(callback, options);
		return () => observer.current?.disconnect();
	}, [callback, options]);

	return observer.current;
};