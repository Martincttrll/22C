uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vUv;
varying vec3 vColor;

void main(){
    
 
    vec3 color = texture2D(uTexture, vUv).rgb * uAlpha;



    gl_FragColor = vec4(color, 1.0);
}