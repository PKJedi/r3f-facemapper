import React from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './components/Controls';
import Scene from './components/Scene';
import './App.css';

const App: React.FC = () => (
  <Canvas>
    <Scene />
    <Controls />
  </Canvas>
);

export default App;
