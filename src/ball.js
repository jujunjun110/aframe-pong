if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('ball', {
    schema: {},
    multiple: false,
    init: function () {
        console.log('start')
    },
    update: function (oldData) {},
    remove: function () {},
    tick: function (t) {
        // console.log('tick')
        const el = this.el
        const pos = el.getAttribute('position')
        pos.x += 0.01
        el.setAttribute('position', pos)
    },
    pause: function () {},
    play: function () {}
})

