class Snow {
    //产生雪花
    constructor(opt) {
        if (Object.prototype.toString.call(opt.radius).slice(8, -1) == "Array") {
            this.radius = Math.random() * opt.radius[1] + opt.radius[0]-1
        } else {
            this.radius = opt.radius
        }
        // snow position
        this.x = Math.random() * opt.width
        this.y = Math.random() * opt.height
    }
    //still falling snow
    draw(ctx) {
        ctx.moveTo(this.x, this.y)
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    }
    update(ctx) {
        //Same wind direction,diffrent radius caused diffrent distance at same coordinates
        this.y += ctx.g + Math.abs(Math.sin(ctx.angle)) * this.radius
        this.x += Math.cos(ctx.angle) * this.radius
        if (this.x > ctx.W + 5 || this.x < -5 || this.y > ctx.H + 5) {
            var flag = Math.random()
            if (flag > 0.4) {
                this.x = Math.random() * ctx.W
                this.y = -5
            } else {
                this.x = (flag < 0.2) ? (-5) : (ctx.H + 5)
                this.y = (Math.random() - 0.2) * ctx.H
            }
        }
    }
}
//combine two object
// Object.prototype.combine = function (obj2) {
//     for (var item in obj2) {
//         if (!this.hasOwnProperty(item)) {
//             this[item] = obj2[item]
//         }
//     }
//     return this
// }
class Fall {
    constructor(canvas, opts) {
        //default setting
        var def = {
            //the radius of vector
            radius: [1, 3],
            //wind director
            wind: 'auto',
            //gravity
            gravity: 0.01,
            //the number of vector
            maxNum: 10
        }
        this.W = canvas.width = canvas.width || window.innerWidth
        this.H = canvas.height = canvas.height || wind.innerHeight
        this.ctx = canvas.getContext('2d')
        // opts ? opts.combine(def) : def
        opts=Object.assign(def,opts)
        this.g = opts.gravity
        this.maxNum = opts.maxNum
        this.wind = opts.wind
        this.snowOpt = {
            width: this.W,
            height: this.H,
            radius: opts.radius
        }
        this.snow = []
        this.createSnow()
    }
    createSnow() {
        window.requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback, 33)
            }
        //snow
        var _self = this
        for (var i = 0; i < _self.maxNum; i++) {
            _self.snow.push(new Snow(_self.snowOpt))
        }
        //snow style
        _self.ctx.strokeStyle = 'rgba(235,235,235,1)'
        _self.ctx.fillStyle = 'rgba(235,235,235,1)'
        var wind =( _self.wind == 'auto') ? 45 : _self.wind, flag = false
        loop()
        function loop() {
            //flag:reduce or increase
            if (_self.wind == 'auto') {
                wind >= 145 ? flag = true : !flag ? wind += 0.1 : void 0;
                wind <= 45 ? flag = false : flag ? wind -= 0.1 : void 0;
            }
            var angle = wind * Math.PI / 180
            _self.ctx.clearRect(0, 0, _self.W, _self.H)
            _self.ctx.beginPath()
            for (var i = 0; i < _self.maxNum; i++) {
                _self.snow[i].draw(_self.ctx)
                var ctxObj = {
                    g: _self.g,
                    angle: angle,
                    W: _self.W,
                    H: _self.H
                }
                _self.snow[i].update(ctxObj)
            }
            _self.ctx.fill()
            requestAnimationFrame(loop)
        }
    }

}
