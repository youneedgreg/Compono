import React, { useMemo, memo, useState, useEffect } from "react";
import { useEditor, EditorContent, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Heading } from "@tiptap/extension-heading";
import { Underline } from "@tiptap/extension-underline";
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'

import "./form-wysiwyg-editor.css";
import { EditorToolbar } from "./editor-toolbar";
import customClass from "./extensions/textCustomStyle";
import { useFormBuilderStore } from "@/stores/form-builder-store";
interface FormWysiwygEditorProps {
  isEditable?: boolean;
  value: string;
  onChange: (content: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const TextColorStyle = TextStyle.extend({
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: element => {
          return {
            class: element.classList.toString(),
          }
        },
      },
    ]
  },
});

export const FormWysiwygEditor: React.FC<FormWysiwygEditorProps> = memo(
  ({ value, onChange, isEditable = false, onFocus, onBlur }) => {

    // Memoize editor extensions
    const extensions = useMemo(
      () => [
        StarterKit.configure({
          paragraph: {
            HTMLAttributes: {
              class: "leading-7 not-first:mt-6",
            },
          },
          codeBlock: {
            HTMLAttributes: {
              class:
                "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
            },
          },
          blockquote: {
            HTMLAttributes: {
              class: "mt-6 border-l-2 pl-6 italic",
            },
          },
          heading: false,
          bulletList: {
            HTMLAttributes: {
              class: "my-6 ml-6 list-disc [&>li]:mt-2",
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: "my-6 ml-6 list-decimal [&>li]:mt-2",
            },
          },
        }),
        Heading.configure({ levels: [1, 2, 3, 4] }).extend({
          levels: [1, 2, 3, 4],
          renderHTML({ node, HTMLAttributes }) {
            const level = this.options.levels.includes(node.attrs.level)
              ? node.attrs.level
              : this.options.levels[0];
            const classes: Record<number, string> = {
              1: "scroll-m-20 text-4xl font-extrabold tracking-tight @5xl:text-5xl",
              2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
              3: "scroll-m-20 text-2xl font-semibold tracking-tight",
              4: "scroll-m-20 text-xl font-semibold tracking-tight",
            };
            return [
              `h${level}`,
              mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: classes[level as 1 | 2 | 3 | 4],
              }),
              0,
            ];
          },
        }),
        Underline,
        TextColorStyle,
        customClass,
        TextAlign.configure({
          types: ['heading', 'paragraph', "textStyle"],
        })
      ],
      []
    );

    const setEditor = useFormBuilderStore((state) => state.setEditor);

    const editor = useEditor({
      editable: isEditable,
      immediatelyRender: true,
      extensions,
      content: value,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      onFocus: ({ editor }) => {
        onFocus?.();
        setEditor(editor);
      },
      onBlur: ({ editor }) => {
        onBlur?.();
      },
    }, [isEditable]);


    // Only update content when value prop changes and it's different from our local content

    if (!editor) {
      return null;
    }

    return (
      <>
        <EditorContent editor={editor} />
      </>
    );
  }
);

FormWysiwygEditor.displayName = "FormWysiwygEditor";
