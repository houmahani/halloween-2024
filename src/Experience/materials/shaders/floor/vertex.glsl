uniform float uFrequency;
uniform float uAmplitude;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 newPosition = position;
  newPosition.z += sin(newPosition.x * uFrequency) * uAmplitude;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}