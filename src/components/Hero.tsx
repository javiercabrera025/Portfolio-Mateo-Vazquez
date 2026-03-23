import { useEffect, useState } from 'react';
import { createClient } from '@sanity/client';

const freshClient = createClient({
  projectId: '471979z9',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-01-22',
});

type Settings = {
  coverVideo?: {
    asset?: {
      url: string;
    };
  };
};

export const Hero = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    freshClient
      .fetch<Settings>(`*[_type == "settings"][0]{ coverVideo{ asset->{ url } } }`)
      .then((data) => {
        setVideoUrl(data?.coverVideo?.asset?.url ?? null);
      })
      .catch(console.error);
  }, []);

  if (!videoUrl) return null;

  return (
    <section className='relative w-full h-screen bg-black overflow-hidden'>
      <video
        src={videoUrl}
        className='absolute inset-0 w-full h-full object-cover'
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
      />
    </section>
  );
};
