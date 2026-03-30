'use client';

import { useState, useMemo } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  title: string;
  table: string;
  initialCategories: Category[];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CategoriesAdmin({ title, table, initialCategories }: Props) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass = 'px-3 py-2 border border-[#d1d5db] rounded text-brand-graphite text-sm outline-none transition-colors focus:border-brand-terracotta bg-white';

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    setError('');
    const slug = newSlug.trim() || generateSlug(newName.trim());
    const { data, error: err } = await supabase
      .from(table)
      .insert({ name: newName.trim(), slug })
      .select('id,name,slug')
      .single();
    if (err) {
      setError(err.message);
    } else if (data) {
      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName('');
      setNewSlug('');
    }
    setSaving(false);
  }

  async function handleSaveEdit() {
    if (!editId || !editName.trim()) return;
    setSaving(true);
    setError('');
    const slug = editSlug.trim() || generateSlug(editName.trim());
    const { error: err } = await supabase
      .from(table)
      .update({ name: editName.trim(), slug })
      .eq('id', editId);
    if (err) {
      setError(err.message);
    } else {
      setCategories(prev =>
        prev.map(c => c.id === editId ? { ...c, name: editName.trim(), slug } : c)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditId(null);
    }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir "${name}"? Posts/projetos com esta categoria ficarão sem categoria.`)) return;
    setError('');
    const { error: err } = await supabase.from(table).delete().eq('id', id);
    if (err) {
      setError(err.message);
    } else {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  }

  return (
    <div className="mb-10">
      <h2 className="text-lg font-display font-bold text-brand-graphite mb-4">{title}</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>
      )}

      {/* Add new */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 mb-4">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={newName}
            onChange={e => {
              setNewName(e.target.value);
              setNewSlug(generateSlug(e.target.value));
            }}
            className={`${inputClass} flex-1 min-w-[160px]`}
            placeholder="Nome da categoria"
          />
          <input
            type="text"
            value={newSlug}
            onChange={e => setNewSlug(e.target.value)}
            className={`${inputClass} flex-1 min-w-[120px] font-mono text-xs`}
            placeholder="slug"
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newName.trim()}
            className="px-4 py-2 text-sm text-white bg-brand-terracotta border-none rounded cursor-pointer hover:bg-brand-terracotta-dark transition-colors disabled:opacity-50 font-medium"
          >
            {saving ? '...' : 'Adicionar'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-5 py-8 text-center text-brand-gray text-sm">
            Nenhuma categoria cadastrada.
          </div>
        ) : (
          <ul className="divide-y divide-[#f3f4f6]">
            {categories.map(cat => (
              <li key={cat.id} className="px-5 py-3">
                {editId === cat.id ? (
                  <div className="flex gap-3 flex-wrap items-center">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className={`${inputClass} flex-1 min-w-[140px]`}
                    />
                    <input
                      type="text"
                      value={editSlug}
                      onChange={e => setEditSlug(e.target.value)}
                      className={`${inputClass} flex-1 min-w-[120px] font-mono text-xs`}
                    />
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="px-3 py-1.5 text-xs text-white bg-brand-terracotta border-none rounded cursor-pointer hover:bg-brand-terracotta-dark disabled:opacity-50"
                    >Salvar</button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1.5 text-xs text-brand-gray border border-[#d1d5db] rounded cursor-pointer bg-white hover:bg-gray-50"
                    >Cancelar</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-sm text-brand-graphite font-medium">{cat.name}</span>
                      <span className="ml-2 text-xs text-brand-gray/60 font-mono">{cat.slug}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditSlug(cat.slug); }}
                        className="text-xs text-brand-gray hover:text-brand-graphite bg-transparent border-none cursor-pointer"
                      >Editar</button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-xs text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer"
                      >Excluir</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
