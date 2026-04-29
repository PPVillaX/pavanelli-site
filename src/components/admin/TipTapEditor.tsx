'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useRef, useState } from 'react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: Props) {
  const [imageUploading, setImageUploading] = useState(false);
  const [showHtmlImport, setShowHtmlImport] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      ImageExt.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Comece a escrever...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  });

  if (!editor) return null;

  const btn = (active: boolean, disabled = false) =>
    `px-2 py-1 text-xs rounded cursor-pointer border-none transition-colors ${
      disabled ? 'opacity-40 cursor-not-allowed bg-gray-100 text-brand-gray' :
      active ? 'bg-brand-terracotta text-white' : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
    }`;

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setImageUploading(false);
    }
  };

  const addLink = () => {
    const url = prompt('URL do link:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const insertCta = (type: 'portfolio' | 'contato') => {
    const href = type === 'portfolio' ? '/portfolio' : '/contato';
    const label = type === 'portfolio' ? 'Ver portfólio completo →' : 'Fale com a gente →';
    editor.chain().focus().insertContent(`<p><a href="${href}">${label}</a></p>`).run();
  };

  const openHtmlImport = () => {
    setHtmlInput('');
    setShowHtmlImport(true);
  };

  const closeHtmlImport = () => {
    setShowHtmlImport(false);
    setHtmlInput('');
  };

  const insertHtmlAtCursor = () => {
    const trimmed = htmlInput.trim();
    if (!trimmed) return;
    editor.chain().focus().insertContent(trimmed).run();
    closeHtmlImport();
  };

  const replaceAllWithHtml = () => {
    const trimmed = htmlInput.trim();
    if (!trimmed) return;
    if (!confirm('Substituir TODO o conteúdo atual pelo HTML colado? Essa ação não pode ser desfeita pelo editor.')) return;
    editor.commands.setContent(trimmed);
    onChange(editor.getHTML());
    closeHtmlImport();
  };

  return (
    <div className="border border-[#d1d5db] rounded overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = '';
        }}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[#d1d5db] bg-gray-50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}>
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}>
          <em>I</em>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}>
          <s>S</s>
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}>
          H3
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>
          • Lista
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>
          1. Lista
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}>
          ❝ Citação
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button type="button" onClick={addLink} className={btn(editor.isActive('link'))}>
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUploading}
          className={btn(false, imageUploading)}
        >
          {imageUploading ? '⏳ Enviando...' : '🖼️ Imagem'}
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>
          ── Linha
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button type="button" onClick={() => insertCta('portfolio')} className={btn(false)} title="Inserir botão CTA para o portfólio">
          📋 CTA Portfólio
        </button>
        <button type="button" onClick={() => insertCta('contato')} className={btn(false)} title="Inserir botão CTA para contato">
          💬 CTA Contato
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button
          type="button"
          onClick={openHtmlImport}
          className={btn(false)}
          title="Cole HTML formatado (h2, h3, p, listas etc.) e insira no editor"
        >
          {'</>'} Importar HTML
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Modal de importação de HTML */}
      {showHtmlImport && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeHtmlImport(); }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="font-display text-lg font-semibold text-brand-graphite">Importar HTML</h3>
              <p className="text-xs text-brand-gray mt-1">
                Cole HTML com tags suportadas (h2, h3, h4, p, strong, em, ul, ol, li, blockquote, a, img, hr).
                Tags não suportadas serão removidas pelo editor.
              </p>
            </div>

            <div className="px-5 py-4 flex-1 overflow-auto">
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder={'<h2>Perguntas frequentes</h2>\n<h3>Sua pergunta?</h3>\n<p>Resposta...</p>'}
                rows={14}
                className="w-full text-xs font-mono border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-brand-terracotta resize-y"
                autoFocus
              />
              <p className="text-xs text-brand-gray mt-2">
                {htmlInput.trim().length === 0
                  ? 'Cole o HTML acima.'
                  : `${htmlInput.length} caracteres prontos para inserir.`}
              </p>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={closeHtmlImport}
                className="px-4 py-2 text-sm rounded border border-gray-300 text-brand-gray hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={replaceAllWithHtml}
                disabled={!htmlInput.trim()}
                className="px-4 py-2 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Substituir tudo
              </button>
              <button
                type="button"
                onClick={insertHtmlAtCursor}
                disabled={!htmlInput.trim()}
                className="px-4 py-2 text-sm rounded bg-brand-terracotta text-white hover:opacity-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Inserir no cursor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
