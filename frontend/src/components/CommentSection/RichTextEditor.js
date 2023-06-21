import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';

function RichTextEditor({ content, setContent, setTextContent }) {

  const handleChange = (content, delta, source, editor) => {
    setContent(content);
    setTextContent(editor.getText());
  };

  let modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
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
      <ReactQuill modules={modules} formats={formats} placeholder="What are your thoughts?" value={content} onChange={handleChange} />
    </div>
  );
}

export default RichTextEditor;
