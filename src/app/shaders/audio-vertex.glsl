varying vec2 vUv;
uniform float uTime;
uniform sampler2D uAudioData;
uniform float uAudioTextureSize;

void main() {
    vUv = uv;

    // On détermine un index audio basé sur les UV (horizontalement)
    float audioIndex = vUv.x * uAudioTextureSize;

    // On convertit en coordonnée UV pour échantillonner la texture
    float u = audioIndex / uAudioTextureSize;
    float amplitude = texture2D(uAudioData, vec2(u, 0.0)).r;

    // On applique le déplacement vertical selon l’amplitude
    vec3 displacedPosition = position + normal * amplitude * 2.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}