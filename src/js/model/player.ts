import Hand from "./hand";
import Stack from "./stack";
import StackSlot from "./stack-slot";
import Card from "./card";
import Game from "./game";
import { Observables, observe } from "rxjs-observe";

export enum PlayState {
    Draw,
    Play,
    Move,
    MoveThenPlay,
    Wait
}

class Player {
    hand: Hand;
    stacks: Stack[];
    playState: PlayState;
    observe: Observables<Player>;
    game: Game;
    isOpponent: boolean;

    constructor(game: Game, opponent: boolean = false) {
        this.game = game;
        this.stacks = [];
        const initHand = () => {
            let { observables, proxy } = observe(new Hand());
            this.hand = proxy;
            this.hand.observe = observables;
        };
        initHand();
        this.addStack();
        this.playState = PlayState.Play;
        this.isOpponent = opponent;
    }

    addStack() {
        this.stacks.push(new Stack(this));
    }

    drawCard() {
        if (this.playState !== PlayState.Draw) {
            throw new Error("Not your draw phase: " + this.playState);
        }
        this.hand.addCard(this.game.deck.draw());
    }

    playCard(card: Card, stackSlot: StackSlot) {
        if (this.playState === PlayState.Play) {
            if (card.parent === this.hand) {
                stackSlot.addCard(card);
            }
        } else if (this.playState === PlayState.Move) {
            if (card.parent !== this.hand) {
                let sourceSlot = card.parent;
                try {
                    stackSlot.addCard(card);
                } catch (err) {
                    sourceSlot.addCard(card);
                    throw err;
                }
            } else {
                throw new Error("Cannot move a card in your hand");
            }
        }
    }

    hasEmptyStack() {
        let emptyStacks = this.stacks.filter((value) => value.torso.cards.length === 0 && value.head.cards.length === 0 && value.legs.cards.length === 0);
        return emptyStacks.length > 0;
    }

    completed(cards: Card[][]) {
        this.game.discard(cards.flat());
    }
}

export default Player;