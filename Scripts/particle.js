var particleImgs = [];
for (var i = 0; i < 7; i++) {
    particleImgs[i] = [];
    for (var j = 0; j < 4; j++) {
        particleImgs[i][j] = new Image();
        particleImgs[i][j].src = "GFX/Ruins/Ruin" + (i+1).toString() + (j+1).toString() + ".png";
    }
}

function Particle(x, y, dx, dy, lifeTime, isGravity, textIndex) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.lifeTime = lifeTime;
    this.isGravity = isGravity;
    this.textIndex = textIndex;
    this.subTextIndex = Math.floor(Math.random() * 4);

    this.apply = function() {
        if (this.lifeTime <= 0) {
            return;
        }

        if (this.lifeTime < 5) {
            ctx.globalAlpha = this.lifeTime/5;
        }

        ctx.drawImage(particleImgs[this.textIndex][this.subTextIndex], this.x, this.y, particleImgs[this.textIndex][this.subTextIndex].width, particleImgs[this.textIndex][this.subTextIndex].height);
        ctx.globalAlpha = 1.0;
        this.x += this.dx;
        this.y += this.dy;

        if (isGravity) {
            if (this.dy < 4) {
                this.dy += 0.1;
            }

            if (this.dx < 0) {
                this.dx += 0.05;
            } else if (this.dx > 0) {
                this.dx -= 0.05;
            }
        }

        this.lifeTime --;
    }
}

function ParticleSystem(x, y, speed, lifeTime, isHalfDir, textIndex) {
    this.particles = [];
    for (var i = 0; i < 3; i++) {
        var verticalDir = isHalfDir ? Math.floor(Math.random() * speed) : Math.floor(Math.random() * speed) - speed/2;
        this.particles.push(new Particle(x, y, Math.floor(Math.random() * speed) - speed/2, verticalDir, lifeTime, false, textIndex));
    }

    this.apply = function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].apply();
            if (this.particles[i].lifeTime <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}

function ParticleManager() {
    this.particles = [];

    this.addParticle = function(x, y, speed, lifeTime, isHalfDir, textIndex) {
        this.particles.push(new ParticleSystem(x, y, speed, lifeTime, isHalfDir, textIndex));
    }

    this.apply = function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].apply();
            if (this.particles[i].particles.length === 0) {
                this.particles.splice(i, 1);
            }
        }
    }
}