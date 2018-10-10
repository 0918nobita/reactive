import { Subscriber } from 'rxjs';

// Subscriber の作成
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
