/**
 * Producer は Stream でブロードキャストされるイベントを生み出すもの
 */
interface Producer<T> {
  /** イベントの生成をはじめる */
  start(listener: Listener<T>): void;
  /** イベントの生成をおわる */
  stop(): void;
}

interface Listener<T> {
  /** Stream から値が流れてきたときに呼び出される */
  next(x: T): void;
  /** Stream でエラーが発生したときに呼び出される */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(err: any): void;
  /** Stream が停止したときに呼び出される */
  complete(): void;
}

const NO = {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (): void => {};

/**
 * 複数の Listener をもつイベントエミッタ
 * Stream でイベントが発火したとき、すべての Listener に同時に広められる
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Stream<T> implements Listener<T> {
  private internalListeners: Array<Listener<T>> = [];
  private debugListener?: Listener<T>;
  private err = NO;
  /** imitation target if this Stream will imitate */
  private target?: Stream<T>;
  private stopID?: number;

  constructor(private producer?: Producer<T>) {}

  next(value: T): void {
    if (this.debugListener !== void 0) this.debugListener.next(value);
    for (const listener of this.internalListeners) listener.next(value);
  }

  error(): void {
    if (this.err !== NO) return;
    this.tearDown();
  }

  complete(): void {
    this.tearDown();
    if (this.debugListener !== void 0) this.debugListener.complete();
    for (const listener of this.internalListeners) listener.complete();
  }

  /** tear down logic, after error or complete */
  private tearDown(): void {
    if (this.internalListeners.length === 0) return;
    if (this.producer !== void 0) this.producer.stop();
    this.err = NO;
    this.internalListeners = [];
  }

  private stopNow(): void {
    if (this.producer === void 0)
      throw new Error(
        'producer が登録されていない状態での stopNow メソッドの呼び出しは禁止されています'
      );
    this.producer.stop();
    this.err = NO;
    this.stopID = void 0;
  }

  /** Adds a Listener to the Stream. */
  addListener(listener: Partial<Listener<T>>): void {
    const internalListener: Listener<T> = {
      next: listener.next || noop,
      error: listener.error || noop,
      complete: listener.complete || noop
    };

    if (this.target !== void 0) {
      this.target.addListener(listener);
      return;
    }

    this.internalListeners.push(internalListener);

    if (this.internalListeners.length > 1) return;

    if (this.stopID !== void 0) {
      clearTimeout(this.stopID);
      this.stopID = void 0;
      return;
    }

    if (this.producer !== void 0) this.producer.start(this);
  }

  removeListener(listener: Listener<T>): void {
    if (this.target !== void 0) {
      this.target.removeListener(listener);
      return;
    }

    const i = this.internalListeners.indexOf(listener);
    if (i === -1) return;

    this.internalListeners.splice(i, 1);

    if (this.producer !== void 0 && this.internalListeners.length <= 0) {
      this.err = NO;
      this.stopID = setTimeout(() => this.stopNow());
    }
  }
}
