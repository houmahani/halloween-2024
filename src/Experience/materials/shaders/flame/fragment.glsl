uniform float uTime;
uniform float uScale; // Overall scaling factor
uniform sampler2D uTexture1; // First flame texture
uniform sampler2D uTexture2; // Second flame texture for flickering
varying vec2 vUv;

// Flame colors for gradient
vec3 baseColor = vec3(1.0, 0.5, 0.0); // Orange for the base
vec3 tipColor = vec3(1.0, 1.0, 0.0);  // Yellow for the tip

void main() {
  // Clamp upward motion to stop after uTime reaches 1.0
  float clampedTime = min(uTime, 0.1); // Stops upward movement at uTime = 1.0

  // Apply uniform scaling and upward motion to vUv.y only
  vec2 movingUv = vec2(vUv.x, vUv.y * uScale + clampedTime * 0.1); // Adjust clampedTime multiplier for gentle rise

  // Flickering blend factor
  float blendFactor = 0.5 + 0.5 * sin(uTime * 30.0);

  // Sample both textures with vertically adjusted UVs
  float intensity1 = texture2D(uTexture1, movingUv).r;
  float intensity2 = texture2D(uTexture2, movingUv).r;

  // Blend between the two textures for a flickering effect
  float blendedIntensity = mix(intensity1, intensity2, blendFactor);

  // Create the flame color gradient based on intensity
  vec3 flameColor = mix(baseColor, tipColor, blendedIntensity);
  float alpha = blendedIntensity; // Use intensity for alpha, making black areas transparent

  gl_FragColor = vec4(flameColor, alpha);
}
