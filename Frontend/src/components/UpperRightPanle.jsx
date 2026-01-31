import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";

function UpperRightPanle({ prop, onCodeChange }) {
  const [language, setLanguage] = useState("cpp");
  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;

    onCodeChange?.(editor.getValue());
  }

  function handleEditorChange(value) {
    onCodeChange?.(value);
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      editorRef.current?.layout();
    });

    const container = document.getElementById("editor-wrapper");
    if (container) resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const initialCode = prop?.initialCode || [];

  useEffect(() => {
    const codeObj = initialCode.find(obj => obj.language === language);
    if (codeObj && editorRef.current) {
      editorRef.current.setValue(codeObj.code);
      onCodeChange?.(codeObj.code);
    }
  }, [language, initialCode]);

  return (
    <div className="h-full flex flex-col">
      <div className="h-12 bg-amber-200 flex items-center px-1">
        <select
          className="select w-30"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>

      <hr className="border-dashed" />

      <div id="editor-wrapper" className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollbar: { vertical: "hidden", horizontal: "hidden" }
          }}
        />
      </div>
    </div>
  );
}

export default UpperRightPanle;
