import { XataClient } from './generated'

const xata = new XataClient({
  apiKey: import.meta.env.MAIN_VITE_XATA_API_KEY,
  branch: import.meta.env.MAIN_VITE_XATA_BRANCH,
})

export default xata