const audioCtx = new AudioContext()

let source
// var dilla = new Dilla(audioCtx, {})

function getData(): void {
  source = audioCtx.createBufferSource()
  source.playbackRate.value = 0.5

  const request = new XMLHttpRequest()

  const delay = audioCtx.createDelay(1.0)
  delay.delayTime.value = 0.005

  const delayGain = audioCtx.createGain()
  delayGain.gain.value = 0

  const sourceGain = audioCtx.createGain()
  delayGain.gain.value = 0

  const feedback = audioCtx.createGain()
  feedback.gain.value = 1

  request.open('GET', 'assets/break-trim.wav', true)

  request.responseType = 'arraybuffer'

  request.onload = function(): any {
    const audioData = request.response

    audioCtx.decodeAudioData(audioData).then(function(buffer: AudioBuffer): void {
      // dilla.setTempo(buffer.duration * 1000 / 4 * 60)

      source.buffer = buffer

      delay.connect(feedback)
      feedback.connect(delay)

      source.connect(delay)
      source.connect(sourceGain)
      sourceGain.connect(audioCtx.destination)

      delay.connect(delayGain)
      delayGain.connect(audioCtx.destination)

      delay.delayTime.value = buffer.duration * 1000 / 32

      /*setInterval(function() {
        //delay.delayTime.value = delay.delayTime.value ? 0 : 0.5
        delayGain.gain.value = delayGain.gain.value ? 0 : 1
        sourceGain.gain.value = sourceGain.gain.value ? 1 : 0
      }, buffer.duration * 1000 / 8)*/

      source.loop = true
    })

  }

  /*dilla.on('step', function (step) {
    console.log('step')
    if (step.event === 'start') {
      source.start(0)
    }
  })*/

  request.send()
}

// wire up buttons to stop and play audio

getData()

export function play() {
  source.start(0)
}