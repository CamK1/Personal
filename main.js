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
    // Store the opened image for later reference
    openedImage = element.src;

    // Create a clone of the clicked image
    const fullPageImage = element.cloneNode();
    fullPageImage.classList.add('fullscreen-image');

    // Set the initial style of the cloned image to match the clicked image
    fullPageImage.style.position = 'fixed';
    fullPageImage.style.top = `${element.getBoundingClientRect().top + window.scrollY}px`;
    fullPageImage.style.left = `${element.getBoundingClientRect().left}px`;
    fullPageImage.style.width = `${element.offsetWidth}px`;
    fullPageImage.style.height = `${element.offsetHeight}px`;
    fullPageImage.style.zIndex = '9999'; // Ensure it's above other elements
    fullPageImage.style.transition = 'none'; // No transition initially to avoid flicker

    // Append the image to the body
    document.body.appendChild(fullPageImage);

    // Trigger reflow to restart animation
    fullPageImage.offsetWidth; // This line forces a reflow

    // Set the animation class to start the grow effect
    fullPageImage.classList.add('grow');

    // Create exit button
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Close Image';
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
        closeFullscreen(fullPageImage, exitButton, element);
    };

    // Append exit button to body
    document.body.appendChild(exitButton);

    // Trigger reflow to apply transitions after appending the image
    requestAnimationFrame(() => {
        fullPageImage.style.transition = 'width 0.5s ease, height 0.5s ease, top 0.5s ease, left 0.5s ease';
        fullPageImage.style.top = '0'; // Animate to cover the viewport
        fullPageImage.style.left = '0';
        fullPageImage.style.width = '100vw'; // Expand to full width
        fullPageImage.style.height = '100vh'; // Expand to full height
    });
};

// Function to close the fullscreen image
const closeFullscreen = (fullPageImage, exitButton, originalImage) => {
    // Animate the image back to its original position
    fullPageImage.style.transition = 'width 0.5s ease, height 0.5s ease, top 0.5s ease, left 0.5s ease';
    
    fullPageImage.style.top = `${originalImage.getBoundingClientRect().top + window.scrollY}px`;
    fullPageImage.style.left = `${originalImage.getBoundingClientRect().left}px`;
    fullPageImage.style.width = `${originalImage.offsetWidth}px`;
    fullPageImage.style.height = `${originalImage.offsetHeight}px`;

    // Wait for the transition to finish before removing the elements
    fullPageImage.addEventListener('transitionend', () => {
        fullPageImage.remove();
        if (exitButton) exitButton.remove(); // Remove the exit button
    });

    // Reset body overflow
    document.body.style.overflow = 'auto'; // Re-enable scrolling
};

// Event listeners for mouse and touch events
window.onmousedown = (e) => handleOnDown(e);
window.ontouchstart = (e) => handleOnDown(e.touches[0]);

window.onmouseup = (e) => handleOnUp(e);
window.ontouchend = (e) => handleOnUp(e.touches[0]);

window.onmousemove = (e) => handleOnMove(e);
window.ontouchmove = (e) => handleOnMove(e.touches[0]);