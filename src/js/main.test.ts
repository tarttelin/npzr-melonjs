import { observe } from 'rxjs-observe';

test('watch stuff', () => {
    let bod = new Foo('Bill Bailey', 47);
    let result = 0;
    const { observables, proxy } = observe(bod);
    let subscription = observables.age.subscribe(value => result = value);
    observables.addBod.subscribe( value => console.log(`callback on ${value}`));
    proxy.age = 15;
    expect(result).toBe(15);
    subscription.unsubscribe();
    try {
        proxy.addBod('finbar');
    } catch (err) {
        // swallow
    }
});

class Foo {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    addBod(name: string) {
        console.log(name);
        throw new Error("boo");
    }
}