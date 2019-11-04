import Game from './game';
import {PlayState} from "./player";

describe('game setup', () => {
    let game = new Game();
    game.deal();

    test('start with 2 players, one of which is the opponent', () => {
        expect(game.player1).toBeDefined();
        expect(game.player2).toBeDefined();
        expect(game.activePlayer).toEqual(game.player1);
        expect(game.player1.isOpponent).toBeFalsy();
        expect(game.player2.isOpponent).toBeTruthy();
    });

    test('Each player starts with 5 cards drawn from the deck', () => {
        expect(game.player1.hand.cards.length).toEqual(5);
        expect(game.player2.hand.cards.length).toEqual(5);
        expect(game.deck.cards.length).toEqual(46);
    });

    test('Player 1 can draw a card, Player 2 does nothing', () => {
        expect(game.player1.playState).toEqual(PlayState.Draw);
        expect(game.player2.playState).toEqual(PlayState.Wait);
    });

    test('')
});