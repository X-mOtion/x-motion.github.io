const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const motionVideos = [...document.querySelectorAll('video[data-motion]')];
const visibleVideos = new Set();
const manuallyPaused = new Set();
let animationsPaused = motionPreference.matches;
try { animationsPaused ||= localStorage.getItem('motion-paused') === 'true'; } catch {}

function hydrateMotion(video) {
  if (video.dataset.hydrated === video.dataset.src) return;
  video.muted = true;
  video.src = video.dataset.src;
  video.dataset.hydrated = video.dataset.src;
  video.load();
}

function pauseMotion(video) {
  if (video.paused) return;
  video.dataset.automaticPause = 'true';
  video.pause();
}

function synchronizeMotion(video) {
  const canPlay = visibleVideos.has(video) && !animationsPaused && !document.hidden
    && !document.querySelector('dialog[open]') && !manuallyPaused.has(video);
  if (canPlay) {
    hydrateMotion(video);
    video.play().catch(() => {});
  } else {
    pauseMotion(video);
  }
}

function synchronizeAllMotion() {
  motionVideos.forEach(synchronizeMotion);
  document.querySelectorAll('.motion-toggle').forEach(button => {
    button.textContent = animationsPaused ? 'Play animations' : 'Pause animations';
    button.setAttribute('aria-pressed', String(animationsPaused));
  });
}

motionVideos.forEach(video => {
  video.muted = true;
  video.addEventListener('pause', () => {
    if (video.dataset.automaticPause) {
      delete video.dataset.automaticPause;
      return;
    }
    if (visibleVideos.has(video) && !animationsPaused && !document.hidden) manuallyPaused.add(video);
  });
  video.addEventListener('play', () => manuallyPaused.delete(video));
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= .15) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
      synchronizeMotion(entry.target);
    });
  }, { threshold: [0, .15] });
  motionVideos.forEach(video => observer.observe(video));
} else {
  motionVideos.forEach(video => visibleVideos.add(video));
}

document.querySelectorAll('.motion-toggle').forEach(button => button.addEventListener('click', () => {
  animationsPaused = !animationsPaused;
  if (!animationsPaused) manuallyPaused.clear();
  try { localStorage.setItem('motion-paused', String(animationsPaused)); } catch {}
  synchronizeAllMotion();
}));

document.querySelectorAll('[data-motion-sample]').forEach(button => button.addEventListener('click', () => {
  const video = document.querySelector('#featured-motion');
  if (!video) return;
  pauseMotion(video);
  video.dataset.src = button.dataset.video;
  video.poster = button.dataset.poster;
  video.setAttribute('aria-label', button.dataset.title);
  manuallyPaused.delete(video);
  hydrateMotion(video);
  document.querySelectorAll('[data-motion-sample]').forEach(item => {
    item.setAttribute('aria-pressed', String(item === button));
  });
  document.querySelector('#featured-motion-caption').textContent = button.dataset.title;
  synchronizeMotion(video);
}));

motionPreference.addEventListener('change', event => {
  animationsPaused = event.matches;
  synchronizeAllMotion();
});
document.addEventListener('visibilitychange', synchronizeAllMotion);
window.addEventListener('pagehide', () => motionVideos.forEach(pauseMotion));
window.addEventListener('pageshow', synchronizeAllMotion);
const dialogObserver = new MutationObserver(synchronizeAllMotion);
document.querySelectorAll('dialog').forEach(dialog => {
  dialogObserver.observe(dialog, {attributes: true, attributeFilter: ['open']});
});
synchronizeAllMotion();
