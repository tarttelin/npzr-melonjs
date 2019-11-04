import Card, {BodyPart, Character} from "./card";
import {Observables, observe} from "rxjs-observe";

class Deck {
    cards: Card[];
    observe: Observables<Deck>;

    constructor() {
        let idx = 0;
        this.cards = [];
        [Character.Ninja, Character.Pirate, Character.Zombie, Character.Robot, Character.Wild].forEach(character => {
            [BodyPart.Head, BodyPart.Torso, BodyPart.Legs, BodyPart.Wild].forEach(bodyPart => {
                if (character === Character.Wild || bodyPart === BodyPart.Wild) {
                    let { observables, proxy } = observe(new Card(character, bodyPart, ++idx));
                    proxy.observe = observables;
                    this.cards.push(proxy);
                } else {
                    for(let i = 0; i < 4; i++) {
                        let { observables, proxy } = observe(new Card(character, bodyPart, ++idx));
                        proxy.observe = observables;
                        this.cards.push(proxy);
                    }
                }
            })
        });
        this.shuffle();
    }

    draw() {
        return this.cards.pop();
    }

    private shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

export default Deck;