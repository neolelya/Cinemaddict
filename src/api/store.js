export default class Store {
  constructor(key, storage) {
    this._storeKey = key;
    this._storage = storage;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  getItem(id) {
    return Object.values(this.getAll())
      .filter((movie) => movie.id === id);
  }

  setItem(key, value) {
    const store = this.getAll();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(Object.assign({}, store, {[key]: value}))
    );
  }
}
