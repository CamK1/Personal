const track = document.getElementById("image-track");
let isDragging = false;
let dragDistance = 0;
let openedImage = null;
let isImageOpen = false; // New flag to check if an image is open

const handleOnDown = (e) => {
    if (isImageOpen) return; // Prevent dragging if an image is open
    track.dataset.mouseDownAt = e.clientX;
    isDragging = true;
    dragDistance = 0; // Reset drag distance
};

const handleOnUp = (e) => {
    if (!isDragging) return;
    isDragging = false;

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
    if (isImageOpen) return; // Prevent moving if an image is open

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

const openFullscreen = (element) => {
    isImageOpen = true; // Set the flag when an image is opened

    const fullPageImage = element.cloneNode();
    fullPageImage.classList.add('fullscreen-image');

    fullPageImage.style.position = 'fixed';
    fullPageImage.style.top = '50%'; // Align to the top
    fullPageImage.style.left = '50%'; // Align to the left
    fullPageImage.style.width = '100%'; // Set width to 100%
    fullPageImage.style.height = '100%'; // Set height to 100%
    fullPageImage.style.objectFit = 'cover'; // Ensure the image covers the entire area
    fullPageImage.style.zIndex = '9999';
    fullPageImage.style.transition = 'opacity 0.5s ease'; // Remove transform transition
    fullPageImage.style.opacity = '0';

    document.body.appendChild(fullPageImage);
    fullPageImage.offsetWidth; // Trigger reflow

    requestAnimationFrame(() => {
        fullPageImage.style.opacity = '1'; // Fade in effect
    });

    const exitButton = document.createElement('button');
    exitButton.textContent = 'Close';
    exitButton.style.position = 'fixed';
    exitButton.style.top = '20px';
    exitButton.style.right = '20px';
    exitButton.style.padding = '10px 20px';
    exitButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    exitButton.style.border = 'none';
    exitButton.style.cursor = 'pointer';
    exitButton.style.zIndex = '10000';

    exitButton.onclick = () => {
        closeFullscreen(fullPageImage, exitButton);
    };

    document.body.appendChild(exitButton);
};


const closeFullscreen = (fullPageImage, exitButton) => {
    isImageOpen = false; // Reset the flag when the image is closed

    fullPageImage.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    fullPageImage.style.transform = 'translate(-50%, -50%) scale(0)';
    fullPageImage.style.opacity = '0';

    fullPageImage.addEventListener('transitionend', () => {
        fullPageImage.remove();
        exitButton.remove();
    });
};

window.onmousedown = (e) => handleOnDown(e);
window.ontouchstart = (e) => handleOnDown(e.touches[0]);
window.onmouseup = (e) => handleOnUp(e);
window.ontouchend = (e) => handleOnUp(e.touches[0]);
window.onmousemove = (e) => handleOnMove(e);
window.ontouchmove = (e) => handleOnMove(e.touches[0]);
