import { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';

function RichTextEditor({ content, setContent, setTextContent, isPost, isCommunity }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  let placeholder = "What are your thoughts?";

  if (isCommunity) placeholder = "Enter text (optional)";
  if (isPost) placeholder = "Text (optional)";


  const handleChange = (content, delta, source, editor) => {
    setContent(content);
    setTextContent(editor.getText());
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };


  useEffect(() => {
    // Ensures that on component mount, the calling prop
    // Gets the current state of the editor (during edits)
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      const txt = editor.getText();
      setTextContent(txt);
    }
  }, [setTextContent])

  let modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link']
    ],
  }

  let formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link'
  ]
  let divClassName;
  if (!isFocused) {
    divClassName = "";
  }
  else {
    if (!isPost && !isCommunity) {
      divClassName = "comment-rte";
    }
    else {
      divClassName = "other-rte";
    }
  }
  if (isFocused && isPost) divClassName = "comment-rte";
  return (
    <div className={divClassName}>
      <ReactQuill
        style={{borderRadius: "5px"}}
        ref={editorRef}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        value={content}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
}

export default RichTextEditor;
