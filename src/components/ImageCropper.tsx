
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon, Crop, Check, X, Loader2, FileText } from 'lucide-react';
import ReactCrop, { Crop as CropType, PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  onImageChange: (croppedImage: string | null, extractedText?: string) => void;
}

// Function to center the crop in the image with a specific aspect ratio
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
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
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
        setExtractedText(null);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropInit = centerAspectCrop(width, height, 9 / 16);
    setCrop(cropInit);
  };

  // Function to extract text from the image using OCR
  const extractTextFromImage = async (imageUrl: string) => {
    setIsExtracting(true);
    try {
      // In a real application, we would send the image to an OCR service
      // For this demo, we'll simulate OCR with a timeout
      // and pretend to extract some text
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated text extraction - in a real app this would be the result from an OCR API
      let simulatedText = "";
      
      // Generate text similar to how notifications usually look
      const textOptions = [
        "Your order has been shipped! Expected delivery by Friday.",
        "Flash Sale: 50% off all items for the next 24 hours!",
        "New message from Sarah: Are we still meeting today?",
        "Your payment of $24.99 was received. Thank you!",
        "Weather alert: Heavy rain expected in your area tonight.",
        "Your subscription will renew in 3 days. Tap to manage.",
        "Breaking news: Major announcement from tech company.",
        "Reminder: Meeting with design team at 3pm today."
      ];
      
      simulatedText = textOptions[Math.floor(Math.random() * textOptions.length)];
      
      setExtractedText(simulatedText);
      return simulatedText;
    } catch (error) {
      console.error("Error extracting text:", error);
      return null;
    } finally {
      setIsExtracting(false);
    }
  };

  const generateCroppedImage = async () => {
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
        
        // Extract text from the cropped image
        const text = await extractTextFromImage(base64Image);
        
        // Pass both the cropped image and extracted text to the parent component
        onImageChange(base64Image, text || undefined);
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
    setExtractedText(null);
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
                onComplete={(c) => {
                  // Ensure we're setting the correct type of crop result
                  if (c.unit === '%') {
                    setCompletedCrop(c as PercentCrop);
                  } else {
                    // Convert pixel crop to percent crop if needed
                    const imgElement = imgRef.current;
                    if (imgElement) {
                      const percentCrop: PercentCrop = {
                        unit: '%',
                        x: (c.x / imgElement.width) * 100,
                        y: (c.y / imgElement.height) * 100,
                        width: (c.width / imgElement.width) * 100,
                        height: (c.height / imgElement.height) * 100
                      };
                      setCompletedCrop(percentCrop);
                    }
                  }
                }}
                aspect={undefined}
                className="max-w-full mx-auto"
              >
                <img 
                  ref={imgRef}
                  src={upImg} 
                  onLoad={onImageLoaded}
                  className="max-w-full max-h-[400px] object-contain"
                  alt="Original notification screenshot"
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
            {isExtracting && (
              <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Extracting text from image...</span>
              </div>
            )}
            {extractedText && !isExtracting && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <FileText className="h-4 w-4" />
                  <span>Text extracted successfully!</span>
                </div>
              </div>
            )}
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
