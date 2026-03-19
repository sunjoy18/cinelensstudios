// import { createClient } from '@sanity/client';
// import imageUrlBuilder from '@sanity/image-url';

// const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
// const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// export const sanityClient = createClient({
//   projectId,
//   dataset,
//   apiVersion: '2024-01-01',
//   useCdn: true,
// });

// const builder = imageUrlBuilder(sanityClient);

// export function urlFor(source: { _type: string; asset?: { _ref: string } }) {
//   return builder.image(source);
// }
