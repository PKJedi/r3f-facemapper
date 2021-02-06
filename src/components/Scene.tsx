import React, { useEffect, useState, useMemo, useContext, useRef } from 'react';

import { Physics, usePlane, useBox } from '@react-three/cannon';

const culori = require('culori');

const colors = Array.from(Array(10).keys()).map((i) =>
  culori.random('lab', { l: 70 }),
);

function useColor(clicks: number) {
  const [color, setColor] = useState('#fff');

  const interpolator = useMemo(
    () =>
      culori.interpolate(
        [colors[clicks % colors.length], colors[(clicks + 1) % colors.length]],
        'lab',
      ),
    [clicks],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(
        culori.formatHex(interpolator((Math.sin(Date.now() / 200) + 1) / 2)),
      );
    }, 16);

    return () => {
      clearInterval(interval);
    };
  }, [interpolator]);

  return color;
}

type EventHandler = (event: any) => void;

type Props = {
  onClick?: EventHandler;
  rotation?: Array<number>;
  position?: Array<number>;
  args?: any;
};

function Plane({ onClick, args, rotation, position }: Props) {
  const [planeRef] = useBox(() => ({
    rotation,
    position,
    args,
  }));

  return (
    <mesh onClick={onClick} ref={planeRef} castShadow receiveShadow>
      <boxBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}

function Cube({ position }: { position: Array<number> }) {
  const [ref] = useBox(() => ({ position, mass: 1 }));

  const [clicks, setClicks] = useState(Date.now() % colors.length);
  const color = useColor(clicks);

  const onClick = (e: any) => {
    e.stopPropagation();
    setClicks(clicks + 1);
  };

  return (
    <mesh ref={ref} onClick={onClick} castShadow>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
}

const Scene: React.FC = () => {
  const [cubes, setCubes] = useState(4);

  const textureRef = useRef<THREE.CanvasTexture>();
  setInterval(() => {
    if (textureRef.current) {
      textureRef.current!.needsUpdate = true;
    }
  }, 50);

  return (
    <Physics>
      <ambientLight args={[0x707070]} />

      <pointLight
        position={[5, 1, 5]}
        castShadow
        intensity={5}
        shadow-mapSize-width={4056}
        shadow-mapSize-height={4056}
      />
      {document.querySelector('canvas#landmarks') && (
        <mesh
          position={[0, 1.5, 0]}
          scale={[1.5, 1.5, 1.5]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <sphereBufferGeometry attach="geometry" args={[1, 16, 12]} />
          <meshStandardMaterial attach="material">
            <canvasTexture
              ref={textureRef}
              attach="map"
              image={document.querySelector('canvas#landmarks')}
            />
          </meshStandardMaterial>
        </mesh>
      )}

      <Plane
        args={[10, 0.1, 10]}
        position={[0, -2, 0]}
        onClick={() => setCubes(cubes + 1)}
      />
      <Plane args={[100, 0.1, 100]} position={[0, -15, 0]} />
      {Array.from(Array(cubes).keys()).map((i) => (
        <Cube
          key={i}
          position={[Math.random(), Math.random(), Math.random()]}
        />
      ))}
    </Physics>
  );
};

export default Scene;
