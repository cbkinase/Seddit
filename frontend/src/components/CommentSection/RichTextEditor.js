import { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';

function RichTextEditor({ content, setContent, setTextContent, isPost, isCommunity }) {
  const editorRef = useRef(null);
  let placeholder = "What are your thoughts?";

  if (isPost || isCommunity) placeholder = "Enter text (optional)";


  const handleChange = (content, delta, source, editor) => {
    setContent(content);
    setTextContent(editor.getText());
  };

  useEffect(() => {
    // Ensures that on component mount, the calling prop
    // Gets the current state of the editor (during edits)
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      const txt = editor.getText();
      setTextContent(txt);
    }
  }, [])

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

  return (
    <div>
      <ReactQuill
        ref={editorRef}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        value={content}
        onChange={handleChange}
      />
    </div>
  );
}

export default RichTextEditor;
