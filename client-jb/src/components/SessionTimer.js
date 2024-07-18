// TimerManager.js
class TimerManager {
  constructor() {
    this.interval = null
    this.elapsedTime = 0 // Time in seconds
    this.callbacks = []
    this.isRunning = false
  }

  isRunning = false

  start() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.elapsedTime++
        this.callbacks.forEach((callback) => callback(this.elapsedTime))
      }, 1000)
    }
    this.isRunning = true
  }

  pause() {
    clearInterval(this.interval)
    this.interval = null
    this.isRunning = false
  }

  reset() {
    this.pause()
    this.elapsedTime = 0
    this.callbacks.forEach((callback) => callback(this.elapsedTime))
  }

  subscribe(callback) {
    this.callbacks.push(callback)
  }

  unsubscribe(callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
  }
}

// Exporting as a singleton
export const timer = new TimerManager()
