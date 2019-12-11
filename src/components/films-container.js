import AbstractComponent from './abstract-component';

const createFilmsContainerTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmsContainer extends AbstractComponent {
  getTemplate() {
    return createFilmsContainerTemplate();
  }
}
