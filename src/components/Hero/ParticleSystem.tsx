import { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 3500;
const CONNECTION_DISTANCE = 0.18;
const MOUSE_REPEL_RADIUS = 0.35;
const MOUSE_REPEL_STRENGTH = 0.008;

// Vertex shader with animated positions and mouse repulsion
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;

  attribute float aSize;
  attribute vec3 aColor;
  attribute float aOffset;
  attribute float aSpeed;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec3 pos = position;

    // Slow organic drift
    float t = uTime * aSpeed * 0.3 + aOffset;
    pos.x += sin(t * 0.7 + pos.y * 2.0) * 0.04;
    pos.y += cos(t * 0.5 + pos.x * 1.5) * 0.03;
    pos.z += sin(t * 0.4 + pos.z * 2.0) * 0.025;

    // Mouse repulsion in world space
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vec2 toMouse = worldPos.xy - uMouse;
    float dist = length(toMouse);
    float repelRadius = ${MOUSE_REPEL_RADIUS.toFixed(2)};

    if (dist < repelRadius) {
      float strength = (1.0 - dist / repelRadius);
      strength = strength * strength;
      pos.xy += normalize(toMouse) * strength * ${MOUSE_REPEL_STRENGTH.toFixed(3)} * 80.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation
    float sizeAttenuation = 300.0 / -mvPosition.z;
    gl_PointSize = aSize * sizeAttenuation;

    // Depth-based alpha
    vAlpha = smoothstep(-3.0, 2.0, pos.z) * 0.8 + 0.2;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader: circular soft particles with additive glow
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);

    // Soft circle
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    // Inner glow
    float glow = exp(-dist * 8.0) * 0.6;
    alpha += glow;
    alpha = clamp(alpha, 0.0, 1.0) * vAlpha;

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

// Line vertex shader
const lineVertexShader = `
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha * 0.3);
  }
`;

function generateParticlePositions(
  count: number,
  maxRadius: number = 4.0,
  yScale: number = 0.7,
  zScale: number = 0.5
): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Distribute in a 3D sphere with bias towards center
    const r = Math.pow(Math.random(), 0.5) * maxRadius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * yScale;
    positions[i * 3 + 2] = r * Math.cos(phi) * zScale;
  }
  return positions;
}

interface NetworkLinesProps {
  positions: Float32Array;
  count: number;
}

function NetworkLines({ positions, count }: NetworkLinesProps) {
  const linesRef = useRef<THREE.LineSegments>(null!);
  const timeRef = useRef(0);

  const { linePositions, alphas } = useMemo(() => {
    const maxLines = 4000;
    const linePos = new Float32Array(maxLines * 6);
    const alphaArr = new Float32Array(maxLines * 2);
    let lineCount = 0;

    // Sample connections - check a subset for performance
    for (let i = 0; i < count && lineCount < maxLines; i += 3) {
      for (let j = i + 3; j < count && lineCount < maxLines; j += 3) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < CONNECTION_DISTANCE * 18) {
          const alpha = 1 - dist / (CONNECTION_DISTANCE * 18);
          linePos[lineCount * 6] = positions[i * 3];
          linePos[lineCount * 6 + 1] = positions[i * 3 + 1];
          linePos[lineCount * 6 + 2] = positions[i * 3 + 2];
          linePos[lineCount * 6 + 3] = positions[j * 3];
          linePos[lineCount * 6 + 4] = positions[j * 3 + 1];
          linePos[lineCount * 6 + 5] = positions[j * 3 + 2];
          alphaArr[lineCount * 2] = alpha;
          alphaArr[lineCount * 2 + 1] = alpha;
          lineCount++;
        }
      }
    }

    return {
      linePositions: linePos.slice(0, lineCount * 6),
      alphas: alphaArr.slice(0, lineCount * 2),
    };
  }, [positions, count]);

  const lineMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: lineVertexShader,
        fragmentShader: lineFragmentShader,
        uniforms: { uColor: { value: new THREE.Color('#888888') } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (linesRef.current) {
      linesRef.current.rotation.y = timeRef.current * 0.02 * 1.5;
      linesRef.current.rotation.x = Math.sin(timeRef.current * 0.01 * 1.5) * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef} material={lineMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aAlpha"
          args={[alphas, 1]}
        />
      </bufferGeometry>
    </lineSegments>
  );
}

export default function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null!);
  const mouseRef = useRef(new THREE.Vector2(9999, 9999));
  const timeRef = useRef(0);
  const { size, camera } = useThree();

  // Generate all attributes once
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleRadius = isMobile ? 2.5 : 4.0;
  const yScale = isMobile ? 1.0 : 0.7;
  const zScale = isMobile ? 0.25 : 0.5;

  const { positions, sizes, colors, offsets, speeds } = useMemo(() => {
    const pos = generateParticlePositions(PARTICLE_COUNT, particleRadius, yScale, zScale);
    const sz = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const off = new Float32Array(PARTICLE_COUNT);
    const spd = new Float32Array(PARTICLE_COUNT);

    const palette = [
      new THREE.Color('#FFFFFF'), // white
      new THREE.Color('#E0E0E0'), // light gray
      new THREE.Color('#B0B0B0'), // medium gray
      new THREE.Color('#888888'), // gray
      new THREE.Color('#CCCCCC'), // silver
      new THREE.Color('#F5F5F5'), // off-white
      new THREE.Color('#707070'), // dark gray
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sz[i] = Math.random() * 3 + 1;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      off[i] = Math.random() * Math.PI * 2;
      spd[i] = Math.random() * 0.5 + 0.3;
    }

    return { positions: pos, sizes: sz, colors: col, offsets: off, speeds: spd };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(9999, 9999) },
      uMouseStrength: { value: 1.0 },
    }),
    []
  );

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: false,
      }),
    [uniforms]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Convert to NDC then unproject to world coords at z=0
      const x = (e.clientX / size.width) * 2 - 1;
      const y = -(e.clientY / size.height) * 2 + 1;
      const vec = new THREE.Vector3(x, y, 0.5);
      vec.unproject(camera);
      mouseRef.current.set(vec.x, vec.y);
    },
    [size, camera]
  );

  // Attach mouse listener
  useMemo(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    shaderMaterial.uniforms.uTime.value = timeRef.current;
    shaderMaterial.uniforms.uMouse.value.copy(mouseRef.current);

    const speedMultiplier = isMobile ? 1.5 : 1.0;
    const driftMultiplier = isMobile ? 0.5 : 1.0;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = timeRef.current * 0.025 * speedMultiplier;
      pointsRef.current.rotation.x = Math.sin(timeRef.current * 0.008 * speedMultiplier) * 0.08 * driftMultiplier;
    }
  });

  return (
    <group>
      <NetworkLines positions={positions} count={PARTICLE_COUNT} />
      <points ref={pointsRef} material={shaderMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        </bufferGeometry>
      </points>
    </group>
  );
}
