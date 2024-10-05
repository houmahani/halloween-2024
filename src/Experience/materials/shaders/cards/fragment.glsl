uniform vec3 uColor;
varying vec2 vUv;

void main() {
  if (gl_FrontFacing) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red for the front
  } else {
    gl_FragColor = vec4(uColor, 1.0); // Pink for the back
  }
}