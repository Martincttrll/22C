let mouseX = 0;
let mouseY = 0;

const updateMousePosition = (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
};

document.addEventListener("mousemove", updateMousePosition);

const getMousePosition = () => {
  return { mouseX, mouseY };
};

export { getMousePosition };
