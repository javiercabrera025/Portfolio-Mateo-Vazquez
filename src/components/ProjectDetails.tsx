import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../sanityClient';

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

// ---- TikTok embed component ----

const TikTokEmbed = ({ url }: { url: string }) => {
  const match = url.match(/tiktok\.com\/@([\w.]+)\/video\/(\d+)/);

  useEffect(() => {
    // Remove existing script so it re-runs and picks up new blockquotes
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
      style={{ maxWidth: '605px', minWidth: '325px', margin: 0 }}
    >
      <section />
    </blockquote>
  );
};

// ---- Helpers ----

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

type EmbedType = 'youtube' | 'youtube-shorts' | 'vimeo' | 'tiktok' | 'instagram' | null;

interface EmbedInfo {
  embedUrl: string | null;
  embedType: EmbedType;
}

const getEmbedInfo = (url: string): EmbedInfo => {
  // YouTube Shorts (must be checked before the general YouTube match)
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  if (ytShortsMatch)
    return { embedUrl: `https://www.youtube.com/embed/${ytShortsMatch[1]}`, embedType: 'youtube-shorts' };

  // YouTube video
  const ytVideoMatch = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([\w-]{11})/
  );
  if (ytVideoMatch)
    return { embedUrl: `https://www.youtube.com/embed/${ytVideoMatch[1]}`, embedType: 'youtube' };

  // YouTube playlist
  const ytPlaylistMatch = url.match(/[?&]list=([\w-]+)/);
  if (url.includes('youtube.com') && ytPlaylistMatch)
    return {
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${ytPlaylistMatch[1]}`,
      embedType: 'youtube',
    };

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch)
    return { embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`, embedType: 'vimeo' };

  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
  if (tiktokMatch)
    return { embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`, embedType: 'tiktok' };

  // Instagram post / Reel / TV
  const igMatch = url.match(/instagram\.com\/(p|reel|tv)\/([\w-]+)/);
  if (igMatch)
    return {
      embedUrl: `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed/`,
      embedType: 'instagram',
    };

  return { embedUrl: null, embedType: null };
};

// ---- Component ----

export const ProjectDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Proyecto | null>(null);
  const [prevProject, setPrevProject] = useState<Proyecto | null>(null);
  const [nextProject, setNextProject] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const allProjects: Proyecto[] = await client.fetch(`
          *[_type == "proyecto"]{
            _id,
            title,
            description,
            image{
              asset->
            },
            order,
            content[]{
              ...,
              asset->
            }
          }
        `);

        const sortedProjects = [...allProjects].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          return a.title.localeCompare(b.title);
        });

        const currentIndex = sortedProjects.findIndex(
          (p) => slugFromTitle(p.title) === slug
        );

        if (currentIndex === -1) {
          navigate('/');
          return;
        }

        setProject(sortedProjects[currentIndex]);
        setPrevProject(
          currentIndex > 0 ? sortedProjects[currentIndex - 1] : null
        );
        setNextProject(
          currentIndex < sortedProjects.length - 1
            ? sortedProjects[currentIndex + 1]
            : null
        );

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        navigate('/');
      }
    };

    fetchProjectsData();
  }, [slug, navigate]);

  // Renders a single embed cell — used by videoGrid
  const renderEmbed = (embedUrl: string, embedType: EmbedType, originalUrl = '', key?: number) => {
    const iframeProps = {
      className: 'w-full h-full' as const,
      src: embedUrl,
      allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      allowFullScreen: true as const,
    };

    if (embedType === 'tiktok') {
      return <TikTokEmbed key={key} url={originalUrl} />;
    }

    if (embedType === 'instagram') {
      return (
        <div key={key} className='rounded-lg overflow-hidden'>
          {/* Scrollbar trick: extend iframe 17px past container, overflow-hidden clips it */}
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
        <div key={key} className='aspect-[9/16] bg-black rounded-lg overflow-hidden'>
          <iframe {...iframeProps} title='YouTube Shorts' />
        </div>
      );
    }

    // Horizontal: YouTube, Vimeo
    return (
      <div key={key} className='aspect-video bg-black rounded-lg overflow-hidden'>
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
          <div className='aspect-video w-full bg-black rounded-lg overflow-hidden mb-8'>
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
          <img src={asset.url} alt='' className='w-full rounded-lg mb-8' />
        );
      },

      videoGrid: ({ value }: any) => {
        const items: { url?: string }[] = value?.items ?? [];
        const columns: number = value?.columns ?? 2;

        if (!items.length) return null;

        const gridClass: Record<number, string> = {
          1: 'grid-cols-1',
          2: 'grid-cols-1 sm:grid-cols-2',
        };

        // Single video: constrain width so vertical video doesn't stretch full-page
        const wrapperClass = columns === 1 ? 'flex justify-center mb-8' : 'mb-8';
        const innerClass = columns === 1 ? 'w-full max-w-sm' : 'w-full';

        return (
          <div className={wrapperClass}>
            <div className={innerClass}>
              <div className={`grid ${gridClass[columns] ?? 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
                {items.map((item, i) => {
                  const { embedUrl, embedType } = getEmbedInfo(item.url ?? '');
                  if (!embedUrl) return null;
                  return renderEmbed(embedUrl, embedType, item.url ?? '', i);
                })}
              </div>
            </div>
          </div>
        );
      },
    },

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
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]'>
        <div className='relative w-14 h-14'>
          <div className='absolute inset-0 rounded-full border-2 border-white/20' />
          <div className='absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin' />
        </div>
      </div>
    );
  }

  if (!project) return null;

  const mainImageUrl = project.image?.asset?.url;

  return (
    <div className='min-h-screen bg-white'>
      {mainImageUrl && (
        <div className='w-full mt-[76px]'>
          <img
            src={mainImageUrl}
            alt={project.title}
            className='w-full h-auto object-cover aspect-[16/9]'
          />
        </div>
      )}

      <main className='max-w-5xl mx-auto px-4 md:px-8 py-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-black mb-8'>
          {project.title}
        </h1>

        <p className='text-black/95 leading-relaxed text-xl md:text-2xl font-medium mb-10'>
          {project.description}
        </p>

        <div className='prose prose-lg max-w-none'>
          <PortableText
            value={project.content}
            components={portableTextComponents}
          />
        </div>
      </main>

      <nav>
        <div className='max-w-5xl mx-auto px-4 md:px-8 py-8'>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              {prevProject && (
                <Link
                  to={`/trabajos/${slugFromTitle(prevProject.title)}`}
                  className='block'>
                  <p className='text-sm text-black/60 flex items-center gap-1'>
                    ← Anterior
                  </p>
                  <p className='hidden md:block mt-1 text-black font-medium truncate'>
                    {prevProject.title}
                  </p>
                </Link>
              )}
            </div>

            <div className='text-right'>
              {nextProject && (
                <Link
                  to={`/trabajos/${slugFromTitle(nextProject.title)}`}
                  className='block'>
                  <p className='text-sm text-black/60 flex items-center gap-1 justify-end'>
                    Siguiente →
                  </p>
                  <p className='hidden md:block mt-1 text-black font-medium truncate'>
                    {nextProject.title}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
