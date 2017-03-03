if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('player-mover', {
    schema: {},
    multiple: false,
    init: function () {
        const el = this.el
        const player = document.getElementById('head-player')
        const playerPos = el.getAttribute('position')

        el.addEventListener('raycaster-intersected', (e) => {
            const intersectedPos = e.detail.intersection.point
            const newPos = new THREE.Vector3(
                intersectedPos.x,
                intersectedPos.y,
                playerPos.z
            )
            player.setAttribute('position', newPos)
        })
    }
})

