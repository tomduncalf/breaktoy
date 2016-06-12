// Beats start at 1
type Beat = number
type Tempo = number
type TimeSecs = number

interface Meta {
  tempo: Tempo
  loopTime: TimeSecs
}

interface TimedEvent {
  time: TimeSecs
  event: Event
}

interface Event {
  type: 'delay'
  value: number
}

const WAAClock = require('waaclock')

const audioCtx = new AudioContext()
const clock = new WAAClock(audioCtx)

const source: AudioBufferSourceNode = audioCtx.createBufferSource()

const delay: DelayNode = audioCtx.createDelay(1.0)
delay.delayTime.value = 0.005

const delayInGain: GainNode = audioCtx.createGain()
delayInGain.gain.value = 0

const delayGain: GainNode = audioCtx.createGain()
delayGain.gain.value = 1

const feedback: GainNode = audioCtx.createGain()
feedback.gain.value = 0.8

let events: TimedEvent[] = []
let meta: Meta = null
let ready = false

export function initAudio(): void {
  source.loop = true

  setupGraph()
}

function setupGraph(): void {
  source.connect(delayInGain)

  delayInGain.connect(delay)
  delay.connect(delayGain)
  delay.connect(feedback)
  feedback.connect(delay)

  source.connect(audioCtx.destination)
  delayGain.connect(audioCtx.destination)
}

export function loadAudio(): Promise<boolean> {
  return fetch('assets/break-trim.wav')
    .then(response => response.arrayBuffer())
    .then(audioData => audioCtx.decodeAudioData(audioData))
    .then(buffer => {
      meta = getMeta(buffer)
      source.buffer = buffer
      ready = true
    })
    .then(() => true)
    .catch(() => false)
}

function getMeta(buffer: AudioBuffer): Meta {
  const beats = 4

  return {
    tempo: beats / buffer.duration * 60,
    loopTime: buffer.duration,
  }
}

function checkReady(): void {
  if (!ready) {
    throw new Error('Audio not loaded')
  }
}

export function play(): void {
  checkReady()
  setupClock()
  source.start(0)
}

function setupClock(): void {
  clock.start()

  let loopCount = 0
  clock.setTimeout(() => {
    loopCount++
    setupEvents(loopCount)
  }, meta.loopTime).repeat(meta.loopTime)
  setupEvents(0)
}

function setupEvents(loopCount: number): void {
  events.forEach(event => {
    clock.setTimeout(() => {
      const time = loopCount * meta.loopTime + event.time
      delayInGain.gain.setValueAtTime(event.event.value, time)
      delay.delayTime.setValueAtTime(Math.random() * 0.15, time)
      feedback.gain.setValueAtTime((Math.random() * 0.4) + 0.5, time)
    }, event.time)
  })
}

function getTimeAtBeat(tempo: Tempo, beat: Beat): TimeSecs {
  const secsPerBeat = 60 / tempo
  return secsPerBeat * (beat - 1)
}

export function addEvent(beat: Beat, length: Beat, event: Event): void {
  events.push({
    time: getTimeAtBeat(meta.tempo, beat),
    event,
  })
}
