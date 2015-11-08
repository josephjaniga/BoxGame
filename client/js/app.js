var app = new Vue({
    el: '#box-game',
    data: {
        keyIsPressed: {
            up: false,
            down: false,
            left: false,
            right: false,
        },
        boxes: {
            player1: {
                id: null,
                color: 'cyan',
                y: 50,
                x: 0,
            },
            player2: {
                id: null,
                color: 'magenta',
                y: 250,
                x: 600,
            }
        }
    },
    methods: {
        rightKeyDown: function () {
            if (!this.keyIsPressed.right) {
                console.log('event: rightKeyDown');
            }
            this.keyIsPressed.right = true;
        },
        rightKeyUp: function () {
            console.log('event: rightKeyUp');
            this.keyIsPressed.right = false;
        },
        leftKeyDown: function () {
            if (!this.keyIsPressed.left) {
                console.log('event: leftKeyDown');
            }
            this.keyIsPressed.left = true;
        },
        leftKeyUp: function () {
            console.log('event: leftKeyUp');
            this.keyIsPressed.left = false;
        },
        upKeyDown: function () {
            if (!this.keyIsPressed.up) {
                console.log('event: upKeyDown');
            }
            this.keyIsPressed.up = true;
        },
        upKeyUp: function () {
            console.log('event: upKeyUp');
            this.keyIsPressed.up = false;
        },
        downKeyDown: function () {
            if (!this.keyIsPressed.down) {
                console.log('event: downKeyDown');
            }
            this.keyIsPressed.down = true;
        },
        downKeyUp: function () {
            console.log('event: downKeyUp');
            this.keyIsPressed.down = false;
        },
    },
    ready: function () {
        var self = this;

        var socket = io.connect('http://localhost:1337');
        socket.on('connect', function () {
            socket.on('update', function (data) {
                self.boxes = data.boxes;
            });
        });
    }
});