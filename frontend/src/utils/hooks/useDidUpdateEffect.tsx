import { DependencyList, useEffect, useRef } from 'react';
type AnyFunction = (...args: any[]) => any|Promise<any>;
export function useDidUpdateEffect(fn:AnyFunction|void, inputs:DependencyList) {
	const isMountingRef = useRef(false);

	useEffect(() => {
		isMountingRef.current = true;
	}, []);

	useEffect(() => {
		if (!isMountingRef.current) {
			if(fn)
			return fn();
		} else {
			isMountingRef.current = false;
		}
	}, inputs);
}