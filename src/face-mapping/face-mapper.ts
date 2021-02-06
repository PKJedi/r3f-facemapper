import * as faceapi from 'face-api.js';

const USE_TINY_MODEL = true;
const tinyFaceDetectorOptions = new faceapi.TinyFaceDetectorOptions();

export function loadModels() {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/weights'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('/weights'),
  ]);
}

export function detectFace(input: HTMLCanvasElement) {
  return faceapi
    .detectSingleFace(input, tinyFaceDetectorOptions)
    .withFaceLandmarks(USE_TINY_MODEL);
}
