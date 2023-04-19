class QueueWithMaxLength {
  constructor(maxLen = 10) {
    this.queue = [];
    this.maxLen = maxLen;
  }

  push(item) {
    this.queue.push(item);
    if (this.queue.length > this.maxLen) {
      this.queue.shift();
    }
  }

  poop() {
    return this.queue.shift();
  }

  size() {
    return this.queue.length;
  }

  peek() {
    if (this.queue.length === 0) return 0;
    return this.queue[0];
  }

  clear() {
    this.queue = [];
  }

  computeMean() {
    if (this.queue.length === 0) return 0;
    const sum = this.queue.reduce((acc, item) => acc + item, 0);
    return sum / this.queue.length;
  }

  computeSD() {
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
