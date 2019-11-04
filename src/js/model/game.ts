import {observe} from 'rxjs-observe';
import Deck from "./deck";
import Player, {PlayState} from "./player";
import StackSlot from "./stack-slot";
import Card, {BodyPart, Character} from "./card";
import DiscardPile from "./discard-pile";

class Game {
    player1: Player;
    player2: Player;
    deck: Deck;
    activePlayer: Player;
    discardPile: DiscardPile;

    constructor() {
        const initPlayer1 = () => {
            let { observables, proxy } = observe(new Player(this, false));
            this.player1 = proxy;
            this.player1.observe = observables;
            this.player1.playState = PlayState.Draw;
        };
        const initPlayer2 = () => {
            let { observables, proxy } = observe(new Player(this, true));
            this.player2 = proxy;
            this.player2.observe = observables;
            this.player2.playState = PlayState.Wait;
        };
        const initDeck = () => {
            let { observables, proxy } = observe(new Deck());
            this.deck = proxy;
            this.deck.observe = observables;
        };
        const initDiscardPile = () => {
            let { observables, proxy } = observe(new DiscardPile());
            this.discardPile = proxy;
            this.discardPile.observe = observables;
        }
        initPlayer1();
        initPlayer2();
        initDeck();
        initDiscardPile();
        this.activePlayer = this.player1;
        this.player1.observe.drawCard.subscribe(() => this.player1.playState = PlayState.Play);
        this.player1.observe.playCard.subscribe(args => this.transitionStatePlay(this.player1, args[0], args[1]));
        this.player2.observe.drawCard.subscribe(() => this.player2.playState = PlayState.Play);
        this.player2.observe.playCard.subscribe(args => this.transitionStatePlay(this.player2, args[0], args[1]));
    }

    deal() {
        for(let x = 1; x <= 5; x++) {
            this.player1.playState = PlayState.Draw;
            this.player2.playState = PlayState.Draw;
            this.player1.drawCard();
            this.player2.drawCard();
        }
        this.player1.playState = PlayState.Draw;
        this.player2.playState = PlayState.Wait;
    }

    transitionStatePlay(player: Player, card: Card, slot: StackSlot) {
        if (slot.parent.isCompleteStack()) {
            slot.parent.complete();
            player.playState = PlayState.Move;
        } else if (card.bodyPart === BodyPart.Wild || card.character === Character.Wild) {
            player.playState = PlayState.Play;
        } else {
            player.playState = PlayState.Wait;
            this.activePlayer = player === this.player1 && this.player2 || this.player1;
            this.activePlayer.playState = PlayState.Draw;
        }
        if (!player.hasEmptyStack()) {
            player.addStack();
        }
    }


    discard(cards: Card[]) {
        cards.forEach(card => this.discardPile.addCard(card));
    }
}

export default Game;