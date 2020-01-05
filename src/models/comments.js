export default class Comments {
  constructor(comment) {
    this.author = comment[`author`];
    this.comment = comment[`comment`];
    this.date = comment[`date`];
    this.emotion = comment[`emotion`];
  }

  parseComment(data) {
    return new Comments(data);
  }

  parseComments(data) {
    return data.map(Comments.parseComment);
  }
}
