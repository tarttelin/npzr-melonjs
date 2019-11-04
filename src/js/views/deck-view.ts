import me from '../me';
import Deck from "../model/deck";
import Game from "../model/game";
import CardView from "./card-view";

class DeckView extends me.Entity {
    constructor(x: number, y: number, deck: Deck, game: Game) {
        super(x, y, { image: 'cardFront', width: 400, height: 200});
        this.alwaysUpdate = true;
        this.deck = deck;
        this.game = game;
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
        this.renderable.scale(CardView.width() / 400.0, CardView.height() / 200.0);
        this.resize(CardView.width(), CardView.height());
        this.renderable.addAnimation('back', [4]);
        this.renderable.setCurrentAnimation('back');
        this.renderable.autoTransform = true;
    }

    onActivateEvent() {
        me.input.registerPointerEvent('pointerdown', this, this.drawCard.bind(this));
    }

    drawCard(pointer?: any) {
        this.game.activePlayer.drawCard();
        return false;
    }
}

export default DeckView;