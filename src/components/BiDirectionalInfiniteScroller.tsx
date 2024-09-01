import throttle from "@/utils/throttle.ts";
import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import cn from "@/utils/cn.ts";

interface BiDirectionalInfiniteScrollerProps<T> {
	/**
	 * Runs when the top of the scroller is reached.
	 */
	onTopReached: () => Promise<void>;
	/**
	 * Runs when the bottom of the scroller is reached.
	 */
	onBottomReached: () => Promise<void>;
	/**
	 * If true, the onTopReached function will be called when the top of the scroller is reached.
	 */
	hasMoreTop?: boolean;
	/**
	 * If true, the onBottomReached function will be called when the bottom of the scroller is reached.
	 */
	hasMoreBottom?: boolean;
	/**
	 * If true then we prevent new data from being fetched.
	 */
	loading?: boolean;
	/**
	 * The skeleton to show at the top of the scroller, this does not affect the onTopReached function.
	 * (i.e you don't need to be at the top of the skeleton to trigger the onTopReached function)
	 */
	topSkeleton?: React.ReactNode;
	/**
	 * The skeleton to show at the bottom of the scroller, this does not affect the onBottomReached function.
	 * (i.e you don't need to be at the bottom of the skeleton to trigger the onBottomReached function)
	 */
	bottomSkeleton?: React.ReactNode;
	/**
	 * Top content is rendered when hasMoreTop is false, this is NOT like the topSkeleton.
	 */
	topContent?: React.ReactNode;
	/**
	 * Bottom content is rendered when hasMoreBottom is false, this is NOT like the bottomSkeleton.
	 */
	bottomContent?: React.ReactNode;
	data: T[];
	renderItem: (item: T, index: number, items: T[]) => React.ReactNode;
	/**
	 * The threshold to trigger the onTopReached function. (Defaults to 0.8, it means when the user has scrolled 80% of the total height of the scroller)
	 */
	topThreshold?: number;
	/**
	 * The threshold to trigger the onBottomReached function. (Defaults to 0.8, it means when the user has scrolled 80% of the total height of the scroller)
	 */
	bottomThreshold?: number;
	className?: string;
	style?: React.CSSProperties;
	/**
	 * The initial scroll top of the scroller. (Defaults to 0), -1 = scroll to the bottom
	 */
	initialScrollTop?: number;
	/**
	 * Prevent's users from clicking on the scrollbar and scrolling to the top / bottom super fast
	 * This prevent's the onTopReached and onBottomReached functions from being called, until the user releases it
	 */
	preventFastScroll?: boolean;
	classNames?: {
		topSkeleton?: string;
		bottomSkeleton?: string;
		dataDiv?: string;
		scrollWrapper?: string;
	};
	styles?: {
		topSkeleton?: React.CSSProperties;
		bottomSkeleton?: React.CSSProperties;
		dataDiv?: React.CSSProperties;
		scrollWrapper?: React.CSSProperties;
	};
	id?: string;
}

const BiDirectionalInfiniteScroller = <T,>({
	data,
	hasMoreBottom = false,
	hasMoreTop = false,
	loading = false,
	onBottomReached,
	onTopReached,
	renderItem,
	topContent,
	bottomContent,
	bottomSkeleton,
	topSkeleton,
	bottomThreshold = 0.8,
	topThreshold = 0.8,
	initialScrollTop = -1,
	preventFastScroll,
	className,
	classNames,
	style,
	styles,
	id,
}: BiDirectionalInfiniteScrollerProps<T>) => {
	if (!data) throw new Error("Data is required for BiDirectionalInfiniteScroller");
	if (!onTopReached || !onBottomReached)
		throw new Error("onTopReached and onBottomReached are required for BiDirectionalInfiniteScroller");
	if (!renderItem) throw new Error("renderItem is required for BiDirectionalInfiniteScroller");

	const scrollWrapperRef = useRef<HTMLDivElement>(null);
	const scrollerInnerRef = useRef<HTMLOListElement>(null);
	const theTopHiddenOne = useRef<HTMLDivElement>(null);
	const theBottomHiddenOne = useRef<HTMLDivElement>(null);
	const topSkeletonRef = useRef<HTMLDivElement>(null);
	const bottomSkeletonRef = useRef<HTMLDivElement>(null);
	const [, setVirtualData] = useState<T[]>(data);

	const [isFastScrolling, setIsFastScrolling] = useState(false);
	const [canFetchAgain, setCanFetchAgain] = useState(true);

	const isFastScrollingRef = useRef(isFastScrolling);
	const hasMoreTopRef = useRef(hasMoreTop);
	const hasMoreBottomRef = useRef(hasMoreBottom);
	const loadingRef = useRef(loading);
	const canFetchAgainRef = useRef(canFetchAgain);

	useLayoutEffect(() => {
		if (!loading) {
			setVirtualData(data);

			setTimeout(() => {
				setCanFetchAgain(true);
			}, 2000);
		}
	}, [loading]);

	useEffect(() => {
		hasMoreTopRef.current = hasMoreTop;
		hasMoreBottomRef.current = hasMoreBottom;
		isFastScrollingRef.current = isFastScrolling;
		loadingRef.current = loading;
		canFetchAgainRef.current = canFetchAgain;
	}, [hasMoreTop, hasMoreBottom, isFastScrolling, loading, canFetchAgain]);

	/**
	 * This attempts to jump the user up when fetching new elements, so the last possible element is visible so when we add new data, our scroll position
	 * isn't stored in the skeleton box (as then you get stuck in a infinite loop of fetching new data)
	 */
	const fixPositioning = () => {
		const elementWrapper = scrollWrapperRef.current;
		const scrollerInner = scrollerInnerRef.current;

		if (!elementWrapper || !scrollerInner) return;

		const elementWrapperRect = elementWrapper.getBoundingClientRect();
		const elements = scrollerInner.querySelectorAll("li");
		let anyElementInView = false;
		let closestElement: HTMLLIElement | null = null;
		let closestDistance = Infinity;

		for (const element of elements) {
			const elementRect = element.getBoundingClientRect();

			// ? Check if any part of the element is in view
			if (
				(elementRect.top >= elementWrapperRect.top && elementRect.bottom <= elementWrapperRect.bottom) ||
				(elementRect.top <= elementWrapperRect.top && elementRect.bottom >= elementWrapperRect.top) ||
				(elementRect.top <= elementWrapperRect.bottom && elementRect.bottom >= elementWrapperRect.bottom)
			) {
				anyElementInView = true;
			}

			// ? Calculate the closest element to the viewport (this is so we can move the closest element into view (cc below))
			const distance = Math.min(
				Math.abs(elementRect.top - elementWrapperRect.top),
				Math.abs(elementRect.bottom - elementWrapperRect.bottom),
			);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestElement = element as HTMLLIElement;
			}
		}

		if (!anyElementInView && closestElement) {
			const closestElementRect = closestElement.getBoundingClientRect();
			if (closestElementRect.top > 0) {
				const scrollOffset = closestElementRect.bottom - elementWrapperRect.bottom - closestElement.clientHeight + 20;
				elementWrapper.scrollTop += scrollOffset;
			} else {
				const scrollOffset = closestElementRect.top - elementWrapperRect.top + (closestElement.clientHeight - 10);
				elementWrapper.scrollTop += scrollOffset;
			}
		}
	};

	const addTop = async () => {
		if (!hasMoreTopRef.current || isFastScrollingRef.current || loadingRef.current || !canFetchAgainRef.current) return;

		fixPositioning();

		const elementWrapper = scrollWrapperRef.current;
		const scroller = scrollerInnerRef.current;

		if (!elementWrapper || !scroller) return;

		const { scrollTop: currentScrollPosition } = elementWrapper;
		const currentScrollHeight = scroller.scrollHeight;

		await onTopReached();

		setTimeout(() => {
			const newScrollHeight = scroller.scrollHeight;
			const scrollDifference = newScrollHeight - currentScrollHeight;
			elementWrapper.scrollTop = currentScrollPosition + scrollDifference;
		}, 0);
	};

	const addBottom = async () => {
		if (!hasMoreBottomRef.current || isFastScrollingRef.current || loadingRef.current || !canFetchAgainRef.current)
			return;

		fixPositioning();

		await onBottomReached();
	};

	const thorttledFix = throttle(fixPositioning, 25);

	const skellyEndEvent = (event: React.UIEvent<HTMLElement> | null, skipCheck?: boolean) => {
		if (isFastScrollingRef.current && !skipCheck) return;

		thorttledFix();
	};

	const onMouseDownEvent = (event: MouseEvent) => {
		if (event.button !== 0 || (event.clientX < scrollWrapperRef.current!.clientWidth && !preventFastScroll)) return;

		setIsFastScrolling(true);
	};

	const onMouseUpEvent = (event: MouseEvent) => {
		if (event.button !== 0) return;

		setIsFastScrolling(false);
		skellyEndEvent(null, true);
	};

	useEffect(() => {
		const wrapper = scrollWrapperRef.current;

		if (wrapper) {
			const wrapper = scrollWrapperRef.current!;

			if (initialScrollTop === -1) {
				wrapper.scrollTo(0, wrapper.scrollHeight);
			} else {
				wrapper.scrollTo(0, wrapper.scrollHeight * initialScrollTop);
			}

			const checkInterval = setInterval(() => {
				if (isFastScrollingRef.current) return;

				fixPositioning();
			}, 250);

			// @ts-expect-error For whatever reason the event it returns just "Event"?
			wrapper.addEventListener("scroll", skellyEndEvent);
			wrapper.addEventListener("mousedown", onMouseDownEvent);
			wrapper.addEventListener("mouseup", onMouseUpEvent);

			return () => {
				// @ts-expect-error For whatever reason the event it returns just "Event"?
				wrapper.removeEventListener("scroll", skellyEndEvent);
				wrapper.removeEventListener("mousedown", onMouseDownEvent);
				wrapper.removeEventListener("mouseup", onMouseUpEvent);
				clearInterval(checkInterval);
			};
		}
	}, []);

	useEffect(() => {
		const bottomObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						addBottom();
					}
				});
			},
			{ threshold: 0 },
		);

		if (theBottomHiddenOne.current) {
			bottomObserver.observe(theBottomHiddenOne.current);
		}

		return () => {
			if (theBottomHiddenOne.current) {
				bottomObserver.disconnect();
			}
		};
	}, [theBottomHiddenOne, hasMoreBottom]);

	useEffect(() => {
		const topObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						addTop();
					}
				});
			},
			{ threshold: 0 },
		);

		if (theTopHiddenOne.current) {
			topObserver.observe(theTopHiddenOne.current);
		}

		return () => {
			if (theTopHiddenOne.current) {
				topObserver.disconnect();
			}
		};
	}, [theTopHiddenOne, hasMoreTop]);

	const turnThresholdIntoVh = (threshold: number) => {
		// ? 0.8 = 80vh
		return `${threshold * 100}vh`;
	};

	return (
		<div className={className} style={style}>
			<div
				id={id}
				ref={scrollWrapperRef}
				className={cn("h-full overflow-y-auto", classNames?.scrollWrapper)}
				style={styles?.scrollWrapper}
			>
				<div tabIndex={-1} role="group" className={classNames?.dataDiv} style={styles?.dataDiv}>
					{hasMoreTop && topSkeleton && (
						<div ref={topSkeletonRef} className={classNames?.topSkeleton} style={styles?.topSkeleton}>
							{topSkeleton}
						</div>
					)}
					{topContent && !hasMoreTop && topContent}
					<ol tabIndex={0} ref={scrollerInnerRef} className="relative flex flex-col">
						{hasMoreTop && (
							<div
								className="absolute inset-0 -z-20 mt-4 w-full"
								style={{
									height: turnThresholdIntoVh(topThreshold),
								}}
								ref={theTopHiddenOne}
							/>
						)}
						{data.map((item, index) => (
							<li key={index} id={`item-${index}`}>
								{renderItem(item, index, data)}
							</li>
						))}
						{hasMoreBottom && (
							<div
								className="absolute bottom-0 -z-20 w-full"
								style={{
									height: turnThresholdIntoVh(bottomThreshold),
								}}
								ref={theBottomHiddenOne}
							/>
						)}
					</ol>
					{hasMoreBottom && bottomSkeleton && (
						<div ref={bottomSkeletonRef} className={classNames?.bottomSkeleton} style={styles?.bottomSkeleton}>
							{bottomSkeleton}
						</div>
					)}
					{bottomContent && !hasMoreBottom && bottomContent}
				</div>
			</div>
		</div>
	);
};

export default BiDirectionalInfiniteScroller;
