const STYLE_ID = 'background-extension-style'

export function renderBackgroundStyle(bg: string) {
  removeBackgroundStyle()
  const style = document.createElement('style')
  style.id = STYLE_ID
  // TODO: iOS Safari bug https://www.reddit.com/r/csshelp/comments/1cefzv4/comment/l1ji6kp/
  style.textContent = `html::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100dvh;
    z-index: ${Number.MAX_SAFE_INTEGER};
    background-image: url('${bg}');
    background-size: cover;
    background-position: center;
    background-attachment: scroll;
    opacity: 0.1;
    pointer-events: none;
}`
  document.documentElement.appendChild(style)
}

export function removeBackgroundStyle() {
  const existing = document.getElementById(STYLE_ID)
  if (existing) {
    existing.remove()
  }
}
