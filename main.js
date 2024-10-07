const track = document.getElementById("image-track");
let isDragging = false;
let dragDistance = 0;
let openedImage = null;

const handleOnDown = (e) => {
    track.dataset.mouseDownAt = e.clientX;
    isDragging = true;
    dragDistance = 0; // Reset drag distance
};

const handleOnUp = (e) => {
    if (!isDragging) return;

    isDragging = false;

    // Check if the drag distance is minimal to treat it as a click
    if (Math.abs(dragDistance) < 5) {
        const targetImage = document.elementFromPoint(e.clientX, e.clientY);
        if (targetImage && targetImage.classList.contains('image')) {
            openFullscreen(targetImage);
        }
    }

    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = (e) => {
    if (!isDragging) return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.percentage = nextPercentage;

    track.animate(
        {
            transform: `translate(${nextPercentage}%, -50%)`,
        },
        { duration: 1200, fill: "forwards" }
    );

    for (const image of track.getElementsByClassName("image")) {
        image.animate(
            {
                objectPosition: `${100 + nextPercentage}% center`,
            },
            { duration: 1200, fill: "forwards" }
        );

        // Update drag distance
        dragDistance = mouseDelta;
    }
};

// Function to open the image in full page
const openFullscreen = (element) => {
    // Store the opened image for later reference
    openedImage = element.src;

    // Create an image element for the full-page display
    const fullPageImage = document.createElement('img');
    fullPageImage.src = openedImage;
    fullPageImage.classList.add('fullscreen-image');

    // Append the image to the body
    document.body.appendChild(fullPageImage);

    // Trigger reflow to restart animation
    fullPageImage.offsetWidth; // This line forces a reflow

    // Set the animation class to start the grow effect
    fullPageImage.classList.add('grow');

    // Create exit button
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Close Image';
    exitButton.style.position = 'absolute';
    exitButton.style.top = '20px';
    exitButton.style.right = '20px';
    exitButton.style.padding = '10px 20px';
    exitButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    exitButton.style.border = 'none';
    exitButton.style.cursor = 'pointer';
    exitButton.style.zIndex = '1000';

    exitButton.onclick = closeFullscreen;

    // Append exit button to body
    document.body.appendChild(exitButton);
};

// Function to close the fullscreen image
const closeFullscreen = () => {
    // Remove the full page image
    const fullPageImage = document.querySelector('.fullscreen-image');
    if (fullPageImage) {
        fullPageImage.classList.remove('grow'); // Remove the grow class
        fullPageImage.addEventListener('transitionend', () => {
            fullPageImage.remove();
        });
    }

    // Reset body overflow
    document.body.style.overflow = 'auto'; // Re-enable scrolling

    // Remove exit button
    const exitButton = document.querySelector('button');
    if (exitButton) {
        exitButton.remove();
    }
};

// Event listeners for mouse and touch events
window.onmousedown = (e) => handleOnDown(e);
window.ontouchstart = (e) => handleOnDown(e.touches[0]);

window.onmouseup = (e) => handleOnUp(e);
window.ontouchend = (e) => handleOnUp(e.touches[0]);

window.onmousemove = (e) => handleOnMove(e);
window.ontouchmove = (e) => handleOnMove(e.touches[0]);
