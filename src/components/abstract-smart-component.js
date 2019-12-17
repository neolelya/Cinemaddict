import AbstractComponent from './abstract-component';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    this.getElement().remove();
    this.removeElement();

    const newElement = this.getElement();
    newElement.style.animation = `none`;

    document.body.appendChild(newElement);

    this.recoveryListeners();
  }
}
