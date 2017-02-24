if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('wall', {
    schema: {},
    multiple: false,
    init: function () {
        this.el.addEventListener('beginContact', () => {
            console.log('collide')
        })
    },
    update: function (oldData) {},
    remove: function () {},
    // tick: function (t) { },
    pause: function () {},
    play: function () {}
})

