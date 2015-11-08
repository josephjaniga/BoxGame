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
        boxes: {
            player1: {
                id: 'erik',
                color: 'cyan',
                y: 50,
                x: 0,
            },
            player2: {
                id: null,
                color: 'magenta',
                y: 250,
                x: 600,
            },
            player3: {
                id: null,
                color: 'green',
                y: 150,
                x: 600,
            },
            player4: {
                id: null,
                color: 'blue',
                y: 250,
                x: 100,
            },
            player5: {
                id: null,
                color: 'orange',
                y: 0,
                x: 450,
            },
        }
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
            self.socket.on('assignId', function (data) {
                self.myId = data;
            });

            self.socket.on('update', function (data) {
                self.boxes = data.boxes;
            });
        });
    }
});