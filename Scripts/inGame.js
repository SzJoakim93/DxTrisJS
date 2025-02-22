
function InGame() {
    this.PlayPanel = new Image();
    this.PlayPanel.src = "GFX/PlayPanel.png";
    this.SmallPanel = new Image();
    this.SmallPanel.src = "GFX/SmallPanel.png";
    this.BackGround = new Image();
    this.BackGround.src = "GFX/BG/bg1.png";
	this.HsTable = new Image();
	this.HsTable.src = "GFX/HsTable.png";

	this.isBackGroundRenderingNeeded = true;
	this.isPlayGroundRenderingNeeded = true;
	this.isNextPanelRenderingNeeded = true;
	this.isStatePanelRenderingNeeded = true;

    this.collSnd = new Sound("SFX/Collide.mp3");
    this.breakSnd = new Sound("SFX/Break.mp3");
    this.break4LinesSnd = new Sound("SFX/Break4Lines.mp3");
    this.gameOverSnd = new Sound("SFX/GameOver.mp3");

    this.block = new Block();

    this.isGameOver = false;
    this.isPaused = false;
    this.isHighScoreShow = true;

    this.musicIndex = 1;

    this.levelMatrix = [];
    for (var i = 0; i < 16; i++) {
        this.levelMatrix[i] = [];
        for (var j = 0; j < 10; j++) {
            this.levelMatrix[i][j] = -1;
        }
    }

    this.ticks = 0;
    this.level = 1;
    this.maxTick = 80/Math.pow(2, this.level/2);
    this.lines = 0;
    this.score = 0;
    this.name = "";

    this.playerPanelCoords = { x: 60, y: 44 };
    this.nextBlockPanelCoords = { x: 406, y: 44 };
    this.gameStatePanelCoords = { x: 595, y: 44 };
    this.multiplers = [ 0, 1, 2.5, 7.5, 30 ];

    this.offsetAnim = 0;
    this.animTreshold = 0;

    this.keyRepeatDelay = 0;

    this.handleEvents = function() {
        if (particleManager.particles.length > 0) {
            this.isPlayGroundRenderingNeeded = true;
        }

        if (this.offsetAnim > 0) {
            this.offsetAnim--;
			this.isPlayGroundRenderingNeeded = true;
        }

        if (!this.isGameOver && !this.isPaused) {
            this.ticks++;

            if (this.ticks > this.maxTick) {
                this.ticks = 0;

                this.PlaceBlock();
				this.isPlayGroundRenderingNeeded = true;
            }
        }

        if (keystates[KEY_LEFT] || keystates[KEY_RIGHT] || keystates[KEY_DOWN]) {
            this.keyRepeatDelay++;
        } else {
            this.keyRepeatDelay = 0;
        }

        if ((this.keyRepeatDelay === 1 || this.keyRepeatDelay > 9) && this.keyRepeatDelay % 2 === 1 && !this.isGameOver && !this.isPaused) {
            if (keystates[KEY_DOWN]) {
                this.PlaceBlock();
            }
            if (keystates[KEY_LEFT]) {
                this.block.MoveLeft();
            }

            if (keystates[KEY_RIGHT]) {
                this.block.MoveRight();
            }
			
			this.isPlayGroundRenderingNeeded = true;
        }
    }

    this.rendering = function() {
		if (this.offsetAnim % 2 !== 0) {
			return;
		}
		
		if (this.isBackGroundRenderingNeeded) {
			ctx.drawImage(this.BackGround, 0 , 0, this.BackGround.width, this.BackGround.height);
			this.isBackGroundRenderingNeeded = false;
		}
		
		if (this.isNextPanelRenderingNeeded) {
			ctx.drawImage(this.SmallPanel, this.nextBlockPanelCoords.x , this.nextBlockPanelCoords.y, this.SmallPanel.width, this.SmallPanel.height);
			drawText(this.nextBlockPanelCoords.x + 50, this.nextBlockPanelCoords.y + 40, 24, "white", "Next");
			this.isNextPanelRenderingNeeded = false;
		}
		
		
		if (this.isPlayGroundRenderingNeeded) {
			ctx.drawImage(this.PlayPanel, this.playerPanelCoords.x , this.playerPanelCoords.y, this.PlayPanel.width, this.PlayPanel.height);
			for (var i = this.levelMatrix.length-1; i >= 0; i--) {
				for (var j = 0; j < this.levelMatrix[i].length; j++) {
					if (this.levelMatrix[i][j] > -1) {
						ctx.drawImage(BlockImg[this.levelMatrix[i][j]], j*32 + this.playerPanelCoords.x + 4 , i*32 - 8  + this.playerPanelCoords.y + 4 - (i <= this.animTreshold ? this.offsetAnim : 0), BlockImg[this.levelMatrix[i][j]].width, BlockImg[this.levelMatrix[i][j]].height);
					}
				}
			}
			if (this.isPaused) {
				drawText(120, 250, 24, "white", "End game?");
				drawText(120, 280, 24, "white", "[X] - Yes / [<=] - No");
			}

			if (!this.isGameOver) {
				this.block.rendering();
			} else {
				drawText(120, 250, 24, "white", "Game Over");
				if (!this.isHighScoreShow) {
					drawText(120, 280, 24, "white", "Press [<=] to return");
				} else {
					/*drawText(120, 280, 24, "white", "Enter your name");
					drawText(120, 310, 24, "white", "and press [<=] to see");
					drawText(120, 330, 24, "white", "high scores");*/
					ctx.drawImage(this.HsTable, 80 , 264);
					drawText(100, 390, 24, "white", this.name);
				}
			}
			this.isPlayGroundRenderingNeeded = false;
		}
		
		if (this.isStatePanelRenderingNeeded) {
			ctx.drawImage(this.SmallPanel, this.gameStatePanelCoords.x , this.gameStatePanelCoords.y, this.SmallPanel.width, this.SmallPanel.height);
			drawText(this.gameStatePanelCoords.x + 50, this.gameStatePanelCoords.y + 40, 24, "white", "Level");
			drawText(this.gameStatePanelCoords.x + 70, this.gameStatePanelCoords.y + 65, 24, "white", this.level.toString());

			drawText(this.gameStatePanelCoords.x + 50, this.gameStatePanelCoords.y + 100, 24, "white", "Lines");
			drawText(this.gameStatePanelCoords.x + 70, this.gameStatePanelCoords.y + 125, 24, "white", this.lines.toString());

			drawText(this.gameStatePanelCoords.x + 50, this.gameStatePanelCoords.y + 160, 24, "white", "Score");
			drawText(this.gameStatePanelCoords.x + 70, this.gameStatePanelCoords.y + 185, 24, "white", this.score.toString());
			this.isStatePanelRenderingNeeded = false;
		}
    }

    this.PressLeft = function() {}
    this.PressRight = function() {}
    this.PressDown = function() {}
    this.PressUp = function() {}

    this.PressEnter = function() {
        if (this.isPaused || this.isGameOver) {
            if (this.isHighScoreShow) {
                highScores.insert();
            }

            scene = mainMenu;
            mainMenu.subMenu = this.isGameOver ? 2 : 0;
            this.ResetGame();
            return;
        }

        this.block.Rotate();
		this.isPlayGroundRenderingNeeded = true;
    }

    this.PressEscape = function() {
        this.isPaused = !this.isPaused;
        this.isPlayGroundRenderingNeeded = true;
    }

    this.InputChar = function(c) {
        if (this.isHighScoreShow) {
            if (c === "Backspace") {
                this.name = this.name.slice(0, -1); 
                this.isPlayGroundRenderingNeeded = true;
            } else {
                this.name += c;
                this.isPlayGroundRenderingNeeded = true;
            }
        }
    }

    this.PlaceBlock = function() {
        if (this.block.isCollided(0, 1)) {
            this.block.PlaceBlock();
            this.collSnd.play();
            var filledLinesCount = 0;
            for (var i = this.block.currentBlocks.length-1; i >= 0; i--) {
                if (this.IsLineFilled(this.block.currentBlocks[i].y+this.block.blockOffset.y)) {
                    this.ClearLine(this.block.currentBlocks[i].y+this.block.blockOffset.y);
                    filledLinesCount++;
                }
            }
            if (filledLinesCount === 4) {
                this.break4LinesSnd.play();
            } else if (filledLinesCount > 0) {
                this.breakSnd.play();
            }
            this.score += this.level * 40 * this.multiplers[filledLinesCount];
            if (this.levelMatrix[0][4] !== -1 || this.levelMatrix[0][5] !== -1 || this.levelMatrix[0][6] !== -1) {
                this.EndGame();
            }
            this.block.GetRandomBlock();
			this.isStatePanelRenderingNeeded = true;
			this.isNextPanelRenderingNeeded = true;
        } else {
            this.block.blockOffset.y++;
        }
    }
    
    this.IsLineFilled = function(x) {
        for (var i = 0; i < this.levelMatrix[x].length; i++) {
            if (this.levelMatrix[x][i] === -1) {
                return false;
            }
        }
    
        return true;
    }
    
    this.ClearLine = function(x) {
        for (var i = x; i > 0; i--) {
            for (var j = 0; j < this.levelMatrix[i].length; j++) {
                if (i === x) {
                    particleManager.addParticle(j*32 + this.playerPanelCoords.x + 4 , i*32 - 8  + this.playerPanelCoords.y + 4 - (i <= this.animTreshold ? this.offsetAnim : 0), 20, 5, true, this.levelMatrix[i][j]);
                }
                this.levelMatrix[i][j] = this.levelMatrix[i-1][j];
            }
        }
        this.lines++;
        if (this.lines % 10 === 0) {
            this.IncreaseLevel();
        }
        this.offsetAnim += BlockImg[0].height;
        this.animTreshold = x;
    }

    this.IncreaseLevel = function() {
        this.level++;
        this.maxTick = 80/Math.pow(2, this.level/2);
        this.BackGround.src = "GFX/BG/bg" + this.level.toString() + ".png";
		this.isBackGroundRenderingNeeded = true;
    }

    this.ResetGame = function() {
        this.ticks = 0;
        this.level = 1;
        this.maxTick = 80/Math.pow(2, this.level/2);
        this.score = 0;
        this.lines = 0;
        this.isGameOver = false;
        this.isPaused = false;

        if (this.music) {
            this.music.stop();
            this.SwitchMusicIndex();
        }
    }

    this.StartGame = function(level) {
        this.level = level;
        this.music = new Sound("Music/music" + this.musicIndex.toString() + ".mp3", onMusicEnded);
        this.music.play();
    }

    this.EndGame = function() {
        for (var i = 0; i < this.levelMatrix.length; i++) {
            for (var j = 0; j < this.levelMatrix[i].length; j++) {
                if (this.levelMatrix[i][j] > -1) {
                    particleManager.addParticle(j*32 + this.playerPanelCoords.x + 4 , i*32 - 8  + this.playerPanelCoords.y + 4 - (i <= this.animTreshold ? this.offsetAnim : 0), 10, 30, true, this.levelMatrix[i][j]);
                }
                this.levelMatrix[i][j] = -1;
            }
        }

        this.isGameOver = true;
        this.gameOverSnd.play();
    }

    this.SwitchMusicIndex = function() {
        inGame.musicIndex++;
        if (inGame.musicIndex > 4) {
            inGame.musicIndex = 1;
        }
    }

    this.ResetGame();
}

function onMusicEnded() {
    inGame.SwitchMusicIndex();
    inGame.music.stop();
    inGame.music = new Sound("Music/music" + inGame.musicIndex.toString() + ".mp3", onMusicEnded);
    inGame.music.play();

}