uniform float uFogDensity; // Controls how dense the fog is
varying vec2 vUv;

void main() {
    // Simulate distance from camera by using UV coordinate length for simplicity
    float distanceFactor = length(vUv - 0.5); // Value from center
    float fogAmount = exp(-uFogDensity * distanceFactor * distanceFactor); // Exponential falloff for fog

    // Clamp fog amount between 0.0 and 1.0
    fogAmount = clamp(fogAmount, 0.0, 1.0);

    // Set the final color of the fog, with density applied as alpha
    vec3 fogColor = vec3(0.8, 0.8, 0.8); // Light gray fog
    gl_FragColor = vec4(fogColor, fogAmount);
}
