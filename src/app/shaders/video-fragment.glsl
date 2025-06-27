uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(uTexture, vUv);

  // Calcul de la distance entre la souris et le pixel
  float dist = distance(vUv, uMouse);

  // Effet de halo autour de la souris
  float intensity = smoothstep(0.2, 0.0, dist);

  // Ajout d'une distorsion animée
  vec2 distortedUv = vUv + intensity * 0.05 * dist * 30.0;

  // Couleur finale avec distorsion
  vec4 finalColor = texture2D(uTexture, distortedUv);

  // Mélange de la couleur originale et de l'effet
  gl_FragColor = mix(color, finalColor, intensity);
}