/*
  The queue is constructed with arguments for
    maxLen - the number of past values stored before they fall off the end
    norm1, norm2 used to normalize the values stored between 0 (mapped from norm1) and 1 (mapped to from norm 2)
        - the stored values are clipped if the mapped value is outside the range [0,1]
    sdnorm1, sdnorm2 - values for normalizing the standard deviation
*/
//---- normalize [minx, maxx] to [0,1], return scaled x
function normalize(x, minx, maxx ) {  // just used for drawing on display
  //range expected from instrument (high violin string is tunded to 659 Hz)
    return Math.min(1,Math.max(0,(x - minx) / (maxx - minx)))
  }
  
function mean(a){
  if (a.length === 0) return 0;
  const sum = a.reduce((acc, item) => acc + item, 0);
  return sum / a.length;  
}

//##############################################################################
class QueueWithMaxLength {
  constructor(maxLen = 10, norm1, norm2, sdnorm1, sdnorm2) {
    this.queue = [];
    this.maxLen = maxLen;
    this.norm1 =  norm1;
    this.norm2 = norm2;
    this.sdnorm1 = sdnorm1;
    this.sdnorm2 = sdnorm2;
    this.lastitem=0
  }

  // add to the END of the array
  push = function(item) {
    item = normalize(item, this.norm1, this.norm2)  // normalize before storing on queue

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

  // returns element at the END of the array (the newest pushed value)
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
    // if the queue elemens are themselves arrays (eg MFCCs), get the mean of each and then return the average
    if (Array.isArray(this.queue[0])) { 
      let means=[]
      for(let n=0; n<this.queue.length; n++){
        means.push(mean(this.queue.map(array => array[n]))); // get the mean of the nth row across the stored (collumn) arrays
      }
      return means // vector of means
    } else { // just return the mean of the numbers in the queue
      return mean(this.queue)
    }
  }



  computeSD= function() {
    if (this.queue.length === 0) return 0;
    const mean = this.computeMean();
    const squaredDifferences = this.queue.map((item) => (item - mean) ** 2);
    const variance =
      squaredDifferences.reduce((acc, item) => acc + item, 0) /
      this.queue.length;
    return normalize( Math.sqrt(variance), this.sdnorm1, this.sdnorm2)
  }
}

export default QueueWithMaxLength;
