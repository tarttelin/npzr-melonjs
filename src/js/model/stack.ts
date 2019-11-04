import StackSlot from "./stack-slot";
import {observe} from "rxjs-observe";
import Card, {BodyPart, Character} from "./card";
import Player from "./player";

class Stack {
    head: StackSlot;
    torso: StackSlot;
    legs: StackSlot;
    owner: Player;

    constructor(owner: Player) {
        this.owner = owner;
        const initHead = (stack: Stack) => {
            let stackSlot = new StackSlot(stack, BodyPart.Head);
            const { observables, proxy } = observe(stackSlot);
            this.head = proxy;
            stackSlot.observe = observables;
        };
        const initTorso = (stack: Stack) => {
            let stackSlot = new StackSlot(stack, BodyPart.Torso);
            const { observables, proxy } = observe(stackSlot);
            this.torso = proxy;
            stackSlot.observe = observables;
        };
        const initLegs = (stack: Stack) => {
            let stackSlot = new StackSlot(stack, BodyPart.Legs);
            const { observables, proxy } = observe(stackSlot);
            this.legs = proxy;
            stackSlot.observe = observables;
        };
        initHead(this);
        initTorso(this);
        initLegs(this);
    }

    validatePlay(card: Card, position: BodyPart) {
        if(card.bodyPart !== BodyPart.Wild && card.bodyPart !== position) {
            console.log('illegal move');
            throw new Error("Can't do that!");
        }
    }

    isCompleteStack() {
        if (this.head.cards.length === 0 || this.torso.cards.length === 0 || this.legs.cards.length === 0) {
            return false;
        }
        let tops = [this.head.cards[this.head.cards.length - 1], this.torso.cards[this.torso.cards.length - 1], this.legs.cards[this.legs.cards.length - 1]];
        let characters = tops.filter(card => card.character !== Character.Wild).map(c => c.character);
        return characters.every(c => c === characters[0]);
    }

    complete() {
        if (this.isCompleteStack()) {
            let cards = [this.head.cards, this.torso.cards, this.legs.cards];
            this.owner.completed(cards);
        }
    }
}

export default Stack;