const canvas = document.getElementById('canvas');
const textElement = document.getElementById('text');
const addTextButton = document.getElementById('addText');
const fontSizeSelect = document.getElementById('fontSize');
const fontStyleSelect = document.getElementById('fontStyle');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');

let history = [];
let redoStack = [];


function saveHistory() {
  history.push(canvas.innerHTML);
  redoStack = [];
}

canvas.addEventListener('click', (e) => {
  if (e.target === textElement) {
    saveHistory();
  }
});


addTextButton.addEventListener('click', () => {
  const newText = document.createElement('p');
  newText.textContent = 'New Text';
  newText.contentEditable = 'true';
  newText.style.position = 'absolute';
  newText.style.top = '50%';
  newText.style.left = '50%';
  newText.style.transform = 'translate(-50%, -50%)';
  newText.style.cursor = 'move';
  canvas.appendChild(newText);
  saveHistory();


  makeDraggable(newText);
});


fontSizeSelect.addEventListener('change', () => {
  textElement.style.fontSize = fontSizeSelect.value;
  saveHistory();
});


fontStyleSelect.addEventListener('change', () => {
  textElement.style.fontStyle = fontStyleSelect.value === 'italic' ? 'italic' : 'normal';
  textElement.style.fontWeight = fontStyleSelect.value === 'bold' ? 'bold' : 'normal';
  saveHistory();
});


undoButton.addEventListener('click', () => {
  if (history.length > 0) {
    redoStack.push(canvas.innerHTML);
    canvas.innerHTML = history.pop();
  }
});


redoButton.addEventListener('click', () => {
  if (redoStack.length > 0) {
    history.push(canvas.innerHTML);
    canvas.innerHTML = redoStack.pop();
  }
});


function makeDraggable(element) {
  let isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    let shiftX = e.clientX - element.getBoundingClientRect().left;
    let shiftY = e.clientY - element.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      element.style.left = `${pageX - shiftX}px`;
      element.style.top = `${pageY - shiftY}px`;
    };

    const onMouseMove = (e) => {
      moveAt(e.pageX, e.pageY);
    };

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
      saveHistory();
    };
  });

  element.ondragstart = () => false;
}

makeDraggable(textElement);
