class Node {
  constructor(datum) {
    Object.defineProperty(this, 'datum', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: datum,
    });

    this.next = null;
  }
}

module.exports = Node;
