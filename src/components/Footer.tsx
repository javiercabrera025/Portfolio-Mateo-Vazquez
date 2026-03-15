import { useEffect, useState } from 'react';
import { client } from '../sanityClient';

type Settings = {
  logoTitle?: string;
  logoSubtitle?: string;
  email?: string;
  social?: {
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
  };
};

export const Footer = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const social = settings?.social || {};

  useEffect(() => {
    client
      .fetch<Settings>(
        `
      *[_type == "settings"][0]{
        logoTitle,
        logoSubtitle,
        email,
        social
      }
    `
      )
      .then(setSettings)
      .catch(console.error);
  }, []);

  return (
    <footer className='w-full bg-black border-t border-white/10'>
      <div className='max-w-[1400px] mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          <div className='flex flex-col space-y-3 items-center md:items-start text-center md:text-left'>
            <div className='flex flex-col leading-tight'>
              <span className='text-lg font-medium text-white tracking-tight'>
                {settings?.logoTitle}
              </span>
              <span className='text-xs font-light text-white/60 tracking-wide'>
                {settings?.logoSubtitle}
              </span>
            </div>
          </div>

          <div className='flex flex-col space-y-3 items-center md:items-start'>
            <nav className='flex flex-col space-y-2 items-center md:items-start'>
              <a href='/trabajos' className='text-white/90 font-light'>
                Trabajos
              </a>
              <a href='/sobre-mi' className='text-white/90 font-light'>
                Sobre mí
              </a>

              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className='text-white/90 font-light'>
                  Contacto
                </a>
              )}
            </nav>
          </div>

          {/* Social Links */}
          <div className='flex flex-col space-y-3 items-center md:items-end'>
            <div className='flex items-center justify-center md:justify-end space-x-4'>
              <a
                href={social.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className='transition-all duration-200 group'
                aria-label='Instagram'>
                <svg
                  className='w-5 h-5 fill-white/70 group-hover:fill-white transition-colors duration-200'
                  viewBox='0 0 24 24'
                  aria-hidden='true'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
              </a>

              <a
                href={social.tiktok}
                target='_blank'
                rel='noopener noreferrer'
                className='transition-all duration-200 group'
                aria-label='TikTok'>
                <svg
                  className='w-5 h-5 fill-white/70 group-hover:fill-white transition-colors duration-200'
                  viewBox='0 0 24 24'
                  aria-hidden='true'>
                  <g transform='translate(1,1)'>
                    <path d='M19.589 6.686a4.793 4.793 0 0 1-3.77-1.8v8.268a6.468 6.468 0 1 1-5.819-6.438v3.568a2.89 2.89 0 1 0 2.29 2.83V0h3.53a4.79 4.79 0 0 0 4.77 4.69v1.996z' />
                  </g>
                </svg>
              </a>

              <a
                href={social.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='transition-all duration-200 group'
                aria-label='LinkedIn'>
                <svg
                  className='w-5 h-5 fill-white/70 group-hover:fill-white transition-colors duration-200'
                  viewBox='0 0 24 24'
                  aria-hidden='true'>
                  <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className='pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <p className='text-xs text-white/40'>
            © {new Date().getFullYear()} Mateo Vázquez.
          </p>
          <p className='text-xs text-white/40'>Montevideo, Uruguay</p>
        </div>
      </div>
    </footer>
  );
};
