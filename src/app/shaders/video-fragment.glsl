uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform float uZoom;
uniform float uScrollOffset;

varying vec2 vUv;

void main() {

    //Zoom
    vec2 centeredUV = (vUv - 0.5) / uZoom + 0.5;


    float dist = distance(centeredUV, uMouse);

    centeredUV.y += uScrollOffset;  

    // Ripple / déformation
    float ripple = 0.02 * sin(dist * 40.0 - uTime * 4.0);
    vec2 direction = normalize(centeredUV - uMouse);
    vec2 displacedUv = centeredUV + direction * ripple * smoothstep(0.3, 0.0, dist);

    vec4 color = texture2D(uTexture, displacedUv);


    vec3 finalColor = color.rgb;

    gl_FragColor = vec4(finalColor, 1.0);
}

