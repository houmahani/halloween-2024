uniform vec3 uColor;
uniform vec3 uBackColor;
uniform vec3 uLineColor;
uniform float uTime;
uniform float uXOffset;
uniform float uYOffset;
uniform sampler2D uPumpkinsTexture;

varying vec2 vUv;

void main() {
  vec2 vUvCustom = vUv;
  vUvCustom.x = vUvCustom.x * 0.25 + uXOffset;
  vUvCustom.y = vUvCustom.y * 0.5 + uYOffset;

  float pumpkinsTexture = texture(uPumpkinsTexture, vUvCustom).r;

  bool isLine = pumpkinsTexture < 0.3;

  // Calculate glow animation with unique speed factor and direction per card
  float glowCenter = mod(vUvCustom.x + uTime * 0.2 * 1.0, 1.0);
float glowWidth = 1.0; // Reduced width for a thicker line
float glowIntensity = smoothstep(glowCenter - glowWidth * 0.5, glowCenter + glowWidth * 0.5, pumpkinsTexture);



  if (gl_FrontFacing) {
    if(isLine) {
      // gl_FragColor = vec4(uLineColor * glowIntensity, 1.0);
      gl_FragColor = vec4(uLineColor, 1.0);
    } else {
      gl_FragColor = vec4(uBackColor, 1.0);
    }

// gl_FragColor = vec4(uBackColor, 1.0);
    // gl_FragColor = vec4(uColor, 1.0);

  } else {
    // gl_FragColor = vec4(uColor, 1.0);
  }
//  gl_FragColor = vec4(uBackColor, 1.0);

}