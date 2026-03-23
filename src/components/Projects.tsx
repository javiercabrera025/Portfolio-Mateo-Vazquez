import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../sanityClient';

interface SanityImageAsset {
  url: string;
}

interface SanityImage {
  asset?: SanityImageAsset;
}

interface Proyecto {
  _id: string;
  title: string;
  description: string;
  image: SanityImage;
  content: any[];
  order?: number;
}

const slugFromTitle = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const Projects = () => {
  const [items, setItems] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    client
      .fetch(
        `
        *[_type == "proyecto"]{
          _id,
          title,
          description,
          image{
            asset->
          },
          order
        }
      `
      )
      .then((data: Proyecto[]) => {
        const sortedData = [...data].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          return a.title.localeCompare(b.title);
        });

        setItems(sortedData.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]'>
        <div className='relative w-14 h-14'>
          <div className='absolute inset-0 rounded-full border-2 border-white/20' />
          <div className='absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin' />
        </div>
      </div>
    );
  }

  return (
    <section className='relative w-full bg-black py-20'>
      <div className='max-w-7xl mx-auto px-4 md:px-8'>
        <h2 className='text-white text-3xl font-bold mb-8 tracking-tight'>
          Trabajos
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'>
          {items.map((p) => {
            const imageUrl = p.image?.asset?.url;

            return (
              <article
                key={p._id}
                onClick={() => navigate(`/trabajos/${slugFromTitle(p.title)}`)}
                className='relative cursor-pointer transition-transform duration-300 hover:rotate-0 group'>
                <div className='relative bg-white p-2 shadow-[0_20px_40px_rgba(0,0,0,0.45)]'>
                  <div className='relative overflow-hidden aspect-video'>
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={p.title}
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                      />
                    )}

                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center'>
                      <div className='opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 px-4 text-center'>
                        <h3 className='font-bold text-white text-xl mb-2'>
                          {p.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className='mt-12 flex justify-center'>
          <a
            href='/trabajos'
            className='inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-light tracking-widest uppercase border border-white/20 hover:border-white/50 px-8 py-3 transition-all duration-300'>
            Ver todos los trabajos
          </a>
        </div>
      </div>
    </section>
  );
};
