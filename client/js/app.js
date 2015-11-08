var app = new Vue({
    el: '#box-game',
    data: {
        socket: null,
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
        sendKeyState: function() {
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
    },
    ready: function () {
        var self = this;

        this.socket = io.connect(window.location);
        this.socket.on('connect', function () {
            self.socket.on('assignId', function (data) {
                self.boxes.player1.id = data;
                console.log(self.boxes.player1.id);
            });

            self.socket.on('update', function (data) {
                self.boxes = data.boxes;
            });
        });
    }
});