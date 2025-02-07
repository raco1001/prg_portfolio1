const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentSize = 12;
let maxSize = 12; 
let minSize = 5; 
let minSizeReached = false; 
let lastScrollY = window.scrollY; 

const dynamicAnimationElement = document.getElementById('dynamic-animation');
const connectionStatusElement = document.getElementById('connection-status');
let isConnected = false; 
let animationIndex = 0; 
const animationText = "Connecting to Programmers_WebFullCycleDevCourse_Portfolio ";
const animationSymbols = ['/', '-', '\\', '|'];



const dynamicTextElement = document.getElementById('dynamic-text');
const fullText = `~$ 서비스의 모든 소리를 듣고 싶은 개발자입니다. \\ <br>아키텍처에 포함된 요소들을 조화롭게 운영하는 것을 매우 중요하게 생각합니다.`;

class Cell {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.symbol, this.x + 0.3, this.y + 0.3);
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}


class ASCII {
   constructor(image, width, height) {
       this.image = image;
       this.width = width;
       this.height = height;
       this.cells = [];
   }
   init(size) {
       size = parseInt(size);
       ctx.drawImage(this.image, 0, 0, this.width, this.height);

       // Get pixel data
       const pixels = ctx.getImageData(0, 0, this.width, this.height).data;
       this.cells = []; // Reset cells to avoid duplication

       for (let y = 0; y < this.height; y += size) {
           for (let x = 0; x < this.width; x += size) {
               const index = (y * this.width + x) * 4;
               const red = pixels[index];
               const green = pixels[index + 1];
               const blue = pixels[index + 2];
               const alpha = pixels[index + 3];

               // Create new Cell
               if (alpha > 0) {
                   const color = `rgb(${red}, ${green}, ${blue})`;
                   const grayScale = (red + green + blue) / 3;
                   const symbol = this.convertToSymbol(grayScale);
                   this.cells.push(new Cell(x, y, symbol, color));
               }
           }
       }
   }
   draw() {
       ctx.clearRect(0, 0, this.width, this.height);
       this.cells.forEach((c) => c.draw());
   }
   convertToSymbol(g) {
       const grayRamp = ' .:-=+*#%@'.split('');
       return grayRamp[Math.ceil(((grayRamp.length - 1) * g) / 255)];
   }
}


function startAsciiAnimation() {
    const animationInterval = setInterval(() => {
        if (isConnected) {
            clearInterval(animationInterval); // 스크롤 발생 시 애니메이션 중지
            dynamicAnimationElement.textContent = `${animationText}`;
            connectionStatusElement.textContent = "Connected!"; // 메시지 추가
            return;
        }
        // 애니메이션 업데이트
        dynamicAnimationElement.textContent =
            animationText + animationSymbols[animationIndex];
        animationIndex = (animationIndex + 1) % animationSymbols.length; // 심볼 순환
    }, 200); // 200ms마다 업데이트
}

let ascii = null;


function loadImage(imagePath) {
    const image = new Image();
    image.src = imagePath;
    image.onload = () => {
        image.height = image.height * (600 / image.width);
        image.width = 600;

        canvas.width = image.width;
        canvas.height = image.height;

        ascii = new ASCII(image, canvas.width, canvas.height);
        generateASCII(currentSize);
    };
}


function generateASCII(size) {
    if (!ascii) return;
    ascii.init(size);
    ctx.font = size * 1.15 + 'px Verdana';
    ascii.draw();
}


document.addEventListener('scroll', (event) => {
    let scrollY = window.scrollY;
    const maxScroll = 200;

    if (!isConnected) {
        isConnected = true; 
    }


    if (!minSizeReached && scrollY > lastScrollY) {

        if (currentSize > minSize) {
            currentSize -= 0.5;
            generateASCII(Math.floor(currentSize));
        } else {
            minSizeReached = true; 
        }
    } else if (minSizeReached && scrollY < lastScrollY) {

        if (currentSize < maxSize) {
            currentSize += 0.5;
            generateASCII(Math.floor(currentSize));
        } else {
            minSizeReached = false; 
        }
    }

    lastScrollY = scrollY;

    const textLength = Math.min(
      Math.floor((scrollY / maxScroll) * fullText.length) + 3, 
      fullText.length
  );

  dynamicTextElement.innerHTML = fullText.slice(0, textLength) + '_';
});


document.addEventListener('scroll', (event) => {
    if (!minSizeReached) {
        event.preventDefault();
        window.scrollTo(0, lastScrollY); 
    }
});

startAsciiAnimation();
const initialImagePath = './img/portfolio.jpg';
loadImage(initialImagePath);
