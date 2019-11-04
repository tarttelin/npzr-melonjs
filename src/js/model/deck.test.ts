import Deck from "./deck";
import {BodyPart, Character} from "./card";
import Hand from "./hand";
import CardContainer from "./card-container";

describe('The deck', () => {
    test('should contain 56 cards', () => {
        const deck = new Deck();
        expect(deck.cards.length).toEqual(56);
    });

    test('should contain 4 of each characters body parts', () => {
        const deck = new Deck();
        expect(deck.cards.filter(c => c.bodyPart === BodyPart.Legs && c.character === Character.Zombie).length).toEqual(4);
    });

    test('cards should be shuffled', () => {
        const deck1 = new Deck();
        const deck2 = new Deck();
        let differenceFound = false;
        deck1.cards.forEach( (c, idx) => {
            differenceFound = differenceFound || (c.idx !== deck2.cards[idx].idx);
        });
        expect(differenceFound).toBeTruthy();
    });

    test('card can be drawn from the deck', () => {
        const deck = new Deck();
        let card = deck.draw();
        expect(deck.cards.length).toEqual(55);
        expect(deck.cards.includes(card)).toBeFalsy();
    });

    test('cards in the deck can be observed', () => {
        const deck = new Deck();
        const hand = new Hand();
        let card = deck.draw();
        let parent: CardContainer = undefined;
        card.observe.parent.subscribe(value => parent = value);
        card.parent = hand;
        expect(parent).toEqual(hand);
    })
});