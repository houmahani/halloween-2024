uniform float uTime;

varying vec2 vUv;

void main() {
  vUv = uv;
  
  vUv.x += sin(uTime * 0.1) * 0.1;
  vUv.y += cos(uTime * 0.1) * 0.05; 
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}