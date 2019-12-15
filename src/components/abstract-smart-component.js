import AbstractComponent from './abstract-component';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    this.getElement().remove();
    this.removeElement();

    document.body.appendChild(this.getElement());

    this.recoveryListeners();
  }
}
