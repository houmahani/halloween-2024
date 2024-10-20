
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uCloudColor1;
uniform vec3 uCloudColor2;
uniform vec3 uCloudColor3;
uniform vec3 uCloudColor4;

varying vec2 vUv;

float random (in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
  // Initial values
  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;
  //
  // Loop of octaves
  for (int i = 0; i < OCTAVES; i++) {
      value += amplitude * noise(st);
      st *= 2.;
      amplitude *= .5;
  }
  return value;
}

void main() {
    vec2 normalizedCoords = gl_FragCoord.xy/uResolution.xy * 3.;
    vec3 color = vec3(0.0);

    vec2 fbmOffsets = vec2(0.);
    fbmOffsets.x = fbm(normalizedCoords + 0.00 * uTime);
    fbmOffsets.y = fbm(normalizedCoords + vec2(1.0));

    vec2 fbmDisplacement = vec2(0.0);
    fbmDisplacement.x = fbm(normalizedCoords + 8.0 * fbmOffsets + vec2(2.7, 9.2) + 0.17 * uTime );
    fbmDisplacement.y = fbm(normalizedCoords + 4.0 * fbmOffsets + vec2(8.3, 2.8) + 0.126 * uTime);

    float fbmDensity = fbm(normalizedCoords + fbmDisplacement);
float contrastDensity = smoothstep(1.0, 0.2, fbmDensity);


// float smoothEdgeX = smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
float smoothEdgeY = smoothstep(-0.2, 0.5, vUv.y) * (1.0 - smoothstep(0.6, 1.0, vUv.y));
float edge =  smoothEdgeY;

color = mix(uCloudColor1,
           uCloudColor2,
            clamp((fbmDensity * fbmDensity) * 4.0,0.0,1.0));

color = mix(color,
            uCloudColor3,
            clamp(length(fbmOffsets),0.0,1.0));

color = mix(color,
            uCloudColor4,
            clamp(length(fbmDisplacement.x),0.0,1.0));

gl_FragColor = vec4((fbmDensity * fbmDensity * fbmDensity +.6 * fbmDensity * fbmDensity + .5 * fbmDensity) * color, edge * contrastDensity);

// vec3 color = vec3(contrastDensity);
// gl_FragColor = vec4(uColor, edge * contrastDensity); // Use `edge` to adjust transparency.
// gl_FragColor = vec4(1.0, 1.0, 1.0 ,1.0);
}


// float alpha = smoothstep(0.8, 0.2, fbmDensity);


    // color = mix(vec3(0.101961,0.619608,0.666667),
    //             vec3(0.666667,0.666667,0.498039),
    //             clamp((fbmDensity * fbmDensity) * 4.0,0.0,1.0));

    // color = mix(color,
    //             vec3(0,0,0.164706),
    //             clamp(length(fbmOffsets),0.0,1.0));

    // color = mix(color,
    //             vec3(0.666667,1,1),
    //             clamp(length(fbmDisplacement.x),0.0,1.0));

    // gl_FragColor = vec4((fbmDensity * fbmDensity * fbmDensity +.6 * fbmDensity * fbmDensity + .5 * fbmDensity) * color, 1.0);
