if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('goal-wall', {
    schema: {
        'side': {
            'type': 'string'
        }
    },
    multiple: false,
    init: function () {
        const el = this.el
        const ball = document.getElementById('ball')
        el.addEventListener('collide', () => {
            const side = this.data.side
            ball.emit('restartGame', { side: side })
        })
    }
})

