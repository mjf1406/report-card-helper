import EventEmitter from "events";

type Func = () => void;

export interface IEventBus {
  on(event: string, listener: (...args: Func[]) => void): this;
  off(event: string, listener: (...args: Func[]) => void): this;
  emit(event: string, ...args: Func[]): boolean;
}

const EventBus: IEventBus = new EventEmitter();
export default EventBus;
