"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

type Props = {
  content: string;
  onChange: (html: string, wordCount: number) => void;
  placeholder?: string;
};

export default function Editor({ content, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || "What's on your mind today?" }),
      CharacterCount,
    ],
    content,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      onChange(html, words);
    },
  });

  if (!editor) return null;

  const tools = [
    { label: "B", action: () => editor.chain().focus().toggleBold().run(), name: "bold" },
    { label: "I", action: () => editor.chain().focus().toggleItalic().run(), name: "italic" },
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), name: "heading" },
    { label: "❝", action: () => editor.chain().focus().toggleBlockquote().run(), name: "blockquote" },
    { label: "• List", action: () => editor.chain().focus().toggleBulletList().run(), name: "bulletList" },
    { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run(), name: "orderedList" },
  ];

  return (
    <div className="editor-wrap">
      <div className="editor-toolbar">
        {tools.map((t) => (
          <button
            key={t.name}
            type="button"
            className={`toolbar-btn ${editor.isActive(t.name) ? "is-active" : ""}`}
            onClick={t.action}
          >
            {t.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
