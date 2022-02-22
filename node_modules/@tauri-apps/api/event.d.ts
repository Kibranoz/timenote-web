import type { EventName, EventCallback, UnlistenFn, Event } from './helpers/event';
/**
 * Listen to an event from the backend.
 *
 * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
 * @param handler Event handler callback.
 * @return A promise resolving to a function to unlisten to the event.
 */
declare function listen<T>(event: EventName, handler: EventCallback<T>): Promise<UnlistenFn>;
/**
 * Listen to an one-off event from the backend.
 *
 * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
 * @param handler Event handler callback.
 * @returns A promise resolving to a function to unlisten to the event.
 */
declare function once<T>(event: EventName, handler: EventCallback<T>): Promise<UnlistenFn>;
/**
 * Emits an event to the backend.
 *
 * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
 * @param [payload] Event payload
 * @returns
 */
declare function emit(event: string, payload?: unknown): Promise<void>;
export type { Event, EventName, EventCallback, UnlistenFn };
export { listen, once, emit };
