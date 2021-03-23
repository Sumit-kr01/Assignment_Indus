class response {
  constructor(message, data) {
    this.message = message;
    this.data = data;
    this.error = null;
  }
}

module.exports = response;
