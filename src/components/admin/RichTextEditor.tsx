"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useCallback, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ImagePlus,
  Minus,
  Trash2,
  Maximize2,
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Започнете да пишете...",
}: RichTextEditorProps) {
  const previousContentRef = useRef<string>(content);
  
  // Extract image URLs from HTML content
  const extractImageUrls = (html: string): string[] => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const urls: string[] = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  };

  // Delete image from UploadThing if it's from utfs.io
  const deleteImageFromUploadThing = async (url: string) => {
    if (url.includes("utfs.io")) {
      try {
        await fetch("/api/uploadthing/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl: url }),
        });
      } catch (error) {
        console.error("Error deleting image from UploadThing:", error);
      }
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto cursor-pointer",
        },
        inline: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-green-600 underline hover:text-green-700",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      
      // Check for deleted images
      const oldImages = extractImageUrls(previousContentRef.current);
      const newImages = extractImageUrls(newContent);
      
      const deletedImages = oldImages.filter(url => !newImages.includes(url));
      
      // Delete removed images from UploadThing
      deletedImages.forEach(url => {
        deleteImageFromUploadThing(url);
      });
      
      previousContentRef.current = newContent;
      onChange(newContent);
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(
    (url: string) => {
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
    [editor]
  );

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Text formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("underline") ? "bg-gray-300" : ""
          }`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("strike") ? "bg-gray-300" : ""
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("code") ? "bg-gray-300" : ""
          }`}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("bulletList") ? "bg-gray-300" : ""
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("orderedList") ? "bg-gray-300" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("blockquote") ? "bg-gray-300" : ""
          }`}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""
          }`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""
          }`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""
          }`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive("link") ? "bg-gray-300" : ""
          }`}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        {/* Image Upload */}
        <div className="relative" title="Upload Image">
          <UploadButton
            endpoint="productImages"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                addImage(res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              alert(`Грешка при качване: ${error.message}`);
            }}
            appearance={{
              button:
                "p-2 rounded hover:bg-gray-200 text-gray-700 ut-ready:bg-transparent ut-uploading:bg-gray-200",
              allowedContent: "hidden",
            }}
            content={{
              button: ({ isUploading }) => (
                <ImagePlus
                  className={`h-4 w-4 ${isUploading ? "animate-pulse" : ""}`}
                />
              ),
            }}
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Horizontal Line"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Bubble Menu for Images */}
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ state }) => {
            const { selection } = state;
            const { $from } = selection;
            const node = $from.nodeAfter;
            
            // Show only when an image is in the selection
            if (node && node.type.name === "image") {
              return true;
            }
            
            // Check if the selection is a NodeSelection with an image
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (state.selection as any).node?.type.name === "image";
          }}
          className="bg-white border border-gray-300 shadow-lg rounded-lg p-2 flex items-center gap-1"
        >
          <button
            type="button"
            onClick={() => {
              const { selection } = editor.state;
              const node = (selection as any).node;
              
              if (node && node.type.name === "image") {
                const newSize = window.prompt(
                  "Въведете ширина на изображението (напр. 300px, 50%, или 100%):",
                  node.attrs.width || "100%"
                );
                
                if (newSize) {
                  editor.chain().focus().updateAttributes("image", {
                    width: newSize,
                    style: `width: ${newSize};`,
                  }).run();
                }
              }
            }}
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
            title="Resize image"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="text-sm font-medium">Размер</span>
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <button
            type="button"
            onClick={() => {
              const { selection } = editor.state;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const node = (selection as any).node;
              
              if (node && node.type.name === "image") {
                const imageSrc = node.attrs.src;
                
                // Delete image from editor
                editor.chain().focus().deleteSelection().run();
                
                // Delete from UploadThing
                deleteImageFromUploadThing(imageSrc);
              }
            }}
            className="flex items-center gap-2 p-2 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
            title="Delete image"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm font-medium">Изтрий</span>
          </button>
        </BubbleMenu>
      )}

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
