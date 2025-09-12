
uniform vec3 uColor;
uniform float uCount;
uniform float uRadius;

varying vec2 vUv;
varying vec3 vColor;

void main(){

    vUv = uv;
    vColor = uColor;
    
    float angle = position.x / uRadius;


    float curvedZ = -cos(angle) * uRadius + uRadius;

    vec3 newPosition = vec3(position.x, position.y, curvedZ);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    
}