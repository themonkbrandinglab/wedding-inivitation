import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function Flame({ lit }: { lit: boolean }) {
  const flame = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (flame.current) {
      flame.current.rotation.z = Math.sin(t * 7) * .075 + Math.sin(t * 3.7) * .045;
      const target = lit ? 1 : .04;
      flame.current.scale.lerp(new THREE.Vector3((.91 + Math.sin(t * 9) * .07) * target, (1 + Math.sin(t * 5.8) * .12) * target, target), Math.min(1, delta * 3));
    }
    if (light.current) light.current.intensity = lit ? 3.8 + Math.sin(t * 8) * .4 + Math.sin(t * 13) * .2 : .03;
  });
  return <>
    <ambientLight intensity={.4} />
    <pointLight ref={light} position={[0, .4, 1]} color="#ffae50" distance={8} decay={2} />
    <group ref={flame} position={[0, -.45, 0]}>
      <mesh position={[0, .25, 0]} scale={[.21, .57, .19]} rotation-z={-.08}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#e57428" transparent opacity={.5} depthWrite={false} />
      </mesh>
      <mesh position={[0, .13, .08]} scale={[.115, .42, .105]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#ffcf69" transparent opacity={.9} />
      </mesh>
      <mesh position={[0, -.12, .12]} scale={[.075, .14, .06]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#527aa4" />
      </mesh>
    </group>
  </>;
}

export default function FlameScene({ lit }: { lit: boolean }) {
  return <div className="flame-canvas" aria-hidden="true"><Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 4], fov: 40 }}><Flame lit={lit} /></Canvas></div>;
}
