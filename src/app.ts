import { Subscriber } from 'rxjs';

/*
  Subscription
  Represents a disposable resource, such as the execution of an Observable.
  A Subscription has one important method, unsubscribe, that takes no argument
  and just disposes the resource held by the subscription.

  Additionally, subscriotions may be grouped together through the add() method,
  which will attach a child Subscription to the current Subscription.
  When a Subscription is unsubscribed, all its children (and its grandchildren)
  will be unsubscribed as well.
 */

/*
  Subscriber (extends Subscription)
  Observer インターフェースを実装し、Subject クラスを継承しています。
  Observer が Observable の値を消費するための public API であるのに対し、
  例えば unsubscribe メソッドのように、Subscription のような機能を提供するために、
  すべての Observer が Subscriber に変換されます。
  Subscriber は RxJS において汎用的な型であり、オペレータの実装において重要な役割を担っていますが、
  public API として利用されることは稀です。
 */

const subscriber = new Subscriber<number>(
    (value) => console.log('Next: ' + value),
    (error) => console.error(error),
    () => console.log('Completed.'));

subscriber.next(1);
subscriber.next(2);
// subscriber.error(new Error('いyarn'));
// subscriber.complete();
// subscriber.unsubscribe();
subscriber.next(3);

/*
  TeardownLogic
  This interface describes what should be returned by function passed to Observable constructor
  or static create function.
  Value of that interface will be used to cancel subscription for given Observable.

  TeardownLogic can be:

  1. Function
    Function that takes no parameters. When consumer of created Observable calls unsubscribe,
    that function will be called.

  2. AnonymousSubscription
    AnonymousSubscription is simply an object with unsubscribe method on it.
    That method will work the same as function.

  3. void
    If created Observable does not have any resources to clean up,
    function does not have to return anything.
 */

subscriber.add(() => {
  console.log('Teardown Logic');
});

/*
  Observable<T>
  A representation of any set of values over any amount of time.
  This is the most basic building block of RxJS.
 */

/*
  Subject (extends Observable)
  A Subject is a special type of Observable that allows values to be multicasted to
  many Observables. Subjects are like EventEmitters.
 */

/*
  SubjectSubscriber (extends Subscriber)
  constructor がオーバーライドされているだけで、他の仕様は Subscriber 同様
 */
