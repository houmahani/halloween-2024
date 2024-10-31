uniform float uTime;
uniform float uScale; 
uniform sampler2D uTexture1; 
uniform sampler2D uTexture2; 
varying vec2 vUv;

vec3 baseColor = vec3(1.0, 0.5, 0.0); 
vec3 tipColor = vec3(1.0, 1.0, 0.0); 

void main() {

  float clampedTime = min(uTime, 0.1); 

  vec2 movingUv = vec2(vUv.x, vUv.y * uScale + clampedTime * 0.1); 

  // Flickering blend factor
  float blendFactor = 0.5 + 0.5 * sin(uTime * 30.0);

  float intensity1 = texture2D(uTexture1, movingUv).r;
  float intensity2 = texture2D(uTexture2, movingUv).r;

  // Blend between the two textures for flickering effect
  float blendedIntensity = mix(intensity1, intensity2, blendFactor);

  vec3 flameColor = mix(baseColor, tipColor, blendedIntensity);
  
  float alpha = blendedIntensity;

  gl_FragColor = vec4(flameColor, alpha);
}
