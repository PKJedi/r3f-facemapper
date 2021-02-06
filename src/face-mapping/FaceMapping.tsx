import {
  draw,
  FaceDetection,
  FaceLandmarks68,
  matchDimensions,
  resizeResults,
  WithFaceLandmarks,
} from 'face-api.js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { detectFace, loadModels } from './face-mapper';

type Props = {
  children: any;
};

export default function FaceMapping({ children }: Props) {
  const [modelsLoaded, setModelsLoaded] = useState<null | boolean>(null);
  const [faceMapping, setFaceMapping] = useState<
    undefined | WithFaceLandmarks<{ detection: FaceDetection }, FaceLandmarks68>
  >(undefined);
  const webcamRef = useRef<Webcam | null>(null);

  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(function () {
    loadModels().then(function () {
      setModelsLoaded(true);
    });
  }, []);

  const getFaceMapping = useCallback(
    function () {
      if (!webcamRef.current) {
        return Promise.resolve();
      }
      const canvas = webcamRef.current.getCanvas();
      if (!canvas) {
        return Promise.resolve();
      }
      return detectFace(canvas).then(function (detection) {
        setFaceMapping(detection);
        return detection;
      });
    },
    [setFaceMapping],
  );

  useEffect(
    function () {
      if (modelsLoaded && webcamRef.current) {
        const refresh = async () => {
          await getFaceMapping();
          requestAnimationFrame(refresh);
        };
        refresh();
      }
    },
    [modelsLoaded],
  );

  useEffect(
    function () {
      if (!webcamRef.current) {
        return;
      }
      const input = webcamRef.current.getCanvas();
      if (input && faceMapping && overlayRef.current) {
        const displaySize = { width: input.width, height: input.height };
        matchDimensions(overlayRef.current, displaySize);
        const resizedResults = resizeResults(faceMapping, displaySize);
        const ctx = overlayRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(
            0,
            0,
            overlayRef.current.width,
            overlayRef.current.height,
          );
        }
        draw.drawFaceLandmarks(overlayRef.current, resizedResults);
      }
    },
    [faceMapping],
  );

  return (
    <>
      <Webcam
        id="webcam"
        style={{ position: 'absolute', opacity: 0 }}
        ref={webcamRef}
        width={480}
        height={270}
      />
      <canvas
        id="landmarks"
        style={{ position: 'absolute', opacity: 0 }}
        ref={overlayRef}
      ></canvas>
      {children}
    </>
  );
}
