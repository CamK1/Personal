const workButton = document.getElementById('work-button');
const aboutButton = document.getElementById('about-button');
const toggleIndicator = document.querySelector('.toggle-indicator');

workButton.addEventListener('click', () => {
  workButton.classList.add('selected');
  aboutButton.classList.remove('selected');
  toggleIndicator.style.left = '0';
});

aboutButton.addEventListener('click', () => {
  aboutButton.classList.add('selected');
  workButton.classList.remove('selected');
  toggleIndicator.style.left = '50%';
});
