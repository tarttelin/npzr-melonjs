import me from '../me';
import Game from "../model/game";
import StackSlot from "../model/stack-slot";
import CardManager from "./card-manager";
import Card from "../model/card";
import CardView from "./card-view";

class StackSlotView extends me.DroptargetEntity {

    private readonly stackSlot: StackSlot;
    private game: Game;
    private cardManager: CardManager;

    constructor(x: number, y: number, game: Game, stackSlot: StackSlot, cardManager: CardManager) {
        super(x, y, { width: CardView.width() + 2, height: CardView.height() + 2 });
        this.cardManager = cardManager;
        this.x = x;
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
        this.color = 'white';
        this.stackSlot = stackSlot;
        this.game = this.game = game;
        this.setCheckMethod('containsCentre');
        stackSlot.observe.addCard.subscribe(card => {
            this.moveCardToSlot(card[0]);
        })
    }

    update() {
        return true;
    }

    draw(renderer: any) {
        renderer.setColor(this.color);
        renderer.stroke(new me.Rect(0, 0, this.width, this.height));
    }

    moveCardToSlot(card: Card) {
        console.log('move to slot');
        let view = this.cardManager.lookup(card);
        view.moveTo(this.x, this.pos.y + 2);
    }

    moveTo(x: number) {
        this.x = x;
        let y = this.pos.y;
        let tween = new me.Tween(this.pos).to({x: x, y: y }, 500);
        tween.start();
        this.stackSlot.cards.forEach(value => {
            let view = this.cardManager.lookup(value);
            view.moveTo(x, y);
        });
    }

    drop(e: any) {
        try {
            let totalStacks = this.game.player1.stacks.length + this.game.player2.stacks.length;
            this.game.activePlayer.playCard(e.card, this.stackSlot);
        } catch (err) {
            return;
        }
    }

    containsCentre(r: any) {
        let midWidth = r.width / 2;
        let midHeight = r.height / 2;
        return (
            r.left + midWidth >= this.left &&
            r.left + midWidth <= this.right &&
            r.top + midHeight >= this.top &&
            r.top + midHeight <= this.bottom
        );
    }
}

export default StackSlotView;