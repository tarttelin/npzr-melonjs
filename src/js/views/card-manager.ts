import Player from "../model/player";
import Card from "../model/card";
import CardView from "./card-view";
import me from "../me";

class CardManager {
    private cards: Map<Card, CardView> =  new Map<Card, CardView>();
    constructor(players: Player[]) {
        players.forEach(player => {
            player.hand.observe.addCard.subscribe(card => {
                this.registerCard(card[0], player.isOpponent);
            });
        })
    }

    registerCard(card: Card, faceDown: boolean) {
        if (this.cards.has(card)) {
            return;
        }
        let view = new CardView(20, 60, card, faceDown);
        this.cards.set(card, view);
        me.game.world.addChild(view, this.cards.size);
    }

    lookup(card: Card) {
        return this.cards.get(card);
    }
}

export default CardManager;