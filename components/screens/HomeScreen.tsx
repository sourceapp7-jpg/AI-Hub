
import React, { useRef } from 'react';
import { RefreshCw, Camera, X } from 'lucide-react';
import NeonBorder from '../NeonBorder';
import { ImageAttachment } from '../../types';

interface HomeScreenProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleGetResponses: () => void;
  isLoading: boolean;
  imageAttachment: ImageAttachment | null;
  setImageAttachment: (attachment: ImageAttachment | null) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ prompt, setPrompt, handleGetResponses, isLoading, imageAttachment, setImageAttachment }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setImageAttachment({
        data: base64Data,
        mimeType: file.type,
        fileName: file.name,
        preview: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center justify-center min-h-full p-6">
        <div className="w-full max-w-2xl">
          
          {imageAttachment && (
            <div className="mb-4">
              <NeonBorder>
                <div className="p-4 flex items-center gap-3">
                  <img src={imageAttachment.preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg"/>
                  <div className="flex-1 text-sm text-gray-300">
                    <div className="font-semibold">{imageAttachment.fileName}</div>
                    <div className="text-xs text-gray-500">Image attached - ChatGPT & Gemini will analyze it</div>
                  </div>
                  <button onClick={removeImage} className="p-2 hover:bg-red-500/20 rounded-lg transition" title="Remove image">
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </NeonBorder>
            </div>
          )}

          <NeonBorder className="mb-6 w-full">
            <textarea
              className="w-full min-h-[150px] bg-transparent text-gray-100 placeholder-gray-500 p-4 text-lg focus:outline-none resize-none"
              placeholder="Ask anything to all 4 AI models at once..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGetResponses();
                }
              }}
            />
          </NeonBorder>

          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <NeonBorder>
                <button
                  onClick={handleGetResponses}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full py-4 text-lg font-bold uppercase transition duration-200 rounded-xl flex items-center justify-center space-x-2 text-cyan-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <span>Get Responses</span>
                  )}
                </button>
              </NeonBorder>
            </div>

            <div className="w-16 h-16">
              <NeonBorder className="w-full h-full">
                <button onClick={() => fileInputRef.current?.click()} className="w-full h-full flex items-center justify-center bg-transparent rounded-xl hover:bg-white/10 transition duration-150" title="Upload Image">
                  <Camera className="w-7 h-7 text-fuchsia-500" />
                </button>
              </NeonBorder>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
