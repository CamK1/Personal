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

const openFullscreen = (element) => {
    // Create a clone of the clicked image
    const fullPageImage = element.cloneNode();
    fullPageImage.classList.add('fullscreen-image');

    // Set the initial style of the cloned image to match the clicked image
    fullPageImage.style.position = 'fixed';
    fullPageImage.style.top = '50%'; // Start at center
    fullPageImage.style.left = '50%'; // Start at center
    fullPageImage.style.transform = 'translate(-50%, -50%)'; // Center the image
    fullPageImage.style.width = 'auto'; // Width will be adjusted
    fullPageImage.style.height = 'auto'; // Height will be adjusted
    fullPageImage.style.maxWidth = '100%'; // Constrain to viewport
    fullPageImage.style.maxHeight = '100%'; // Constrain to viewport
    fullPageImage.style.zIndex = '9999'; // Ensure it's above other elements
    fullPageImage.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; // For the grow effect
    fullPageImage.style.opacity = '0'; // Start hidden

    // Append the image to the body
    document.body.appendChild(fullPageImage);

    // Trigger reflow to restart animation
    fullPageImage.offsetWidth; // This line forces a reflow

    // After a short delay, set the scale to cover the viewport
    requestAnimationFrame(() => {
        fullPageImage.style.opacity = '1'; // Fade in
        fullPageImage.style.transform = 'translate(-50%, -50%) scale(1.5)'; // Scale up
    });

    // Create exit button
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Close';
    exitButton.style.position = 'fixed'; // Fixed position
    exitButton.style.top = '20px'; // Position at the top
    exitButton.style.right = '20px'; // Position at the right
    exitButton.style.padding = '10px 20px';
    exitButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    exitButton.style.border = 'none';
    exitButton.style.cursor = 'pointer';
    exitButton.style.zIndex = '10000'; // Ensure it's above the fullscreen image

    // Set the onclick event for closing
    exitButton.onclick = () => {
        closeFullscreen(fullPageImage, exitButton);
    };

    // Append exit button to body
    document.body.appendChild(exitButton);
};

// Function to close the fullscreen image
const closeFullscreen = (fullPageImage, exitButton) => {
    // Animate the image back to its original size and position
    fullPageImage.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    fullPageImage.style.transform = 'translate(-50%, -50%) scale(0)'; // Scale down
    fullPageImage.style.opacity = '0'; // Fade out

    // Wait for the transition to finish before removing the elements
    fullPageImage.addEventListener('transitionend', () => {
        fullPageImage.remove();
        exitButton.remove(); // Remove the exit button
    });
};

// Event listeners for mouse and touch events
window.onmousedown = (e) => handleOnDown(e);
window.ontouchstart = (e) => handleOnDown(e.touches[0]);

window.onmouseup = (e) => handleOnUp(e);
window.ontouchend = (e) => handleOnUp(e.touches[0]);

window.onmousemove = (e) => handleOnMove(e);
window.ontouchmove = (e) => handleOnMove(e.touches[0]);