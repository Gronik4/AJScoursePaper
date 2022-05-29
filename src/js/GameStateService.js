export default class GameStateService {
  constructor(storage, gaSt) {
    this.storage = storage;
    this.gS = gaSt;
  }

  save() {
    const state = this.gS.preparingSave();
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
