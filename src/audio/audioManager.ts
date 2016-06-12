// Beats start at 1
type Beat = number
type Tempo = number
type TimeSecs = number

interface Meta {
  tempo: Tempo
}

interface Event {
  time: TimeSecs
  event: Function
}

const WAAClock = require('waaclock')

const audioCtx = new AudioContext()
const clock = new WAAClock(audioCtx)
let source: AudioBufferSourceNode = null
let events: Event[] = []
let meta: Meta = null
let ready = false

export function initAudio(): void {
  source = audioCtx.createBufferSource()
  source.loop = true

  setupGraph()
}

function setupGraph(): void {
  source.connect(audioCtx.destination)
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
  events.forEach(event => {
    clock.setTimeout(event.event, event.time)
  })
}

function getTimeAtBeat(tempo: Tempo, beat: Beat): TimeSecs {
  const secsPerBeat = 60 / tempo
  return secsPerBeat * (beat - 1)
}

export function addEvent(beat: Beat, length: Beat, event: Function): void {
  events.push({
    time: getTimeAtBeat(meta.tempo, beat),
    event,
  })
}
