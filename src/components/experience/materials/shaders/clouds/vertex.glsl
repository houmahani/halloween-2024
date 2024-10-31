varying vec2 vUv;
varying vec2 vLocalPosition;

void main() {
  vUv = uv;
  vLocalPosition = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}