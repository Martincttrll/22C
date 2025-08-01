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

    // Appliquer la couleur inversée uniquement autour de la souris
    vec3 finalColor = color.rgb;

    gl_FragColor = vec4(finalColor, 1.0);
}

