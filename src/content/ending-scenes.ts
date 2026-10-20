import type { Ending } from '../game/engine';

export const endingScenes: Record<
  Ending,
  { image: string; alt: string; caption: string; photographer: string; source: string }
> = {
  break: {
    image: '/endings/break.jpg',
    alt: 'Palm trees beside a quiet beach and turquoise sea',
    caption: 'The world kept turning. You finally noticed.',
    photographer: 'Mike Fox / Pexels',
    source: 'https://www.pexels.com/photo/palm-trees-on-beach-shore-4713348/',
  },
  burnout: {
    image: '/endings/burnout.jpg',
    alt: 'An empty office photographed in black and white',
    caption: 'One more task. Until there was nothing left.',
    photographer: 'Aimbere Elorza / Pexels',
    source: 'https://www.pexels.com/photo/office-after-hours-in-black-and-white-23355036/',
  },
  corporate: {
    image: '/endings/corporate.jpg',
    alt: 'A real data center with rows of network cabinets',
    caption: 'The machines are working. Your chair is empty.',
    photographer: 'Taylor Vick / Unsplash',
    source: 'https://unsplash.com/photos/server-room-with-network-cabinets-aWslrFhs1w4',
  },
};
