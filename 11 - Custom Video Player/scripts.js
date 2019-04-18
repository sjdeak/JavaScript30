/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

video.addEventListener('click', toggleActive)

progress.addEventListener('click', (e) => {
  const progressRect = progress.getClientRects()[0]
  const totalWidth = progressRect.width
  const percent = e.offsetX / totalWidth

  video.currentTime = percent * video.duration
  progressBar.style.flexBasis = `${percent*100}%`
})
