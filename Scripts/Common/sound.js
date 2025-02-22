function Sound(src, onended) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.onended = onended;
    document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  }
  
  this.stop = function(){
    this.sound.pause();
  }
}
