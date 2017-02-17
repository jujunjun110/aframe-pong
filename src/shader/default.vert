varying vec2 vUV;

void main(void) {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUV = uv;
}