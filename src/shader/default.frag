varying vec2 vUV; // [0.0, 0.0] ~ [1.0, 1.0]

void main(void) {
    vec2 p = (vUV * 2.0) - vec2(1.0, 1.0); // normalize to [-1.0, 1.0] ~ [1.0, 1.0]
    float x = p[0];
    float y = p[1];
    gl_FragColor = vec4(abs(x), abs(y), 1.0, 1.0); //(Red, Green, Blue, Alpha)
}