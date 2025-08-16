import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  mediaFiles: string[];
  serviceTitle: string;
}

const ImageGallery = ({ mediaFiles, serviceTitle }: ImageGalleryProps) => {
  const [selectedMedia, setSelectedMedia] = useState(mediaFiles[0] || '/placeholder.svg');

  const isVideo = (url: string) => url.endsWith('.mp4');

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
        {isVideo(selectedMedia) ? (
          <video src={selectedMedia} className="h-full w-full object-cover" controls />
        ) : (
          <img src={selectedMedia} alt={serviceTitle} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {mediaFiles.map((mediaUrl, index) => (
          <button
            key={index}
            onClick={() => setSelectedMedia(mediaUrl)}
            className={cn(
              'overflow-hidden rounded-md aspect-square focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              selectedMedia === mediaUrl && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            <img
              src={isVideo(mediaUrl) ? '/placeholder.svg' : mediaUrl} // Show placeholder for video thumbs
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;