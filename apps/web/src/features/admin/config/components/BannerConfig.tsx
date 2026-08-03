'use client';

import { useState, useEffect } from 'react';
import { ImageIcon, Save } from 'lucide-react';
import { configService } from '@/services/config.service';

export function BannerConfig() {
  const [bannerUrl, setBannerUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    configService.getStatus().then((c) => setBannerUrl(c.banner || '')).catch(() => {});
  }, []);

  const save = async () => {
    setLoading(true);
    setMsg(null);
    await configService.updateBanner(bannerUrl);
    setMsg('Banner actualizado');
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold mb-4 font-[var(--font-montserrat)] text-[#212121] flex items-center gap-2"><ImageIcon size={18} /> Banner Hero</h2>
      {msg && <p className="text-green-600 mb-4 text-sm">{msg}</p>}
      <input type="url" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)}
        placeholder="https://..." className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#D9383A]" />
      {bannerUrl && (
        <div className="mt-3 h-32 bg-gray-100 rounded-lg overflow-hidden">
          <img src={bannerUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <button onClick={save} disabled={loading || !bannerUrl}
        className="w-full mt-4 bg-[#D9383A] text-white py-2 rounded-lg font-bold hover:bg-[#b52d2f] disabled:bg-gray-400 transition flex items-center justify-center gap-2">
        <Save size={16} /> {loading ? 'Guardando...' : 'Guardar banner'}
      </button>
    </div>
  );
}
