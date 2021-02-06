import React from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './components/Controls';
import Scene from './components/Scene';
import './App.css';
import FaceMapping from './face-mapping/FaceMapping';

const App: React.FC = () => (
  <FaceMapping>
    <Canvas shadowMap onCreated={({ gl }) => {
          gl.physicallyCorrectLights = true;
        }}>
      <Scene />
      <Controls />
    </Canvas>
  </FaceMapping>
);

export default App;
