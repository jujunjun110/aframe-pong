if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('player-mover', {
    schema: {},
    multiple: false,
    init: function() {
        const el = this.el
        const player = document.getElementById('player')
        const playerPos = el.getAttribute('position')

        el.addEventListener('raycaster-intersected', (e) => {
            const intersection = e.detail.intersection

            // 修正ポイント①
            // TODO: player（ボールをはじく黒い板）を、視線の動きに追随するようにしてください。
            // このオブジェクト自体は、プレイヤーが動きうる平面そのものです。
            // ① intersection の発生した座標を求める
            // ② player がいるべき座標を求める
            // ③ player の座標をそこに移動させる

        })
    }
})