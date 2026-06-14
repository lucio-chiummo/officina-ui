import Lightbox, { type SlideImage } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type ImageLightboxProps = {
  /** Whether the lightbox is open (controlled). */
  open: boolean;
  /** Called when the lightbox is dismissed. */
  onClose: () => void;
  /** Images to display in the gallery. */
  slides: SlideImage[];
  /** Zero-based index of the slide shown first. Defaults to `0`. */
  startIndex?: number;
};

export function ImageLightbox({ open, onClose, slides, startIndex = 0 }: ImageLightboxProps) {
  return <Lightbox open={open} close={onClose} slides={slides} index={startIndex} />;
}
