uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;

varying vec2 vUv;

void main() {
    float dist = distance(vUv, uMouse);

    // Ripple / déformation
    float ripple = 0.02 * sin(dist * 40.0 - uTime * 4.0);
    vec2 direction = normalize(vUv - uMouse);
    vec2 displacedUv = vUv + direction * ripple * smoothstep(0.3, 0.0, dist);

    vec4 color = texture2D(uTexture, displacedUv);
    vec3 invertedColor = vec3(1.0 - color.rgb);

    // Influence selon la distance
    float influence = smoothstep(0.2, 0.0, dist);

    // Appliquer la couleur inversée uniquement autour de la souris
    vec3 finalColor = mix(color.rgb, invertedColor, influence);

    gl_FragColor = vec4(finalColor, 1.0);
}

