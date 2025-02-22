function HighScores() {
    this.currentPos = -1;
    this.gameMode = 0;
    this.scores = [];


    this.save = function() {
        saveData("js_tris_high_scores" + this.gameMode.toString(), JSON.stringify(this.scores));
    }

    this.load = function() {
        this.currentPos = 16;
        this.scores = JSON.parse(loadData("js_tris_high_scores" + this.gameMode.toString()));
        if (this.scores === null) {
            this.scores = [
                { name: "Empty", level: 1, lines: 0, score: 0 },
                { name: "Empty", level: 1, lines: 0, score: 0 },
                { name: "Empty", level: 1, lines: 0, score: 0 },
                { name: "Empty", level: 1, lines: 0, score: 0 },
                { name: "Empty", level: 1, lines: 0, score: 0 },
                { name: "Empty", level: 1, lines: 0, score: 0 },
                { name: "Empty", level: 1, lines: 0, score: 0 },
                { name: "Empty", level: 1, lines: 0, score: 0 }
            ]
        }
    }

    this.rendering = function() {
        drawText(70, 232, 18, "white", "Player");
        drawText(300, 232, 18, "white", "Level");
        drawText(450, 232, 18, "white", "Lines");
        drawText(600, 232, 18, "white", "Score");

        for (var i = 0; i < this.scores.length; i++) {
            drawText(70, 257 + i*25, 18, i === this.currentPos ? "white" : "#ceb6ff", this.scores[i].name);
            drawText(300, 257 + i*25, 18, i === this.currentPos ? "white" : "#ceb6ff", this.scores[i].level);
            drawText(450, 257 + i*25, 18, i === this.currentPos ? "white" : "#ceb6ff", this.scores[i].lines);
            drawText(600, 257 + i*25, 18, i === this.currentPos ? "white" : "#ceb6ff", this.scores[i].score);
        }
    }

    this.insert = function() {
        for (var i = 0; i < this.scores.length; i++) {
            if (inGame.score > this.scores[i].score) {
                this.scores.splice(i, 0, { name: inGame.name, level: inGame.level, lines: inGame.lines, score: inGame.score });
                this.scores.length -= 1;
                this.currentPos = i;
                break;
            }
        }
        this.save();
    }
}