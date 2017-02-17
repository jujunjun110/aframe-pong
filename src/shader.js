if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your shader. */
AFRAME.registerShader('my-shader', {
    schema: {},
    vertexShader: require('./shader/default.vert')(),
    fragmentShader: require('./shader/default.frag')()
})

