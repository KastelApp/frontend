import React, { useState, useRef, useCallback, useEffect } from "react";
import { animateScroll } from "react-scroll";
import useStateWithRef from "@/hooks/useStateWithRef.ts";
import { defer, chainedDefer } from "@/utils/defer.ts";

export enum ChannelState {
    FetchingTop,
    FetchingBottom,
    None
}

export enum ScrollStates {
    None,
    Bottom,
    ScrollToView,
    ScrollTop,
    ScrollToBottom,
    StayAtBottom,
    OffsetTop,
}

export type ScrollState =
    | { type: ScrollStates.None; }
    | { type: ScrollStates.Bottom; scrollingUntil?: number; }
    | { type: ScrollStates.ScrollToView; id: string; }
    | { type: ScrollStates.ScrollToBottom | ScrollStates.StayAtBottom; smooth?: boolean; }
    | { type: ScrollStates.ScrollTop; y: number; }
    | { type: ScrollStates.OffsetTop; previousHeight: number; };

export interface BaseType {
    id: string; // This is ALWAYS required, just for sorting purposes
}

export interface ScrollableProps<T extends BaseType> {
    /**
     * How many items should be rendered at a time.
     * 
     * @default 300 
     */
    maxRenderedItems?: number;

    /**
     * How many items we remove from the opposite end when we add more items.
     * 
     * @default 150
     */
    removeCount?: number;

    /**
     * This is for fetching more items at the TOP of the page. Please use your own caching system (which is the point of the "around" parameter)
     * Around is the LAST item at the top. For example if your rendered items are like:
     * 
     * 1. Cats (ID: 15)
     * 2. Dogs (ID: 14)
     * 3. Waffles (ID: 13)
     * 
     * When we go to fetch more data from the top, we pass "15" as the "around" parameter.
     */
    fetchTopItems: (count: number, around: string | null, force?: boolean) => Promise<{
        items: T[];
        /**
         * If there's more data we can fetch
         */
        hasMore: boolean;
    }>;

    /**
     * This is for fetching more itemsat the BOTTOM of the page. Please use your own caching system (which is the point of the "around" parameter)
     * Around is the LAST item at the bottom. For example if your rendered items are like:
     * 
     * 1. Cats (ID: 15)
     * 2. Dogs (ID: 14)
     * 3. Waffles (ID: 13)
     * 
     * When we go to fetch more data from the bottom, we pass "13" as the "around" parameter.
     */
    fetchBottomItems: (count: number, around: string | null, force?: boolean) => Promise<{
        items: T[];
        /**
         * If there's more data we can fetch
         */
        hasMore: boolean;
    }>;

    /**
     * This is more of an optional function. When Kastel handles messages, there are a few cases where a user may click on a reply and we want to jump to messages around there.
     * This isn't always possible in the few cases where themessages aren't rendered yet OR they do not exist in cache. How this function will work is simple. 
     * If you want to jump to a message, you provide the ID. First we will check if the message is in the rendered items, if it is we will scroll to it. If it isn't 
     * we will run this function, providing the ID. You then will need to use the "around" paramter to actually fetch the message and then scroll to it.
     * 
     * Note: This is mainly for messages (which is why we call out "messages" and "around") since Kastel's API has a "around" query parameter for fetching messages. around it.
     * 
     * todo: actually make this work. As there's one main issue with it:
     * todo: We need a better way to know when to fetch messages from the top or bottom. Currently it just checks indexes / the count but this won't work in all cases.
     * todo: one example is for when we jump lets say 500 messages up, we then go to scroll down. There would likely be messages in cache but these shouldn't be used
     * todo: since they are not the correct messages. We need a better way to handle this. as idk how to currently
     */
    fetchAroundItem?: (count: number, id: string) => Promise<unknown>;

    /**
     * Handles sorting the rendered items correctly
     */
    sortItems?: (a: T, b: T) => number

    /**
     * The ref of the div that contains the items, This is so we can handle scrolling stuff
     */
    ref: React.RefObject<HTMLDivElement>;
}

/**
 * Dear Developer who may be missing with this hook. It better be a beautiful day in hell for you to be messsing with this. I hate this hook and never want to touch it again!
 * 
 * This hook handles most of the rendering logic for the chat box, mainly keeping the scroll position in place, as well as fetching more items when needed (kind of).
 * You still need to provide your own fetching logic (i.e fetching from the api) but this hook will handle the rest. (i.e what items should be rendered etc).
 * 
 * This hook in theory can be used for anything, just  the data needs to have an ID field (for sorting purposes).
 * @param options The channel opttions
 * @returns The hook options
 */
const useScrollable = <T extends BaseType>({
    fetchBottomItems,
    fetchTopItems,
    maxRenderedItems = 300,
    removeCount = 150,
    ref,
    sortItems = (a, b) => a.id.localeCompare(b.id),
}: ScrollableProps<T>): {
    /**
     * The items that are currently rendered, this is handled more internally (We do not expose "setRenderedItems" to the user)
     */
    renderedItems: T[];

    /**
     * Fetch more items at the top
     */
    fetchTop: (count: number, noAround?: boolean, force?: boolean) => Promise<void>;

    /**
     * Fetch more items at the bottom
     */
    fetchBottom: (count: number, noAround?: boolean, force?: boolean) => Promise<void>;

    /**
     * Set the scroll state
     */
    setScrollState: (state: ScrollState) => void;

    /**
     * Add a single item to the list. This is mainly for when we receive a new message and we want to add it to the list.
     * 
     * @param item The item to add
     * @param direction The direction to add the item. "up" will add it to the top, "down" will add it to the bottom
     */
    addSingleItem: (item: T, direction?: "up" | "down") => void;

    /**
     * Remove an item from the list. This is mainly for when we delete a message and we want to remove it from the list.
     * 
     * @param id The id of the item to remove
     */
    removeItem: (id: string) => void;

    /**
     * Update's an item from the list with a new item. This is mainly for when we edit a message and we want to update it in the list.
     */
    updateItem: (item: T) => void;

    /**
     * The current state of the channel
     */
    state: ChannelState;

    /**
     * If we are at the top of the page
     */
    atTop: (offset?: number) => boolean;

    /**
     * If we are at the bottom of the page
     */
    atBottom: (offset?: number) => boolean;

    /**
     * If we have more items at the top
     */
    hasMoreTop: boolean;

    /**
     * If we have more items at the bottom
     */
    hasMoreBottom: boolean;

    /**
     * Lets you set if there's more on top
     */
    setHasMoreTop: (value: boolean) => void;

    /**
     * Lets you set if there's more on bottom
     */
    setHasMoreBottom: (value: boolean) => void;

    /**
     * Let's you set the rendered items, useful when switching "channels"
     */
    setRenderedItems: (items: T[]) => void;
} => {
    /**
     * Fast scrolling is the idea of user's clicking the scroll bar and dragging it up or down. We want to prevent this from fetching items as this causes a lot of issues.
     */
    const [, setIsFastScrolling, isFastScrollingRef] = useStateWithRef(false);

    /**
     * The items that are currently rendered, this is handled more internally (We do not expose "setRenderedItems" to the user)
     */
    const [renderedItems, setRenderedItems] = useState<T[]>([]);

    /**
     * Used to determine how far from the top we are. Used for fetching more items.
     */
    const atTop = useCallback((offset = 0) => {
        return ref.current ? ref.current.scrollTop <= offset : false;
    }, [ref]);

    /**
     * Used to determine how far from the bottom we are. Used for fetching more items.
     */
    const atBottom = useCallback((offset = 0) => {
        return ref.current ? Math.floor(ref.current?.scrollHeight - ref.current?.scrollTop) - offset <= ref.current?.clientHeight : true;
    }, [ref]);

    /**
     * If we have more items at the top, i.e can we fetch X more items upwards
     */
    const [hasMoreTop, setHasMoreTop] = useState(true);

    /**
     * if we have more items at the bottom, i.e can we fetch X more items downwards
     */
    const [hasMoreBottom, setHasMoreBottom] = useState(false);

    /**
     * Just handles some state stuff
     */
    const [state, setState] = useState<ChannelState>(ChannelState.None);

    /**
     * used for storing the current scroll state.
     */
    const scrollState = useRef<ScrollState>({ type: ScrollStates.None });

    /**
     * A friend made a bit of this portion, mainly for handling scrolling related stuff. This basically handles the scroll state and what to do with it.
     */
    const setScrollState = useCallback((newState: ScrollState) => {
        if (newState.type === ScrollStates.StayAtBottom) {
            if (!atBottom()) {
                scrollState.current = {
                    type: ScrollStates.ScrollToBottom,
                    smooth: newState.smooth,
                };
            } else {
                scrollState.current = { type: ScrollStates.None };
            }
        } else {
            scrollState.current = newState;
        }

        defer(() => {
            if (scrollState.current.type === ScrollStates.ScrollToBottom) {
                const smooth = scrollState.current.smooth ?? false;

                setScrollState({
                    type: ScrollStates.Bottom,
                    scrollingUntil: new Date().getTime() + 250,
                });

                animateScroll.scrollToBottom({
                    container: ref.current,
                    duration: smooth ? 150 : 0,
                });
            } else if (scrollState.current.type === ScrollStates.ScrollToView) {
                document.getElementById(scrollState.current.id)?.scrollIntoView({ block: "center" });

                setScrollState({ type: ScrollStates.None });
            } else if (scrollState.current.type === ScrollStates.OffsetTop) {
                animateScroll.scrollTo(
                    Math.max(
                        101,
                        ref.current
                            ? ref.current.scrollTop +
                            (ref.current.scrollHeight -
                                scrollState.current.previousHeight)
                            : 101,
                    ),
                    {
                        container: ref.current,
                        duration: 0,
                    },
                );

                setScrollState({ type: ScrollStates.None });
            } else if (scrollState.current.type === ScrollStates.ScrollTop) {
                animateScroll.scrollTo(scrollState.current.y, {
                    container: ref.current,
                    duration: 0,
                });

                setScrollState({ type: ScrollStates.None });
            }
        });
    }, [scrollState]);

    /**
     * This is the function we expose to the user to fetch more items at the top
     */
    const fetchTop = useCallback(async (count: number, noAround = false, force = false) => {
        if (!ref.current) {
            return;
        }

        if (!force && (state === ChannelState.FetchingTop || !hasMoreTop || isFastScrollingRef.current)) {
            return;
        }

        setState(ChannelState.FetchingTop);

        const sortedRenderedItems = renderedItems.sort(sortItems)

        const around = noAround ? null : sortedRenderedItems.length === 0 ? null : sortedRenderedItems[0].id;
        const prev = ref.current.scrollHeight;
        const newItems = await fetchTopItems(count, around, force);

        setHasMoreTop(newItems.hasMore);

        // ? When there's no items in rendering queue we can just dump all the items in there. There's been a few cases where
        // ? Rendering queue gets emptied for no reason (idk why) but this should still be fine
        if (sortedRenderedItems.length === 0) {
            setRenderedItems(newItems.items.sort(sortItems));
            setState(ChannelState.None);

            return;
        }

        // ? If there are items in rendering queue though, we first check if we are below the max rendered items. If so we can just dump all the items in there
        // ? debatable if we do <= instead of just < but I think it should be fine
        if (sortedRenderedItems.length < maxRenderedItems) {
            setRenderedItems((prev) => [...newItems.items, ...prev].sort(sortItems));

            // defer(() => {
            setTimeout(() => {
            setScrollState({ type: ScrollStates.OffsetTop, previousHeight: prev });
            }, 50)
            // });

            setState(ChannelState.None);

            return;
        }

        // ? Now when we are above the limit, we need to calculate how much height we need to remove. This is to preserve the scroll position
        let heightToRemove = 0;
        const idsToRemove: string[] = [];

        for (const child of Array.from(ref.current.children).reverse()) { // ? we reverse the array since this is the top and we want to remove the bottoms
            if (idsToRemove.length >= removeCount || child.id.startsWith("toIgnore")) { // ? if we are above we can just continue, likely could just slice the array but this is fine thats marginal in performance
                continue;
            }

            heightToRemove += child.clientHeight + parseInt(getComputedStyle(child).marginBottom);

            idsToRemove.push(child.id);
        }

        setRenderedItems((prev) => [...newItems.items, ...prev].filter((item) => !idsToRemove.includes(item.id)).sort(sortItems));

        chainedDefer(() => {
            setScrollState({ type: ScrollStates.OffsetTop, previousHeight: prev - heightToRemove });
        });

        setHasMoreBottom(true);

        setState(ChannelState.None);
    }, [renderedItems, fetchTopItems, hasMoreTop, state]);

    /**
     * This is the function we expose to the user to fetch more items at the bottom
     */
    const fetchBottom = useCallback(async (count: number, noAround = false, force = false) => {
        if (!ref.current) {
            return;
        }

        if (!force && (state === ChannelState.FetchingBottom || !hasMoreBottom)) {
            return;
        }

        setState(ChannelState.FetchingBottom);

        // ? Same as above (read those comments)
        const sortedRenderedItems = renderedItems.sort(sortItems)
        const around = noAround ? null : sortedRenderedItems[sortedRenderedItems.length - 1]?.id ?? null;
        const prev = ref.current.scrollTop;
        const newItems = await fetchBottomItems(count, around, force);

        setHasMoreBottom(newItems.hasMore);

        if (sortedRenderedItems.length === 0) {
            setRenderedItems(newItems.items.sort(sortItems));
            setState(ChannelState.None);

            return;
        }

        if (sortedRenderedItems.length < maxRenderedItems) {
            setRenderedItems((prev) => [...prev, ...newItems.items].sort(sortItems));

            defer(() => {
                setScrollState({ type: ScrollStates.ScrollTop, y: prev });
            });

            setState(ChannelState.None);

            return;
        }

        let heightToRemove = 0;
        const idsToRemove: string[] = [];

        for (const child of Array.from(ref.current.children)) {
            if (idsToRemove.length >= removeCount || child.id.startsWith("toIgnore")) {
                continue;
            }

            heightToRemove += child.clientHeight + parseInt(getComputedStyle(child).marginBottom);

            idsToRemove.push(child.id);
        }

        setRenderedItems((prev) => [...prev, ...newItems.items].filter((item) => !idsToRemove.includes(item.id)).sort(sortItems));
        setHasMoreTop(true);

        chainedDefer(() => {
            setScrollState({ type: ScrollStates.ScrollTop, y: prev - heightToRemove });
        });

        setState(ChannelState.None);
    }, [renderedItems, removeCount, fetchBottomItems, hasMoreBottom, state]);

    useEffect(() => {
        const onScroll = async () => {
            if (scrollState.current.type === ScrollStates.None && atBottom()) {
                setScrollState({ type: ScrollStates.Bottom });
            } else if (scrollState.current.type === ScrollStates.Bottom && !atBottom()) {
                if (scrollState.current.scrollingUntil && scrollState.current.scrollingUntil > new Date().getTime()) {
                    return;
                }

                setScrollState({ type: ScrollStates.None });
            }
        };

        const keyUp = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setScrollState({ type: ScrollStates.ScrollToBottom, smooth: false });
            }
        };

        const onMouseDownEvent = (event: MouseEvent) => {
            if (event.button !== 0 || (event.clientX < ref.current!.clientWidth)) return;

            setIsFastScrolling(true);
        };

        const onMouseUpEvent = (event: MouseEvent) => {
            if (event.button !== 0) return;

            setIsFastScrolling(false);
        };

        if (ref.current) ref.current.addEventListener("scroll", onScroll);

        document.body.addEventListener("keydown", keyUp);
        document.body.addEventListener("mousedown", onMouseDownEvent);
        document.body.addEventListener("mouseup", onMouseUpEvent);

        return () => {
            if (ref.current) ref.current.removeEventListener("scroll", onScroll);

            document.body.removeEventListener("keydown", keyUp);
            document.body.removeEventListener("mousedown", onMouseDownEvent);
            document.body.removeEventListener("mouseup", onMouseUpEvent);
        };
    }, [ref, scrollState, setScrollState]);

    const addSingleItem = useCallback((item: T, direction: "up" | "down" = "down") => {
        if (!hasMoreBottom) {
            setRenderedItems((prev) => {
                if (prev.length >= maxRenderedItems) {
                    direction === "down" ? prev.shift() : prev.pop();
                }

                return direction === "down" ? [...prev, item].sort(sortItems) : [item, ...prev].sort(sortItems);
            });


            if (direction === "down" && atBottom()) {
                defer(() => {
                    setScrollState({ type: ScrollStates.ScrollToBottom, smooth: false });
                });
            }
        }
    }, [hasMoreBottom]);

    const removeItem = useCallback((id: string) => {
        setRenderedItems((prev) => prev.filter((item) => item.id !== id).sort(sortItems));
    }, []);

    const updateItem = useCallback((item: T) => {
        setRenderedItems((prev) => {
            const index = prev.findIndex((i) => i.id === item.id);

            if (index === -1) return prev;

            prev[index] = item;

            return [...prev].sort(sortItems);
        });
    }, []);

    return {
        renderedItems,
        fetchTop,
        fetchBottom,
        setScrollState,
        addSingleItem,
        state,
        atTop,
        atBottom,
        hasMoreTop,
        hasMoreBottom,
        removeItem,
        updateItem,
        setHasMoreTop,
        setHasMoreBottom,
        setRenderedItems
    };
};

export default useScrollable;