import Phaser, { Scene } from 'phaser';
import { gameField, dogs } from './constants';
import background from '../assets/back_five_dogs.jpg';
import button from '../assets/btn.png';
import woman from '../assets/char.png';
import cirlce from '../assets/circle.png';
import dog from '../assets/doggy.png';
import logo from '../assets/logo.png';
import preview from '../assets/bg.png';


const dogsImages = [];
const smallScreenCircles = [];
const largeScreenCircles = [];

export class GameScene extends Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background', background);
    this.load.image('button', button);
    this.load.image('woman', woman);
    this.load.image('circle', cirlce);
    this.load.image('dog', dog);
    this.load.image('logo', logo);
    this.load.image('preview', preview);
    this.loadCircleParts();
  }

  create() {
    this.mainBackground = this.add.image(
      gameField.width / 2, gameField.height / 2, 'background'
    );

    this.addingDogsImages(dogsImages);

    this.dogsFoundStatus = false;

    this.anims.create({
      key: 'circle',
      frames: this.generateCircle(),
    });

    this.settingPreview(dogsImages, dogs);

    this.scale.on('orientationchange', this.checkOrientation, this);

    this.checkOrientation(this.scale.orientation);
  }

  settingPreview(dogsImages, dogs) {
    this.preview = this.add.image(
      gameField.width / 2, gameField.height / 2, 'preview'
    );
    this.preview.alpha = 0.9;

    this.button = this.add.image(gameField.width / 2, 520, 'button');
    this.button.setInteractive();
    this.button.addListener('pointerdown', this.openLink);

    this.buttonText = this.add.text(
      475, 500, 'Play Now',
      {
        fontSize: '35px',
        fontFamily: gameField.fontFamily,
        color: gameField.buttonTextColor,
      }
    );

    this.dog = this.add.image(780, 180, 'dog');
    this.dog.flipX = true;

    this.title = this.add.text(300, 150, `5 Hidden Dogs \n \n Can you spot them?`,
      {
        fontFamily: gameField.fontFamily,
        align: 'center',
      }
    );

    this.tweens.add({
      targets: this.title,
      duration: 5000,
      scale: 1.1,
      ease: 'easeIn',
    });

    setTimeout(() => {
      this.tweens.add({
        targets: this.preview,
        duration: 2000,
        alpha: 0.1,
        ease: 'easeIn',
      });
    }, 3000);

    setTimeout(() => {
      this.tweens.add({
        targets: [ this.title, this.dog ],
        duration: 500,
        alpha: 0.1,
        ease: 'easeIn',
      });
    }, 4500);

    setTimeout(() => {
      this.preview.visible = false;
      this.title.visible = false;
      this.dog.visible = false;

      for (let i = 0; i < dogs.length; i++) {
        this.handleClick(dogsImages[i], dogs[i], dogsImages);
      }
    }, 5000)
  }

  openLink() {
    const url = 'https://www.g5e.com/';

    window.location.href = url;
  }

  addingDogsImages(arr) {
    for (let i = 0; i < dogs.length; i++) {
      arr[i] = this.add.image(
        dogs[i].largeScreenCoords.x, dogs[i].largeScreenCoords.y, 'dog'
      );

      if (i % 2 !== 0) {
        arr[i].flipX = true;
      }

      arr[i].scaleY = 0.8;
    }
  }

  handleClick(dog, dogObject, dogsImages) {
    const interactiveDog = dog.setInteractive();

    interactiveDog.addListener('pointerdown', () => {
      const smallScreenCircle = this.add.sprite(
        dogObject.smallScreenCoords.x,
        dogObject.smallScreenCoords.y,
        'circle'
      ).play('circle');

      smallScreenCircles.push(smallScreenCircle);

      const largeScreenCircle = this.add.sprite(
        dogObject.largeScreenCoords.x,
        dogObject.largeScreenCoords.y,
        'circle'
      ).play('circle');

      largeScreenCircles.push(largeScreenCircle);

      if (window.innerHeight < window.innerWidth) {
        smallScreenCircle.visible = false;
        largeScreenCircle.visible = true;
      } else {
        smallScreenCircle.visible = true;
        largeScreenCircle.visible = false;
      }

      dogObject.isFound = true;

      const currentDog = dogsImages.find(item => item === interactiveDog);
      currentDog.removeListener('pointerdown');

      if (dogs.every(dog => dog.isFound)) {
        setTimeout(() => {
          this.onSucsess();
          this.dogsFoundStatus = true;
        }, 1000);
      }
    });
  }

  loadCircleParts() {
    for (let i = 1; i < 9; i++) {
      this.load.image(`circle-${i}`, `src/assets/circle_${i}.png`);
    }
  }

  generateCircle() {
    const cirlceParts = [];

    for (let i = 1; i < 9; i++) {
      cirlceParts.push({ key: `circle-${i}` });
    }

    return cirlceParts;
  }

  onSucsess() {
    this.background = this.add.image(
      gameField.width / 2, gameField.height / 2, 'preview'
    );
    this.background.alpha = 0;

    this.tweens.add({
      targets: this.background,
      duration: 500,
      alpha: 0.9,
      ease: 'easeIn',
    });

    this.woman = this.add.image(200, gameField.height / 2, 'woman');
    this.woman.scale = 0.8;

    this.logo = this.add.image(gameField.width / 2, 100, 'logo');
    this.logo.scale = 0.7;

    this.congratsMessage = this.add.text(
      370, 200, 'Great Job',
      {
        fontSize: '95px',
        fontFamily: 'fantasy',
        color: gameField.mainGoldColor,
      }
    );

    this.message = this.add.text(
      370, 320, `  Can you solve \n every mystery?`,
      {
        fontSize: '50px',
        fontFamily: gameField.fontFamily,
        align: 'center',
      }
    );

    this.button.setDepth(2);
    this.buttonText.setDepth(2);

    this.tweens.add({
      targets: this.button,
      duration: 800,
      scale: 1.05,
      ease: 'easeIn',
      repeat: -1,
      yoyo: true,
    });

    if (window.innerHeight > window.innerWidth) {
      this.setPortraitEnding();
    }
  }

  setPortraitPreview() {
    this.mainBackground.scale = 1.2;
    this.preview.scale = 1.2;

    this.title.setPosition(420, 200);
    this.title.setFontSize(25);

    this.dog.setPosition(660, 210);
    this.dog.scale = 0.4;

    this.tweens.add({
      targets: this.dog,
      duration: 5000,
      scale: 0.6,
      ease: 'easeIn',
    });

    for (let i = 0; i < dogs.length; i++) {
      dogsImages[i].setPosition(
        dogs[i].smallScreenCoords.x,
        dogs[i].smallScreenCoords.y
      );
    }

    smallScreenCircles.forEach(circle => circle.visible = true);
    largeScreenCircles.forEach(circle => circle.visible = false);
  }

  setPortraitEnding() {
    this.woman.setPosition(gameField.width / 2, 350);
    this.woman.scale = 0.4;
    this.woman.flipX = true;

    this.congratsMessage.setPosition(420, 300)
    this.congratsMessage.setFontSize(65)

    this.message.setFontSize(30)
    this.message.setPosition(440, 380)

    this.logo.scale = 0.6;
  }

  setLandscapePreview() {
    this.mainBackground.scale = 1;

    this.title.setPosition(300, 150);
    this.title.setFontSize(50);

    this.dog.setPosition(760, 180);

    this.button.scale = 1;

    for (let i = 0; i < dogs.length; i++) {
      dogsImages[i].setPosition(
        dogs[i].largeScreenCoords.x, dogs[i].largeScreenCoords.y
      );
    }

    smallScreenCircles.forEach(circle => circle.visible = false);
    largeScreenCircles.forEach(circle => circle.visible = true);
  }

  setLandscapeEnding() {
    this.woman.setPosition(200, gameField.height / 2);
    this.woman.scale = 0.8;
    this.woman.flipX = false;

    this.congratsMessage.setPosition(370, 200);
    this.congratsMessage.setFontSize(95);

    this.message.setFontSize(50);
    this.message.setPosition(370, 320);

    this.logo.scale = 0.7;
  }

  checkOrientation(orientation) {
    if (orientation === Phaser.Scale.PORTRAIT) {
      this.setPortraitPreview();
    }

    if (orientation === Phaser.Scale.PORTRAIT && this.dogsFoundStatus) {
      this.setPortraitEnding();
    }

    if (orientation === Phaser.Scale.LANDSCAPE) {
      this.setLandscapePreview();
    }

    if (orientation === Phaser.Scale.LANDSCAPE && this.dogsFoundStatus) {
      this.setLandscapeEnding();
    }
  }
}
