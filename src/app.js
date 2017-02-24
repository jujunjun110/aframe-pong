console.warn = function () {}
require('./player.js')
require('./ball.js')
require('./enemy.js')

document.addEventListener('DOMContentLoaded', function () {
    if (typeof AFRAME === 'undefined') {
        throw new Error('Application started before AFRAME was available.')
    }

    const scene = document.querySelector('a-scene')
    if (scene.hasLoaded) {
        main()
    } else {
        scene.addEventListener('loaded', main)
    }

    function main() {
        const el = document.getElementById('ball')
        el.emit('startGame')
    }
})

