import { useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Button } from '../Button';

export type ImageCropperProps = {
  /** Source image URL or object URL to crop. */
  src: string;
  /** Fixed crop aspect ratio (width / height); free-form when omitted. */
  aspect?: number;
  /** Called with the cropped image as a `Blob` when the user confirms. */
  onCrop: (blob: Blob) => void;
  /** Label for the confirm/crop button. */
  cropLabel?: string;
};

export function ImageCropper({ src, aspect, onCrop, cropLabel = 'Crop' }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({ unit: '%', x: 10, y: 10, width: 80, height: 80 });
  return (
    <div className="space-y-3">
      <ReactCrop
        crop={crop}
        onChange={(next) => setCrop(next)}
        {...(aspect !== undefined ? { aspect } : {})}
      >
        <img src={src} alt="" decoding="async" className="max-h-96 rounded-[var(--radius-lg)]" />
      </ReactCrop>
      <Button
        onClick={() => {
          fetch(src)
            .then((response) => response.blob())
            .then(onCrop)
            .catch(() => undefined);
        }}
      >
        {cropLabel}
      </Button>
    </div>
  );
}
