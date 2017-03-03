console.warn = function () {}
require('./player.js')
require('./player-mover.js')
require('./enemy.js')
require('./ball.js')
require('./goal-wall.js')

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
})

function main() {
    setModeIfNeeded()
    const ball = document.getElementById('ball')
    setTimeout(() => {
        ball.emit('startGame')
    }, 1000)
}

function setModeIfNeeded() {
    const queryDict = {}

    window.location.search.substr(1).split('&').forEach((item) => {
        queryDict[item.split('=')[0]] = item.split('=')[1]
    })

    if ('mode' in queryDict) {
        const modeList = { 'easy': 0.05, 'normal': 0.1, 'hard': 0.2, 'superhard': 0.3 }
        const efficiency = modeList[queryDict.mode]
        if (efficiency) {
            const enemy = document.getElementById('enemy')
            enemy.setAttribute('enemy', 'efficiency', efficiency)
        }
    }

    if ('head' in queryDict) {
        const headControls = document.getElementById('head-controls')
        const cam = document.querySelector('a-camera')
        headControls.setAttribute('visible', true)
        cam.setAttribute('position', '0 1.2 1')
    }
}

