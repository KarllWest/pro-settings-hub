import { useState } from 'react';
import { supabase } from '../services/supabase';
import { Upload, Loader2, Camera } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Props {
  userId: string;
  url: string | null;
  onUpload: (url: string) => void;
}

export default function AvatarUpload({ userId, url, onUpload }: Props) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Завантажуємо в Supabase Storage (bucket 'avatars')
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Отримуємо публічне посилання
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      onUpload(data.publicUrl);
      showToast('Avatar uploaded!', 'success');

    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group w-32 h-32 md:w-40 md:h-40">
      <div className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-slate-800 bg-slate-900 shadow-xl relative">
        {url ? (
          <img
            src={url}
            alt="Avatar"
            className="w-full h-full object-cover object-top"
          />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700">
                <Camera size={40} />
            </div>
        )}
        
        {/* Оверлей при завантаженні */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <Loader2 className="animate-spin text-yellow-400" />
          </div>
        )}
      </div>

      {/* Кнопка завантаження */}
      <div className="absolute -bottom-2 -right-2">
        <label className="cursor-pointer bg-yellow-400 text-slate-900 p-3 rounded-xl shadow-lg hover:bg-yellow-300 transition-transform active:scale-95 flex items-center justify-center">
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            <input
            style={{ visibility: 'hidden', position: 'absolute' }}
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            />
        </label>
      </div>
    </div>
  );
}