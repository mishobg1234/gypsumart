"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

interface RichTextViewerProps {
  content: string;
}

export function RichTextViewer({ content }: RichTextViewerProps) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto pointer-events-none",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-amber-600 underline hover:text-amber-700",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
