
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, Crop, Check, X } from 'lucide-react';
import ReactCrop, { Crop as CropType, PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  onImageChange: (croppedImage: string | null) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropper = ({ onImageChange }: ImageCropperProps) => {
  const [upImg, setUpImg] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PercentCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image too large. Please select an image under 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUpImg(reader.result as string);
        setIsCropping(true);
        setCroppedImage(null);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropInit = centerAspectCrop(width, height, 9 / 16);
    setCrop(cropInit);
  };

  const generateCroppedImage = () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      // Calculate pixel values from percent values
      const pixelCrop = {
        x: (completedCrop.x / 100) * imgRef.current.width,
        y: (completedCrop.y / 100) * imgRef.current.height,
        width: (completedCrop.width / 100) * imgRef.current.width,
        height: (completedCrop.height / 100) * imgRef.current.height,
      };
      
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          pixelCrop.x * scaleX,
          pixelCrop.y * scaleY,
          pixelCrop.width * scaleX,
          pixelCrop.height * scaleY,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        
        const base64Image = canvas.toDataURL('image/jpeg');
        setCroppedImage(base64Image);
        setIsCropping(false);
        onImageChange(base64Image);
      }
    }
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setUpImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearImage = () => {
    setCroppedImage(null);
    setUpImg(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image" className="block mb-2">
        Notification Screenshot <span className="text-red-500">*</span>
      </Label>
      
      <div className="border-2 border-dashed rounded-lg p-6 border-muted-foreground/20 hover:border-muted-foreground/30 transition-colors">
        {isCropping && upImg ? (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="font-medium text-lg">Crop your notification</h3>
              <p className="text-sm text-muted-foreground">
                Focus on just the notification to make it stand out
              </p>
            </div>
            <div className="max-w-full overflow-auto pb-4">
              <ReactCrop 
                crop={crop} 
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={undefined}
                className="max-w-full mx-auto"
              >
                <img 
                  ref={imgRef}
                  src={upImg} 
                  onLoad={onImageLoaded}
                  className="max-w-full max-h-[400px] object-contain"
                />
              </ReactCrop>
            </div>
            <div className="flex justify-center gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={cancelCrop}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={generateCroppedImage}
              >
                <Crop className="h-4 w-4 mr-2" />
                Crop Image
              </Button>
            </div>
          </div>
        ) : croppedImage ? (
          <div className="relative">
            <img 
              src={croppedImage} 
              alt="Notification preview" 
              className="max-h-60 mx-auto rounded-md object-contain"
            />
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              onClick={handleClearImage}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4 rounded-full bg-background p-3">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 text-sm font-medium">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG or WEBP (max. 5MB)
            </p>
            <Input 
              id="image"
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={onSelectFile}
            />
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              onClick={() => document.getElementById('image')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCropper;
