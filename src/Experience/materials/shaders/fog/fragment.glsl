uniform sampler2D uPerlinTexture;
uniform vec3 uFogColor;

varying vec2 vUv;

void main() {
    float fog = texture(uPerlinTexture, vUv).r;

    float alphaTop = smoothstep(0.2, 0.5, vUv.y ); 
    float alphaBottom = 1.0 - smoothstep(0.4, 0.8, vUv.y);

    float alpha = alphaTop * alphaBottom * fog ;
    gl_FragColor = vec4(uFogColor, fog);
}