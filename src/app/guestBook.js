const htmlTableRow = row => {
  const { timeStamp, name, comment } = row;
  return `<tr><td>${timeStamp}</td><td>${name}</td><td>${comment}</td></tr>`;
};

class GuestBook {
  #comments;
  constructor(comments) {
    this.#comments = comments;
  }

  addComment(comment) {
    this.#comments.unshift(comment);
  }

  toJson() {
    return JSON.stringify(this.#comments);
  }

  toHtml() {
    return this.#comments.map(htmlTableRow).join('');
  };
};

module.exports = { GuestBook };
