const audioCtx = new AudioContext()
let ready = false

const source = audioCtx.createBufferSource()
source.connect(audioCtx.destination)

export function loadAudio(): Promise<boolean> {
  return fetch('assets/break-trim.wav')
    .then(response => response.arrayBuffer())
    .then(audioData => audioCtx.decodeAudioData(audioData))
    .then(buffer => {
      source.buffer = buffer
      ready = true
    })
    .then(() => true)
    .catch(() => false)
}

function checkReady(): void {
  if (!ready) {
    throw new Error('Audio not loaded')
  }
}

export function play(): void {
  checkReady()
  source.start(0)
}
