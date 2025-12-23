"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showLineNumbers?: boolean;
  wrapCode?: boolean;
  readOnly?: boolean;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  showLineNumbers = true,
  wrapCode = false,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const extensions = useMemo(() => {
    const exts: Extension[] = [javascript()];
    if (wrapCode) {
      exts.push(EditorView.lineWrapping);
    }
    return exts;
  }, [wrapCode]);

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      theme={isDark ? oneDark : "light"}
      placeholder={placeholder}
      editable={!readOnly}
      readOnly={readOnly}
      basicSetup={{
        lineNumbers: showLineNumbers,
        highlightActiveLineGutter: showLineNumbers,
        highlightActiveLine: true,
        foldGutter: false,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: false,
        rectangularSelection: true,
        crosshairCursor: false,
        highlightSelectionMatches: true,
      }}
      className={className}
      style={{
        fontSize: "14px",
        height: "100%",
      }}
    />
  );
}
