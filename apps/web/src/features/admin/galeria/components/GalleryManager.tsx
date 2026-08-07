'use client';

import { useState, useEffect, useRef } from 'react';
import { galleryService } from '@/services/gallery.service';
import { GalleryImage } from '@/types';
import { Image, Upload, Pencil, Trash2, Power, PowerOff, X } from 'lucide-react';

export function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setImages(await galleryService.getAll()); } catch { setError('Error al cargar'); }
    setLoading(false);
  };

  const reset = () => {
    setTitle(''); setOrder(0); setSelectedFile(null); setPreviewUrl(null); setEditingId(null); setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f);
      const r = new FileReader();
      r.onload = () => setPreviewUrl(r.result as string);
      r.readAsDataURL(f);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      try {
        setUploading(true);
        setError(null);
        await galleryService.update(editingId, { title, order });
        setMsg('Imagen actualizada');
        reset(); load();
      } catch (err: any) { setError(err.message); }
      setUploading(false);
      return;
    }
    if (!selectedFile) { setError('Selecciona una imagen'); return; }
    try {
      setUploading(true);
      setError(null);
      await galleryService.upload(selectedFile, title, order);
      setMsg('Imagen subida');
      reset(); load();
    } catch (err: any) { setError(err.message); }
    setUploading(false);
  };

  const edit = (img: GalleryImage) => { setTitle(img.title); setOrder(img.order || 0); setEditingId(img._id || null); setSelectedFile(null); setPreviewUrl(null); };
  const toggle = async (id: string | undefined) => { if (!id) return; try { await galleryService.toggleActive(id); load(); } catch { setError('Error'); } };
  const del = async (id: string | undefined) => { if (!id || !confirm('Eliminar imagen?')) return; try { await galleryService.delete(id); load(); setMsg('Imagen eliminada'); } catch { setError('Error'); } };

  if (loading) return <div className="bg-white rounded-lg p-4 shadow-md"><p className="text-[#757575] text-sm">Cargando galeria...</p></div>;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold mb-4 font-[var(--font-montserrat)] text-[#212121] flex items-center gap-2"><Image size={18} /> Galeria</h2>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
      {msg && <p className="text-green-600 mb-4 text-sm">{msg}</p>}

      <form onSubmit={submit} className="space-y-3 mb-6 border-b pb-6">
        <h3 className="font-semibold text-[#212121] flex items-center gap-2">
          {editingId ? <Pencil size={14} /> : <Upload size={14} />} {editingId ? 'Editar imagen' : 'Subir nueva imagen'}
        </h3>
        {!editingId && (
          <input type="file" ref={fileRef} onChange={handleFile} accept="image/jpeg,image/png,image/webp,image/gif"
            className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#D9383A]" required disabled={uploading} />
        )}
        {previewUrl && <div className="h-32 bg-gray-100 rounded-lg overflow-hidden"><img src={previewUrl} alt="Preview" className="h-full w-full object-cover" /></div>}
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo" required disabled={uploading}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#D9383A]" />
        <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
          className="w-24 px-4 py-2 border-2 border-gray-300 rounded-lg" disabled={uploading} />
        <div className="flex gap-2">
          <button type="submit" disabled={uploading || (!editingId && !selectedFile)}
            className="px-6 py-2 bg-[#D9383A] text-white rounded-lg font-semibold hover:bg-[#b52d2f] disabled:bg-gray-400 transition text-sm">
            {uploading ? 'Subiendo...' : editingId ? 'Actualizar' : 'Subir'}
          </button>
          {(editingId || selectedFile) && (
            <button type="button" onClick={reset} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 text-sm">Cancelar</button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.length === 0 ? <p className="text-[#757575] text-sm col-span-full">No hay imagenes</p> : (
          images.map((img) => (
            <div key={img._id} className={`relative group border-2 rounded-lg overflow-hidden ${img.active ? 'border-green-200' : 'border-gray-200 opacity-50'}`}>
              <div className="h-32 bg-gray-100">
                <img src={img.imageUrl} alt={img.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold truncate">{img.title}</p>
              </div>
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => toggle(img._id)} className={`p-1.5 rounded text-white text-xs ${img.active ? 'bg-green-600' : 'bg-gray-400'}`}>
                  {img.active ? <Power size={12} /> : <PowerOff size={12} />}
                </button>
                <button onClick={() => edit(img)} className="p-1.5 bg-blue-600 text-white rounded"><Pencil size={12} /></button>
                <button onClick={() => del(img._id)} className="p-1.5 bg-red-600 text-white rounded"><Trash2 size={12} /></button>
              </div>
              {!img.active && <div className="absolute bottom-1 left-1 bg-gray-600 text-white text-[10px] px-1.5 py-0.5 rounded">Inactivo</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
