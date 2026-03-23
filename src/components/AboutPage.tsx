import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import { client } from '../sanityClient';

interface AboutPage {
  title: string;
  content: any[];
}

export const AboutPage = () => {
  const [about, setAbout] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await client.fetch<AboutPage | null>(
          '*[_type == "about"]{_id, title, content }[0]'
        );
        setAbout(data);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const portableTextComponents = {
    block: {
      normal: ({ children }: any) => (
        <p className='text-black/90 leading-relaxed text-lg mb-4'>{children}</p>
      )
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className='font-semibold text-black'>{children}</strong>
      ),
      em: ({ children }: any) => <em className='italic'>{children}</em>,
      link: ({ children, value }: any) => (
        <a
          href={value?.href}
          target='_blank'
          rel='noreferrer'
          className='underline text-blue-600'>
          {children}
        </a>
      )
    }
  };

  if (loading) {
    return (
      <div className='relative min-h-screen bg-black'>
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]'>
          <div className='relative w-14 h-14'>
            <div className='absolute inset-0 rounded-full border-2 border-white/20' />
            <div className='absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin' />
          </div>
        </div>
      </div>
    );
  }

  if (!about) return null;

  return (
    <div className='bg-black pt-[calc(72px+5rem)]'>
      <main className='max-w-6xl mx-auto px-4 md:px-8 py-16 pb-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-start'>
          <div className='about-left md:pr-20'>
            <h1 className='text-4xl md:text-5xl font-bold text-white mb-8'>
              {about.title}
            </h1>
            <div className='text-white/90'>
              <PortableText
                value={about.content}
                components={portableTextComponents}
              />
            </div>
          </div>
          <div className='relative'>
            <div className='relative overflow-hidden'>
              <img
                src='https://mateovazquez.uy/mateo-profile.jpeg'
                alt='Mateo Vazquez'
                className='
                  w-full h-full object-contain
                  [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
                  [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]
                '
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
