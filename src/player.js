if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('player', {
    init: function () {
        const el = this.el
        const enemy = document.getElementById('enemy')
        el.addEventListener('collide', () => {
            enemy.emit('playerCollide')
        })
    }
})

