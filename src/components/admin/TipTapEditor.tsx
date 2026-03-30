'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: Props) {
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
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  });

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `px-2 py-1 text-xs rounded cursor-pointer border-none transition-colors ${
      active ? 'bg-brand-terracotta text-white' : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
    }`;

  const addImage = () => {
    const url = prompt('URL da imagem:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = prompt('URL do link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-[#d1d5db] rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[#d1d5db] bg-gray-50">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
          <strong>B</strong>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
          <em>I</em>
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))}>
          H3
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
          • Lista
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
          1. Lista
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>
          ❝ Citação
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button onClick={addLink} className={btnClass(editor.isActive('link'))}>
          🔗 Link
        </button>
        <button onClick={addImage} className={btnClass(false)}>
          🖼️ Imagem
        </button>
        <span className="w-px h-6 bg-gray-200 self-center mx-1" />
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)}>
          ── Linha
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
