uniform vec3 uColor;
uniform vec3 uBackColor;
uniform vec3 uLineColor;
uniform float uTime;
uniform sampler2D uPumpkinsTexture;
uniform float uXOffset;
uniform float uYOffset;
varying vec2 vUv;

void main() {
  vec2 vUvCustom = vUv;
  vUvCustom.x = vUvCustom.x * 0.25 + uXOffset;
  vUvCustom.y = vUvCustom.y * 0.5 + uYOffset;

 float glowStart = vUvCustom.x + uTime * 1.0 - 1.2;
float glowEnd = vUvCustom.x + uTime * 1.0 + 1.2;

float glowIntensity = smoothstep(glowStart, glowEnd, vUvCustom.x);

 float pumpkinsTexture = texture(uPumpkinsTexture, vUvCustom).r;

// float glowIntensity = (sin(uTime) + 1.0) * 0.5;
vec3 glow = uLineColor * glowIntensity;

 bool isLine = pumpkinsTexture < 0.8;

  if (gl_FrontFacing) {
    if(isLine) {
      gl_FragColor = vec4(glow, 1.0);
    } else {
      gl_FragColor = vec4(uBackColor, 1.0);
    }
 // Red for the front
  } else {
    gl_FragColor = vec4(uColor, 1.0); // Pink for the back
  }
}