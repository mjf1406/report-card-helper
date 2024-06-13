// EventBus.js
import EventEmitter from "events";

export interface IEventBus {
  on(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): boolean;
}

const EventBus: IEventBus = new EventEmitter();
export default EventBus;
