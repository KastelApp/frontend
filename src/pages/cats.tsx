import { PreviewMarkdown } from "@/components/app/markdown/index.tsx";
import React, { useState, useEffect } from "react";

const MarkdownEditor = () => {
  const [text, setText] = useState('```js\nconsole.log("hello world")\n```');

  useEffect(() => {}, [text]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          whiteSpace: "pre-line",
          outline: "none",
          border: "5px solid transparent",
          borderRadius: "10px",
          fontSize: "small",
        }}
      >
        <PreviewMarkdown>{text}</PreviewMarkdown>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          height: "200px",
          position: "absolute",
          background: "transparent",
          color: "transparent",
          zIndex: 1,
          caretColor: "blue",
          outline: "none",
          border: "5px solid green",
          borderRadius: "10px",
          fontSize: "small",
        }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  );
};

export default MarkdownEditor;
