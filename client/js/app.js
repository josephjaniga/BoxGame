var app = new Vue({
    el: '#box-game',
    data: {
        socket: null,
        myId: 'erik',
        keyIsPressed: {
            up: false,
            down: false,
            left: false,
            right: false,
        },
        boxes: [],
    },
    methods: {
        sendKeyState: function () {
            this.socket.emit('keyStateChange', this.keyIsPressed);
        },
        rightKeyDown: function () {
            if (!this.keyIsPressed.right) {
                this.keyIsPressed.right = true;
                this.sendKeyState();
            }
        },
        rightKeyUp: function () {
            this.keyIsPressed.right = false;
            this.sendKeyState();
        },
        leftKeyDown: function () {
            if (!this.keyIsPressed.left) {
                this.keyIsPressed.left = true;
                this.sendKeyState();
            }
        },
        leftKeyUp: function () {
            this.keyIsPressed.left = false;
            this.sendKeyState();
        },
        upKeyDown: function () {
            if (!this.keyIsPressed.up) {
                this.keyIsPressed.up = true;
                this.sendKeyState();
            }
        },
        upKeyUp: function () {
            this.keyIsPressed.up = false;
            this.sendKeyState();
        },
        downKeyDown: function () {
            if (!this.keyIsPressed.down) {
                this.keyIsPressed.down = true;
                this.sendKeyState();
            }
        },
        downKeyUp: function () {
            this.keyIsPressed.down = false;
            this.sendKeyState();
        },
        getObjectLength:function(obj){
            return Object.keys(obj).length;
        },
    },
    ready: function () {
        var self = this;

        var socketHref = (window.location.href.indexOf('localhost') > -1) ? 'http://localhost:1337' : window.location.href;

        this.socket = io.connect(socketHref);
        this.socket.on('connect', function () {
            self.myId = self.socket.id;

            self.socket.on('update', function (data) {
                self.boxes = data.entities;
            });
        });
    }
});