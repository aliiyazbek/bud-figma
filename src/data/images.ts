// Unsplash photography used throughout the demo. Requires an internet connection while recording.
const q = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=${w}`

export const images = {
  hero: { src: q('photo-1663162551013-8bb8ab151e11'), alt: 'Students walking together outdoors', credit: 'Meredith Spencer' },
  lecture: { src: q('photo-1606761568499-6d2451b23c66', 800), alt: 'Audience seated at a talk', credit: 'Dom Fou' },
  hackathon: { src: q('photo-1519389950473-47ba0277781c', 800), alt: 'Team working on laptops at a shared table', credit: 'Marvin Meyer' },
  concert: { src: q('photo-1470229722913-7c0e2dbbafd3', 800), alt: 'Stage lights above a concert audience', credit: 'Yvette de Wit' },
  library: { src: q('photo-1709924168698-620ea32c3488', 1000), alt: 'Long rows of library bookshelves', credit: 'Jayanth Muppaneni' },
  engineering: { src: q('photo-1581092568395-d68050c2ab43', 800), alt: 'Engineers reviewing work together', credit: 'ThisisEngineering' },
  developer: { src: q('photo-1486312338219-ce68d2c6f44d', 800), alt: 'Person working on a laptop', credit: 'Glenn Carstens-Peters' },
  portrait: { src: q('photo-1612203304476-2ed23c55b5b9', 400), alt: 'Demo student portrait', credit: 'HamZa NOUASRIA' },
}

export type ImageKey = keyof typeof images
