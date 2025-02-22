this.BlockImg = [];
for (var i = 0; i < 7; i++) {
    this.BlockImg[i] = new Image();
    this.BlockImg[i].src = "GFX/Block" + (i + 1).toString() + ".png";
}

var blockSamples = [
    [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 }
    ],
    [
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: 0 }
    ],
    [
        { x: 0, y: 2 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 }
    ],
    [
        { x: -1, y: 2 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: 0 }
    ],
    [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 }
    ],
    [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 }
    ],
    [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: -1 }
    ]
];

function Block() {
    this.currentBlockIndex = 0;
    this.currentBlocks = [];

    this.nextBlockIndex = Math.floor(Math.random()*blockSamples.length);
    this.blockOffset = { x: 5, y: 0};
    this.maxBlockSize = null;

    this.handleEvents = function() {

    }

    this.rendering = function() {
        for (var i = 0; i < this.currentBlocks.length; i++) {
            ctx.drawImage(BlockImg[this.currentBlockIndex], (this.currentBlocks[i].x+this.blockOffset.x)*32 + inGame.playerPanelCoords.x + 4, (this.currentBlocks[i].y+this.blockOffset.y)*32 - 8 + inGame.playerPanelCoords.y + 4, BlockImg[this.currentBlockIndex].width, BlockImg[this.currentBlockIndex].height);
        }
        for (var i = 0; i < blockSamples[this.nextBlockIndex].length; i++) {
            ctx.drawImage(BlockImg[this.nextBlockIndex], (blockSamples[this.nextBlockIndex][i].x+2)*32 + inGame.nextBlockPanelCoords.x + 2, (blockSamples[this.nextBlockIndex][i].y)*32 - 8 + inGame.nextBlockPanelCoords.y + 81, BlockImg[this.nextBlockIndex].width, BlockImg[this.nextBlockIndex].height);
        }
    }

    this.isCollided = function(dirX, dirY) {
        for (var i = 0; i < this.currentBlocks.length; i++) {
            if (this.currentBlocks[i].y+this.blockOffset.y+dirY >= inGame.levelMatrix.length || inGame.levelMatrix[this.currentBlocks[i].y+this.blockOffset.y+dirY][this.currentBlocks[i].x+this.blockOffset.x+dirX] > -1) {
                return true;
            }
        }

        return false;
    }

    this.GetRandomBlock = function() {
        this.currentBlockIndex = this.nextBlockIndex;
        this.currentBlocks = [];
        this.CopyBlock(this.currentBlocks, blockSamples[this.nextBlockIndex]);

        this.nextBlockIndex = Math.floor(Math.random()*blockSamples.length);
        this.nextBlocks = [];
        this.CopyBlock(this.nextBlocks, blockSamples[this.nextBlockIndex]);

        this.GetMaxBlockSize();
        this.blockOffset = { x: 5, y: 0-this.minBlockSize.y };
    }

    this.GetMaxBlockSize = function() {
        var minX = 3;
        var minY = 3;
        var maxX = -1;
        var maxY = -1;
        for (var i = 0; i < this.currentBlocks.length; i++) {
            if (this.currentBlocks[i].x > maxX) {
                maxX = this.currentBlocks[i].x;
            }
            if (this.currentBlocks[i].x < minX) {
                minX = this.currentBlocks[i].x;
            }
            if (this.currentBlocks[i].y > maxY) {
                maxY = this.currentBlocks[i].y;
            }
            if (this.currentBlocks[i].y < minY) {
                minY = this.currentBlocks[i].y;
            }
        }

        this.maxBlockSize = { x: maxX, y: maxY };
        this.minBlockSize = { x: minX, y: minY };
    }

    this.PlaceBlock = function() {
        for (var i = 0; i < this.currentBlocks.length; i++) {
            inGame.levelMatrix[this.currentBlocks[i].y+this.blockOffset.y][this.currentBlocks[i].x+this.blockOffset.x] = this.currentBlockIndex;
        }
    }

    this.MoveLeft = function() {
        if (this.blockOffset.x + this.minBlockSize.x > 0 && !this.isCollided(-1, 0)) {
            this.blockOffset.x--;
        }
    }

    this.MoveRight = function() {
        if (this.blockOffset.x + this.maxBlockSize.x < inGame.levelMatrix[0].length-1 && !this.isCollided(1, 0)) {
            this.blockOffset.x++;
        }
    }

    this.Rotate = function() {
        //check isRotatable
        for (var i = 0; i < this.currentBlocks.length; i++) {
            var x = -this.currentBlocks[i].y+1 + this.blockOffset.x;
            var y = this.currentBlocks[i].x + this.blockOffset.y;
            if (x < 0 || x > inGame.levelMatrix[0].length || y < 0 || y >= inGame.levelMatrix.length || inGame.levelMatrix[y][x] !== -1) {
                return;
            }
        }

        //rotate
        for (var i = 0; i < this.currentBlocks.length; i++) {
            var prevX = this.currentBlocks[i].x;
            this.currentBlocks[i].x = -this.currentBlocks[i].y+1;
            this.currentBlocks[i].y = prevX;
        }

        this.currentBlocks.sort(function(a, b) { return b.y - a.y });

        this.GetMaxBlockSize();
    }

    this.CopyBlock = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a[i] = { x: b[i].x, y: b[i].y };
        }
    }

    this.nextBlocks = [];
    this.CopyBlock(this.nextBlocks, blockSamples[this.nextBlockIndex]);
    this.GetRandomBlock();
}
