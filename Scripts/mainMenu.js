function MainMenu() {
    this.bg = new Image();
    this.bg.src = "GFX/BG.png";
    this.selectSnd = new Sound("SFX/Select.mp3");
    this.switchSnd = new Sound("SFX/Switch.mp3");
	
	this.isRenderingNeeded = true;

    this.subMenu = 0;
    this.selected = 0;
    this.handleEvents = function() {
    }

    this.rendering = function() {
		if (!this.isRenderingNeeded) {
			return;
		}
        ctx.drawImage(this.bg, 0 , 0, this.bg.width, this.bg.height);
        this.MenuPoints[this.subMenu].rendering();
		this.isRenderingNeeded = false;
    }

    this.PressEnter = function() {
        this.MenuPoints[this.subMenu].selections();
        this.selectSnd.play();
		this.isRenderingNeeded = true;
    }

    this.PressSpace = function() {

    }

    this.PressUp = function() {
        this.selected--;
        if (this.selected < 0) {
            this.selected = this.MenuPoints[this.subMenu].menupointsCount-1;
        }
        this.switchSnd.play();
		this.isRenderingNeeded = true;
    }

    this.PressDown = function() {
        this.selected++;
        if (this.selected >= this.MenuPoints[this.subMenu].menupointsCount) {
            this.selected = 0;
        }
        this.switchSnd.play();
		this.isRenderingNeeded = true;
    }

    this.PressLeft = function() {

    }

    this.PressRight = function() {

    }

    this.renderingMain = function() {
        drawText(300, 200, 32, "white", "Main menu");
        drawText(300, 320, 32, mainMenu.selected === 0 ? "white" : "#ceb6ff", "New Game");
        drawText(300, 350, 32, mainMenu.selected === 1 ? "white" : "#ceb6ff", "High scores");
        drawText(300, 380, 32, mainMenu.selected === 2 ? "white" : "#ceb6ff", "Exit");
    }

    this.selectionMain = function() {
        switch(mainMenu.selected) {
            case 0:
                mainMenu.subMenu = 1;
                mainMenu.selected = 0;
                break;
            case 1:
                mainMenu.subMenu = 2;
                mainMenu.selected = 0;
                break;
        }
    }

    this.renderingLevels = function() {
        drawText(300, 200, 32,"white", "Select level");
        for (var i = 0; i < 10; i++) {
            drawText(370, 240 + i*20, 24, mainMenu.selected === i ? "white" : "#ceb6ff", (i+1).toString());
        }
    }

    this.selectionLevels = function() {
        mainMenu.selectLevel(mainMenu.selected + 1);
    }

    this.renderingHighScores = function() {
        highScores.rendering();
        drawText(300, 475, 18, mainMenu.selected === 0 ? "white" : "#ceb6ff", "Main menu");
        drawText(300, 500, 18, mainMenu.selected === 1 ? "white" : "#ceb6ff", "Next");
        drawText(300, 525, 18, mainMenu.selected === 2 ? "white" : "#ceb6ff", "Clear these high scores");
    }

    this.selectionHighScores = function() {
        switch(mainMenu.selected) {
            case 0:
                mainMenu.subMenu = 0;
                mainMenu.selected = 0;
                break;
        }
    }

    this.selectLevel = function(x) {
        inGame.StartGame(x);
        scene = inGame;
    }

    this.MenuPoints = [ { rendering: this.renderingMain, selections: this.selectionMain, menupointsCount: 3 },
        { rendering: this.renderingLevels, selections: this.selectionLevels, menupointsCount: 10 },
        { rendering: this.renderingHighScores, selections: this.selectionHighScores, menupointsCount: 3 }
     ];
}