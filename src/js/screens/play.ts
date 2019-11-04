import me from '../me';
import Game from '../model/game';
import DeckView from '../views/deck-view';
import PlayerView from "../views/player-view";
import CardManager from "../views/card-manager";
import CardView from "../views/card-view";
import DiscardPileView from "../views/discard-pile-view";

class PlayScreen extends me.Stage {
    private playerView: PlayerView;
    private opponentView: PlayerView;

    onResetEvent() {
        // reset the score
        this.game = new Game();
        this.cardManager = new CardManager([this.game.player1, this.game.player2]);
        this.playerView = new PlayerView(this.game.player1, this.game, this.cardManager);
        this.opponentView = new PlayerView(this.game.player2, this.game, this.cardManager);

        me.game.world.addChild(new me.ColorLayer("background", "#003400", 0), 0);

        me.game.world.addChild(new DeckView(CardView.width() / 3,
            me.game.viewport.height / 2 - CardView.height() / 2,
            this.game.deck, this.game), 1);
        me.game.world.addChild(new DiscardPileView(CardView.width() / 3,
            me.game.viewport.height / 2 + CardView.height() / 2 + 10,
            this.cardManager, this.game.discardPile), 1);

        this.game.deal();
    }

    onDestroyEvent() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
}

export default PlayScreen;