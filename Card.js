class Card {

    constructor() {
      if (this.constructor == Card) {
        throw new Error("Abstract class can't be instantiated.");
      }
      
      this.cardDiv = document.createElement("div");
      this.cardDiv.classList.add("card");
    }
  
    isFaceUp() {
      throw new Error("Abstract Method must be implemented.");
    }

    setFaceUp() {
        throw new Error("Abstract Method must be implemented.");
    }

    setFaceDown() {
        throw new Error("Abstract Method must be implemented.");
    }

    matches(card) {
        throw new Error("Abstract Method must be implemented.");
    }

    getCardDiv() {
        return this.cardDiv;
    }
}

class ColorCard extends Card {

    constructor(color) {
        super();
        this.color = color;
        this.setFaceDown();
    }
  
    isFaceUp() {
        return this.cardDiv.style.backgroundColor == this.color;
    }

    setFaceUp() {
        this.cardDiv.style.backgroundColor = this.color;
    }

    setFaceDown() {
        this.cardDiv.style.backgroundColor = "";
    }

    matches(card) {
        return this.constructor === card.constructor && this.color == card.color;
    }
}

class ImageCard extends Card {

    constructor(imageName) {
        super();
        this.img = new Image();
        this.img.src = 'resources/image-card/' + imageName;
        this.img.style.width="100%"
        this.img.style.minHeight="100%"
        this.img.style.pointerEvents="none";
        this.cardDiv.append(this.img);
        this.setFaceDown();
    }
  
    isFaceUp() {
        return this.img.style.visibility=="visible";
    }

    setFaceUp() {
        this.img.style.visibility="visible";
    }

    setFaceDown() {
        this.img.style.visibility="hidden";
    }

    matches(card) {
        return this.constructor === card.constructor && this.img.src == card.img.src;
    }
}

export {ColorCard, ImageCard}