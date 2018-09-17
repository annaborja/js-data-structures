const createNode = require('./create_node');

function search(datum, node, foundFn, prevNode = null) {
  if (!node) {
    return false;
  }

  // TODO: Allow for checking for deep equality in addition to object identity.
  if (Object.is(node.datum, datum)) {
    return foundFn(node, prevNode);
  }

  return search(datum, node.next, foundFn, node);
}

const proto = {
  *[Symbol.iterator]() {
    for (let node = this.head; !!node; node = node.next) {
      yield node.datum;
    }

    return null;
  },

  *reverseIterator() {
    let node = this.tail;

    if (!node) {
      return null;
    }

    for (let prevNode = this.head; !Object.is(node, this.head); node = prevNode, prevNode = this.head) {
      while (!Object.is(prevNode.next, node)) {
        prevNode = prevNode.next;
      }

      yield node.datum;
    }

    yield node.datum;

    return null;
  },

  append(datum) {
    const node = createNode(datum);

    if (this.tail) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = this.head;
    }

    this.size++;
  },

  prepend(datum) {
    const node = createNode(datum);

    if (this.head) {
      node.next = this.head;
      this.head = node;
    } else {
      this.head = node;
      this.tail = this.head;
    }

    this.size++;
  },

  contains(datum) {
    return search(datum, this.head, () => true);
  },

  remove(datum) {
    return search(datum, this.head, (function(node, prevNode) {
      if (!prevNode) {
        if (Object.is(this.head, this.tail)) {
          this.head = null;
          this.tail = null;
        } else {
          this.head = this.head.next;
        }
      } else {
        prevNode.next = node.next;

        if (!prevNode.next) {
          this.tail = prevNode;
        }
      }

      this.size--;

      return true;
    }).bind(this));
  },

  reverse() {
    let prevNode = null;

    for (let node = this.head, nextNode = null; !!node; prevNode = node, node = nextNode) {
      nextNode = node.next;
      node.next = prevNode;
    }

    this.tail = this.head;
    this.head = prevNode;
  },
};

function createSinglyLinkedList(data = []) {
  const list = Object.assign(Object.create(proto), {
    head: null,
    tail: null,
    size: 0,
  });

  [...data].forEach(datum => list.append(datum));

  return list;
}

module.exports = createSinglyLinkedList;
