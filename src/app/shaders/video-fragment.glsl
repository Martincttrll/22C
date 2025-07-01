uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uSpeed;
varying vec2 vUv;

void main() {
    float dist = distance(vUv, uMouse);
    float ripple = sin((dist - uTime * uSpeed) * uFrequency);
    float attenuation = 1.0 / (1.0 + dist * 20.0);
    float finalRipple = ripple * attenuation * uAmplitude;

    vec2 direction = normalize(vUv - uMouse);
    vec2 displacedUv = vUv + direction * finalRipple;

    vec4 color = texture2D(uTexture, displacedUv);
    gl_FragColor = color;
}