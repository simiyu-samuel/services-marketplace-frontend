import { useState, useEffect, useRef } from 'react'; // Combined and corrected imports
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'; // Import CarouselApi type

interface ImageGalleryProps {
  mediaFiles: string[];
  serviceTitle: string;
}

const ImageGallery = ({ mediaFiles, serviceTitle }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>(); // State to hold the carousel API

  useEffect(() => {
    if (mediaFiles && mediaFiles.length > 0) {
      setSelectedIndex(0);
    }
  }, [mediaFiles]);

  useEffect(() => {
    if (!api) {
      return;
    }
    // Update selectedIndex when carousel slides
    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const isVideo = (url: string) => url.endsWith('.mp4');

  return (
    <div className="space-y-4">
      <Carousel setApi={setApi} className="w-full"> {/* Pass setApi to Carousel */}
        <CarouselContent>
          {mediaFiles.length > 0 ? (
            mediaFiles.map((media, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {isVideo(media) ? (
                    <video src={media} className="h-full w-full object-cover" controls />
                  ) : (
                    <img src={media} alt={`${serviceTitle} image ${index + 1}`} className="object-cover w-full h-full" />
                  )}
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img src="/placeholder.svg" alt="Placeholder" className="object-cover w-full h-full" />
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {mediaFiles.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      <div className="grid grid-cols-5 gap-2">
        {mediaFiles.map((mediaUrl, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)} // Use api.scrollTo to change carousel slide
            className={cn(
              'overflow-hidden rounded-md aspect-square focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              selectedIndex === index && 'ring-2 ring-primary ring-offset-2'
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
