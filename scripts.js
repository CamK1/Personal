// Function to handle page toggle with fade-out and fade-in
function togglePage() {
  // Add the fade-out class to trigger the transition effect
  document.body.classList.add('fade-out');

  // Wait for the fade-out transition to complete, then redirect
  setTimeout(() => {
    // Toggle between index.html and about.html based on the current path
    if (window.location.pathname.endsWith("index.html")) {
      window.location.href = "about.html";
    } else {
      window.location.href = "index.html";
    }
  }, 1500); // Adjust this delay to match CSS transition duration
}

// Apply fade-in effect when the page loads
window.addEventListener('load', () => {
  // Add fade-in class for page load transition
  document.body.classList.add('fade-in');
  
  // Remove fade-in class after transition to avoid interference
  setTimeout(() => {
    document.body.classList.remove('fade-in');
  }, 1500); // Match this delay to the CSS fade-in duration
});
