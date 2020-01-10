export default class Comments {
  constructor(comment) {
    this.id = comment[`id`];
    this.author = comment[`author`];
    this.comment = comment[`comment`];
    this.date = comment[`date`] ? new Date(comment[`date`]) : null;
    this.emotion = comment[`emotion`];
  }

  static parseComment(data) {
    return new Comments(data);
  }

  static parseComments(data) {
    return data.map(Comments.parseComment);
  }
}
