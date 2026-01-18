import { useState } from 'react';
import { supabase } from '../services/supabase';
import { Loader2, User, Upload } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Props {
  url: string | null;
  size?: number; // Розмір у пікселях (опціонально)
  onUpload: (url: string) => void;
  userId: string;
}

export default function AvatarUpload({ url, onUpload, userId }: Props) {
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Використовуємо timestamp для унікальності та userId для безпеки
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Завантажуємо файл
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Отримуємо публічне посилання
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      onUpload(data.publicUrl);
      showToast('Avatar uploaded successfully!', 'success');
      
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group w-40 h-40">
        <div className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-slate-800 bg-slate-900 shadow-2xl relative">
          
          {/* Зображення */}
          {url ? (
            <img
              src={url}
              alt="Avatar"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-100 group-hover:opacity-50"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-950 group-hover:text-slate-500 transition-colors">
              <User size={64} />
            </div>
          )}

          {/* Індикатор завантаження */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
              <Loader2 className="text-yellow-400 animate-spin" size={32} />
            </div>
          )}

          {/* Оверлей з кнопкою (при наведенні) */}
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <div className="bg-yellow-400 text-slate-900 p-3 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
               {uploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
            </div>
            <span className="text-[10px] font-black uppercase text-white tracking-widest mt-3 drop-shadow-md">
              Change Photo
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}