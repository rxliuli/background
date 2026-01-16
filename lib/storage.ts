import { get, set, del } from 'idb-keyval'

const BACKGROUND_IMAGE_KEY = 'background-image'

export async function getBackgroundImage(): Promise<string | undefined> {
  return get<string>(BACKGROUND_IMAGE_KEY)
}

export async function setBackgroundImage(dataUrl: string): Promise<void> {
  await set(BACKGROUND_IMAGE_KEY, dataUrl)
}

export async function removeBackgroundImage(): Promise<void> {
  await del(BACKGROUND_IMAGE_KEY)
}
