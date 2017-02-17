console.warn = () => {}
require('./ball.js')

document.addEventListener('DOMContentLoaded', function () {
    if (typeof AFRAME === 'undefined') {
        throw new Error('Application started before AFRAME was available.')
    }
})

