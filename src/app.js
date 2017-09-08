console.warn = function() {}
require('./player.js')
require('./player-mover.js')
require('./enemy.js')
require('./ball.js')
require('./goal-wall.js')

document.addEventListener('DOMContentLoaded', function() {
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
        const queryString = window.location.search
        const queryParams = parseQueryString(queryString)

        if (queryParams.mode && queryParams.mode == 'vive') {
            setViveMode()
        } else {
            setRaycasterMode()
        }

        const ball = document.getElementById('ball')
        setTimeout(() => {
            ball.emit('startGame')
        }, 1000)
    }

    function setViveMode() {
        removeElement('raycaster-mode')
        const initial_cam_position = new THREE.Vector3(0, 1.6, 0)
        document.querySelector('a-camera').setAttribute('position', initial_cam_position)
    }

    function setRaycasterMode() {
        removeElement('vive-mode')
    }

    function removeElement(id) {
        const elem = document.getElementById(id)
        elem.setAttribute('visible', false)
    }

    function parseQueryString(queryString) {
        const pairs = queryString.replace('?', '').split('&')

        const params = pairs.reduce((obj, v) => {
            const pair = v.split('=')
            obj[pair[0]] = pair[1]
            return obj
        }, {})

        return params
    }
})