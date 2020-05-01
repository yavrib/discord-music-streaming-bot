export class Observable<T> {
    constructor(val: T) {
        this._value = val;
    }

    private _value: T;
    private subscribers: Function[] = [];

    set value(val: T) {
        this._value = val;

        this.subscribers.forEach((subscriber) => {
            subscriber(this._value);
        })
    }

    get value(): T {
        return this._value;
    }

    subscribe(fn: Function) {
        console.log(this.subscribers);
        this.subscribers.push(fn);
    }

    unsubscribeAll() {
        this.subscribers = [];
    }
}
