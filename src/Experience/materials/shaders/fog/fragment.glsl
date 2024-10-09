uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main() {
    float fog = texture(uPerlinTexture, vUv).r;
    fog = smoothstep(0.4, 1.0, fog);

    vec2 fogUv = vUv;
    fogUv.x *= 0.005;
    fogUv.y *= 0.003;

    gl_FragColor = vec4(1.0, 1.0, 1.0, fog);
}