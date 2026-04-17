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
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}>
          <strong>B</strong>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}>
          <em>I</em>
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}>
          <s>S</s>
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}>
          H3
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>
          • Lista
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>
          1. Lista
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}>
          ❝ Citação
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button onClick={addLink} className={btn(editor.isActive('link'))}>
          🔗 Link
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUploading}
          className={btn(false, imageUploading)}
        >
          {imageUploading ? '⏳ Enviando...' : '🖼️ Imagem'}
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>
          ── Linha
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button onClick={() => insertCta('portfolio')} className={btn(false)} title="Inserir botão CTA para o portfólio">
          📋 CTA Portfólio
        </button>
        <button onClick={() => insertCta('contato')} className={btn(false)} title="Inserir botão CTA para contato">
          💬 CTA Contato
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
