'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { client } from '@/lib/sanityClient';

interface SanityImageAsset {
  url: string;
}

interface SanityImage {
  asset?: SanityImageAsset;
}

interface ContentBlock {
  _type: string;
  [key: string]: any;
}

interface Proyecto {
  _id: string;
  title: string;
  description: string;
  image: SanityImage;
  content: ContentBlock[];
  order?: number;
}

const TikTokEmbed = ({ url }: { url: string }) => {
  const match = url.match(/tiktok\.com\/@([\w.]+)\/video\/(\d+)/);

  useEffect(() => {
    const existing = document.getElementById('tiktok-embed-js');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'tiktok-embed-js';
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, [url]);

  if (!match) return null;
  const [, username, videoId] = match;

  return (
    <blockquote
      className='tiktok-embed'
      cite={`https://www.tiktok.com/@${username}/video/${videoId}`}
      data-video-id={videoId}
      style={{ maxWidth: '605px', minWidth: '325px', margin: 0 }}>
      <section />
    </blockquote>
  );
};

const slugFromTitle = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getYouTubeId = (link?: string) => {
  if (!link) return null;
  const regex =
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/shorts\/))([\w-]{11})/;
  const match = link.match(regex);
  return match ? match[1] : null;
};

type EmbedType =
  | 'youtube'
  | 'youtube-shorts'
  | 'vimeo'
  | 'tiktok'
  | 'instagram'
  | null;

interface EmbedInfo {
  embedUrl: string | null;
  embedType: EmbedType;
}

const getEmbedInfo = (url: string): EmbedInfo => {
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  if (ytShortsMatch)
    return {
      embedUrl: `https://www.youtube.com/embed/${ytShortsMatch[1]}`,
      embedType: 'youtube-shorts'
    };

  const ytVideoMatch = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([\w-]{11})/
  );
  if (ytVideoMatch)
    return {
      embedUrl: `https://www.youtube.com/embed/${ytVideoMatch[1]}`,
      embedType: 'youtube'
    };

  const ytPlaylistMatch = url.match(/[?&]list=([\w-]+)/);
  if (url.includes('youtube.com') && ytPlaylistMatch)
    return {
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${ytPlaylistMatch[1]}`,
      embedType: 'youtube'
    };

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch)
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      embedType: 'vimeo'
    };

  const tiktokMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
  if (tiktokMatch)
    return {
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      embedType: 'tiktok'
    };

  const igMatch = url.match(/instagram\.com\/(p|reel|tv)\/([\w-]+)/);
  if (igMatch)
    return {
      embedUrl: `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed/`,
      embedType: 'instagram'
    };

  return { embedUrl: null, embedType: null };
};

export const ProjectDetails = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const [project, setProject] = useState<Proyecto | null>(null);
  const [prevProject, setPrevProject] = useState<Proyecto | null>(null);
  const [nextProject, setNextProject] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProjects: Proyecto[] = await client.fetch(`
          *[_type == "proyecto"]{
            _id, title, description, image{ asset-> }, order,
            content[]{ ..., asset-> }
          }
        `);

        const sorted = [...allProjects].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined)
            return a.order - b.order;
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          return a.title.localeCompare(b.title);
        });

        const idx = sorted.findIndex((p) => slugFromTitle(p.title) === slug);
        if (idx === -1) {
          router.push('/');
          return;
        }

        setProject(sorted[idx]);
        setPrevProject(idx > 0 ? sorted[idx - 1] : null);
        setNextProject(idx < sorted.length - 1 ? sorted[idx + 1] : null);
        setLoading(false);
      } catch {
        router.push('/');
      }
    };
    fetchData();
  }, [slug, router]);

  const renderEmbed = (
    embedUrl: string,
    embedType: EmbedType,
    originalUrl = '',
    key?: number
  ) => {
    const iframeProps = {
      className: 'w-full h-full' as const,
      src: embedUrl,
      allow:
        'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      allowFullScreen: true as const
    };

    if (embedType === 'tiktok')
      return <TikTokEmbed key={key} url={originalUrl} />;

    if (embedType === 'instagram') {
      return (
        <div key={key} className='rounded-lg overflow-hidden'>
          <iframe
            {...iframeProps}
            title='Instagram'
            style={{ height: '700px', width: 'calc(100% + 17px)' }}
          />
        </div>
      );
    }

    if (embedType === 'youtube-shorts') {
      return (
        <div
          key={key}
          className='aspect-[9/16] bg-black rounded-lg overflow-hidden'>
          <iframe {...iframeProps} title='YouTube Shorts' />
        </div>
      );
    }

    return (
      <div
        key={key}
        className='aspect-video bg-black rounded-lg overflow-hidden'>
        <iframe {...iframeProps} title='Video' />
      </div>
    );
  };

  const portableTextComponents = {
    types: {
      video: ({ value }: any) => {
        const id = getYouTubeId(value?.url);
        if (!id) return null;
        return (
          <div className='aspect-video w-full bg-black rounded-lg overflow-hidden mb-[15px]'>
            <iframe
              className='w-full h-full'
              src={`https://www.youtube.com/embed/${id}`}
              title='Video'
              allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
        );
      },
      imageBlock: ({ value }: any) => {
        const asset: SanityImageAsset | undefined = value?.asset;
        if (!asset?.url) return null;
        return (
          <Image
            src={asset.url}
            alt=''
            width={1200}
            height={675}
            className='w-full rounded-lg mb-[15px]'
          />
        );
      },
      videoGrid: ({ value }: any) => {
        const items: { url?: string }[] = value?.items ?? [];
        const columns: number = value?.columns ?? 2;
        if (!items.length) return null;
        const gridClass: Record<number, string> = {
          1: 'grid-cols-1',
          2: 'grid-cols-1 sm:grid-cols-2'
        };
        const wrapperClass =
          columns === 1 ? 'flex justify-center mb-[15px]' : 'mb-[15px]';
        const innerClass = columns === 1 ? 'w-full max-w-sm' : 'w-full';
        return (
          <div className={wrapperClass}>
            <div className={innerClass}>
              <div
                className={`grid ${gridClass[columns] ?? 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
                {items.map((item, i) => {
                  const { embedUrl, embedType } = getEmbedInfo(item.url ?? '');
                  if (!embedUrl) return null;
                  return renderEmbed(embedUrl, embedType, item.url ?? '', i);
                })}
              </div>
            </div>
          </div>
        );
      }
    },
    block: {
      normal: ({ children }: any) => (
        <p className='text-black/90 leading-relaxed text-lg mb-[15px]'>{children}</p>
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
      <div className='min-h-screen bg-white animate-pulse'>
        {/* Hero image */}
        <div className='w-full mt-[76px] aspect-[16/9] bg-gray-200' />
        <div className='max-w-5xl mx-auto px-4 md:px-8 py-12'>
          {/* Title */}
          <div className='h-10 bg-gray-200 rounded w-2/3 mb-8' />
          {/* Description */}
          <div className='space-y-3 mb-10'>
            <div className='h-5 bg-gray-200 rounded w-full' />
            <div className='h-5 bg-gray-200 rounded w-5/6' />
            <div className='h-5 bg-gray-200 rounded w-4/6' />
          </div>
          {/* Content blocks */}
          <div className='aspect-video bg-gray-200 rounded-lg mb-8' />
          <div className='space-y-3'>
            <div className='h-4 bg-gray-200 rounded w-full' />
            <div className='h-4 bg-gray-200 rounded w-full' />
            <div className='h-4 bg-gray-200 rounded w-3/4' />
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const mainImageUrl = project.image?.asset?.url;

  return (
    <div className='min-h-screen bg-white'>
      {mainImageUrl && (
        <div className='w-full mt-[76px] aspect-[16/9] relative'>
          <Image
            src={mainImageUrl}
            alt={project.title}
            fill
            priority
            sizes='100vw'
            className='object-cover'
          />
        </div>
      )}

      <main className='max-w-5xl mx-auto px-4 md:px-8 py-12'>
        <h1
          className='font-semibold text-black leading-none mb-8'
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(2rem, 5vw, 4.5rem)'
          }}>
          {project.title}
        </h1>
        <p className='border-l-2 border-black/15 pl-6 text-black/90 leading-relaxed text-lg md:text-xl font-light mb-8'>
          {project.description}
        </p>
        <div className='prose prose-lg max-w-none'>
          <PortableText
            value={project.content}
            components={portableTextComponents}
          />
        </div>
      </main>

      <nav className='border-t border-black/10'>
        <div className='max-w-5xl mx-auto px-4 md:px-8'>
          <div className='flex flex-col sm:grid sm:grid-cols-2'>
            <div>
              {prevProject && (
                <Link
                  href={`/trabajos/${slugFromTitle(prevProject.title)}`}
                  className='flex items-center gap-4 py-6 sm:py-8 sm:pr-6'>
                  {prevProject.image?.asset?.url && (
                    <div className='relative w-16 h-10 sm:w-20 sm:h-12 overflow-hidden flex-shrink-0'>
                      <Image
                        src={prevProject.image.asset.url}
                        alt={prevProject.title}
                        fill
                        sizes='80px'
                        className='object-cover'
                      />
                    </div>
                  )}
                  <div className='min-w-0'>
                    <p className='text-xs text-black/35 uppercase tracking-widest mb-1'>← Anterior</p>
                    <p className='text-black/80 text-sm font-medium truncate'>{prevProject.title}</p>
                  </div>
                </Link>
              )}
            </div>
            <div className='sm:hidden border-t border-black/10 -mx-4 md:-mx-8' />
            <div className='sm:border-l sm:border-black/10'>
              {nextProject && (
                <Link
                  href={`/trabajos/${slugFromTitle(nextProject.title)}`}
                  className='flex items-center justify-end gap-4 py-6 sm:py-8 sm:pl-6'>
                  <div className='min-w-0 text-right'>
                    <p className='text-xs text-black/35 uppercase tracking-widest mb-1'>Siguiente →</p>
                    <p className='text-black/80 text-sm font-medium truncate'>{nextProject.title}</p>
                  </div>
                  {nextProject.image?.asset?.url && (
                    <div className='relative w-16 h-10 sm:w-20 sm:h-12 overflow-hidden flex-shrink-0'>
                      <Image
                        src={nextProject.image.asset.url}
                        alt={nextProject.title}
                        fill
                        sizes='80px'
                        className='object-cover'
                      />
                    </div>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
