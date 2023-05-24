class QueueWithMaxLength {
  constructor(maxLen = 10) {
    this.queue = [];
    this.maxLen = maxLen;
    this.lastitem=0
  }

  // add to the END of the array
  push = function(item) {
    this.queue.push(item);
    if (this.queue.length > this.maxLen) {
      this.queue.shift();
    }
    this.lastitem=item;
  }

  // returns the element at the BEGINNING of the array
  poop = function() {
    return this.queue.shift();
  }

  size = function() {
    return this.queue.length;
  }

  // returns element at the BEGINNING of the array (the oldest pushed value)
  last = function() {
    if (this.queue.length === 0) return 0;
    return this.lastitem;
  }

  clear= function() {
    this.queue = [];
    this.lastitem=0;
  }

  computeMean= function() {
    if (this.queue.length === 0) return 0;
    const sum = this.queue.reduce((acc, item) => acc + item, 0);
    return sum / this.queue.length;
  }

  computeSD= function() {
    if (this.queue.length === 0) return 0;
    const mean = this.computeMean();
    const squaredDifferences = this.queue.map((item) => (item - mean) ** 2);
    const variance =
      squaredDifferences.reduce((acc, item) => acc + item, 0) /
      this.queue.length;
    return Math.sqrt(variance);
  }
}

export default QueueWithMaxLength;
