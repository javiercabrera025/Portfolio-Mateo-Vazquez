interface ModalProps {
  selectedProject: {
    title: string;
    description: string;
    image: string;
    videolink: string;
    content: any[];
    order?: number;
  } | null;
  onClose: () => void;
}

export const Modal = ({ selectedProject, onClose }: ModalProps) => {
  if (!selectedProject) return null;

  const getYouTubeID = (link: string) => {
    const regex =
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const renderContent = (blocks: any[]) => {
    if (!Array.isArray(blocks)) return null;

    return blocks.map((block) => {
      if (block._type !== 'block' || !Array.isArray(block.children)) {
        return null;
      }

      return (
        <p
          key={block._key}
          className='text-slate-600 leading-relaxed text-lg mb-4'>
          {block.children.map((child: any, idx: number) => {
            if (child._type !== 'span') return null;

            const lines = String(child.text || '').split('\n');

            return lines.map((line: string, i: number) => (
              <span key={`${child._key}-${idx}-${i}`}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ));
          })}
        </p>
      );
    });
  };

  const videoId = getYouTubeID(selectedProject.videolink);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'
      onClick={onClose}>
      <div
        className='bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative'
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 bg-black/50 text-white w-10 h-10 rounded-full hover:bg-black transition-colors flex items-center justify-center'>
          ✕
        </button>

        <div className='aspect-video w-full bg-black'>
          {videoId ? (
            <iframe
              className='w-full h-full'
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={selectedProject.title}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            />
          ) : (
            <div className='flex items-center justify-center h-full text-white'>
              URL de video no válida
            </div>
          )}
        </div>

        <div className='p-8'>
          <h3 className='text-2xl font-bold text-slate-900 mb-4'>
            {selectedProject.title}
          </h3>

          <p className='text-slate-600 leading-relaxed text-lg mb-4'>
            {selectedProject.description}
          </p>

          <figure>
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className='w-full h-auto rounded-lg'
            />
          </figure>

          {renderContent(selectedProject.content)}
        </div>
      </div>
    </div>
  );
};
