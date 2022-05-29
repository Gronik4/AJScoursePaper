/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';
import GameState from './GameState';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const GaSt = new GameState();

const stateService = new GameStateService(localStorage, GaSt);

const gameCtrl = new GameController(gamePlay, stateService, GaSt);
gameCtrl.init();

// don't write your code here
