const STYLE_ID = 'background-extension-style'

export function renderBackgroundStyle(bg: string) {
  removeBackgroundStyle()
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `html::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${Number.MAX_SAFE_INTEGER};
    background-image: url('${bg}');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
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
