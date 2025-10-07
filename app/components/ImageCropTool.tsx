import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop';

export function ImageCropTool() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      console.log('File selected:', e.target.files[0]);
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const result = reader.result?.toString() || '';
        console.log('Image loaded, src length:', result.length);
        setImgSrc(result);
      });
      reader.addEventListener('error', (error) => {
        console.error('Error reading file:', error);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    console.log('Image loaded with dimensions:', width, 'x', height);
    
    // 確保圖片載入後立即設定 crop
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // 固定為 1:1 比例
        width,
        height
      ),
      width,
      height
    );
    console.log('Setting initial crop:', crop);
    setCrop(crop);
  }

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      const previewUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'cropped-image.png';
      anchor.href = previewUrl;
      anchor.click();
      URL.revokeObjectURL(previewUrl);
    }, 'image/png');
  }

  const onCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  React.useEffect(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const pixelRatio = window.devicePixelRatio;
    canvas.width = 512;
    canvas.height = 512;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      512,
      512
    );
  }, [completedCrop]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選擇圖片 (1024x1024 或更大)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {imgSrc && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-2">
              圖片已載入，crop 狀態: {crop ? '已設定' : '未設定'}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={onCropComplete}
                  aspect={aspect}
                  minWidth={512}
                  minHeight={512}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                    onLoad={onImageLoad}
                    className="max-w-full max-h-96"
                  />
                </ReactCrop>
              </div>
              
              <div className="flex-1">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    預覽 (512x512)
                  </h3>
                  <canvas
                    ref={previewCanvasRef}
                    className="border border-gray-300 rounded-lg mx-auto"
                    style={{
                      width: 256,
                      height: 256,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    縮放: {Math.round(scale * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    旋轉: {rotate}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={rotate}
                    onChange={(e) => setRotate(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>

              <button
                onClick={onDownloadCropClick}
                disabled={!completedCrop}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                下載裁切圖片
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
