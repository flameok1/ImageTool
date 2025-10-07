import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop';

export function WorkingImageCrop() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
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
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    console.log('Image loaded with dimensions:', width, 'x', height);
    
    // 建立初始裁切區域
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
        },
        1, // 1:1 比例
        width,
        height
      ),
      width,
      height
    );
    console.log('Setting initial crop:', crop);
    setCrop(crop);
  }

  const onCropChange = useCallback((crop: Crop) => {
    setCrop(crop);
  }, []);

  const onCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  // 更新預覽畫布
  React.useEffect(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 512;
    canvas.height = 512;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      512,
      512
    );
  }, [completedCrop]);

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      return;
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = 'cropped-image.png';
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">圖片裁切工具</h2>
        
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
          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              圖片已載入，裁切狀態: {crop ? '已設定' : '未設定'}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">裁切區域</h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <ReactCrop
                    crop={crop}
                    onChange={onCropChange}
                    onComplete={onCropComplete}
                    aspect={1}
                    minWidth={100}
                    minHeight={100}
                    className="max-h-96"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '400px',
                        display: 'block'
                      }}
                    />
                  </ReactCrop>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">預覽 (512x512)</h3>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <canvas
                    ref={previewCanvasRef}
                    className="border border-gray-200 rounded mx-auto block"
                    style={{ 
                      width: '256px', 
                      height: '256px',
                      backgroundColor: '#f9fafb'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onDownloadCropClick}
                disabled={!completedCrop}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
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
