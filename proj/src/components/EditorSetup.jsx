
import { Editor } from "@monaco-editor/react";
import { mimeTypeEditorMap } from "../utils/FileSelection";

  const EditorTypes = ({ mime, content, onChange, onMount }) => {
    if (!mime) return <div className="p-4">Loading file...</div>;

    if (mimeTypeEditorMap[mime]) {
      return (
        <div className="h-full w-full">
          <Editor
            height="100%"
            language={mimeTypeEditorMap[mime] || "plaintext"}
            value={content}
            onMount={onMount}
            onChange={onChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: window.innerWidth > 768 },
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      );
    }

    return <div className="p-4">Unsupported file type: {mime}</div>;
  };

  export default EditorTypes;