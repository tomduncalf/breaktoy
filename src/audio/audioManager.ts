// Beats start at 1
type Beat = number
type Tempo = number
type TimeSecs = number
type Decimal = number

export type EffectType = 'delay'

interface Meta {
  tempo: Tempo
  loopTime: TimeSecs
}

interface TimedEvent {
  time: TimeSecs
  event: Event
  linkedEvent?: TimedEvent
}

interface Event {
  type: EffectType
  xValue: Decimal
  yValue: Decimal
  level?: Decimal
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

let events: Map<string, TimedEvent> = new Map()
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
  for (let [key, event] of events) {
    clock.setTimeout(() => {
      const time = loopCount * meta.loopTime + event.time
      delayInGain.gain.setValueAtTime(event.event.level, time)
      console.log(event.event)
      delay.delayTime.setValueAtTime(0.0001 + (event.event.xValue * 0.1), time)
      feedback.gain.setValueAtTime(event.event.yValue * 0.98, time)
    }, event.time)
  }
}

function getTimeAtBeat(tempo: Tempo, beat: Beat): TimeSecs {
  const secsPerBeat = 60 / tempo
  return secsPerBeat * (beat - 1)
}

export function addEvent(beat: Beat, length: Beat, event: Event): void {
  const key = beat.toString()
  const offKey = beat + '_off'

  const offEvent = {
    time: getTimeAtBeat(meta.tempo, beat + length),
    event: Object.assign({}, event, { level: 0 }),
  }

  events.set(key, {
    time: getTimeAtBeat(meta.tempo, beat),
    event: Object.assign({}, event, { level: 1 }),
    linkedEvent: offEvent,
  })

  events.set(offKey, offEvent)
}

export function clearEvent(beat: Beat): void {
  events.delete(beat.toString())
}

export function updateEvent(beat: Beat, xValue: Decimal, yValue: Decimal): void {
  const key = beat.toString()
  const newEvent = Object.assign({}, events.get(key))

  newEvent.event.xValue = xValue
  newEvent.event.yValue = yValue

  events.set(key, newEvent)

  console.log(events)
}
