import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import { Save, User, Mouse, Monitor, Keyboard, Cpu, Loader2 } from 'lucide-react';

export default function ProfileForm({ user, profile, onUpdate }: any) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    bio: '',
    mouse: '',
    keyboard: '',
    headset: '',
    monitor: '',
    gpu: '',
    sensitivity: '',
    dpi: '',
    edpi: '',
    resolution: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        bio: profile.bio || '',
        mouse: profile.mouse || '',
        keyboard: profile.keyboard || '',
        headset: profile.headset || '',
        monitor: profile.monitor || '',
        gpu: profile.gpu || '',
        sensitivity: profile.sensitivity || '',
        dpi: profile.dpi || '',
        edpi: profile.edpi || '',
        resolution: profile.resolution || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      showToast('Profile updated successfully!', 'success');
      if (onUpdate) onUpdate();
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* General Info */}
      <Section title="General Info" icon={<User className="text-yellow-400" />}>
        <Input label="Nickname" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="s1mple" />
        <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-widest">Bio</label>
            <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition resize-none"
                placeholder="Tell us about yourself..."
            />
        </div>
      </Section>

      {/* Gear */}
      <Section title="Gear Setup" icon={<Mouse className="text-blue-400" />}>
        <Input label="Mouse" name="mouse" value={formData.mouse} onChange={handleChange} icon={<Mouse size={16}/>} />
        <Input label="Keyboard" name="keyboard" value={formData.keyboard} onChange={handleChange} icon={<Keyboard size={16}/>} />
        <Input label="Headset" name="headset" value={formData.headset} onChange={handleChange} icon={<User size={16}/>} />
        <Input label="Monitor" name="monitor" value={formData.monitor} onChange={handleChange} icon={<Monitor size={16}/>} />
        <Input label="GPU" name="gpu" value={formData.gpu} onChange={handleChange} icon={<Cpu size={16}/>} />
      </Section>

      {/* Settings (CS2 Style) */}
      <Section title="Game Settings (CS2)" icon={<Monitor className="text-green-400" />}>
         <Input label="Sensitivity" name="sensitivity" type="number" step="0.01" value={formData.sensitivity} onChange={handleChange} />
         <Input label="DPI" name="dpi" type="number" value={formData.dpi} onChange={handleChange} />
         <Input label="eDPI" name="edpi" type="number" value={formData.edpi} onChange={handleChange} />
         <Input label="Resolution" name="resolution" value={formData.resolution} onChange={handleChange} placeholder="1280x960" />
      </Section>

      <div className="flex justify-end pt-4">
        <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-300 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Save Profile
        </button>
      </div>
    </form>
  );
}

const Section = ({ title, icon, children }: any) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            {icon}
            <h3 className="text-xl font-black italic uppercase text-white tracking-wider">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const Input = ({ label, name, value, onChange, type = "text", placeholder, icon, step }: any) => (
    <div className="relative group">
        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-[0.2em]">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-400 transition-colors">{icon}</div>}
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                step={step}
                placeholder={placeholder}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-white font-bold focus:border-yellow-400 focus:outline-none transition ${icon ? 'pl-12 pr-4' : 'px-4'}`}
            />
        </div>
    </div>
);