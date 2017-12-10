class Logger {
  constructor(tag) {
    this._tag = tag;
  }

  log(message) {
    console.log(this._formatMessage(message));
  }

  _formatMessage(message) {
    return this._tag ? `${this._tag}: ${message}` : message;
  }
}

export default Logger;
