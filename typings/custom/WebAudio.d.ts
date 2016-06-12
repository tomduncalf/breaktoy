interface AudioContext {
  decodeAudioData(audioData: ArrayBuffer, successCallback?: any, errorCallback?: any): Promise<AudioBuffer>;
}
