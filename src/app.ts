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
