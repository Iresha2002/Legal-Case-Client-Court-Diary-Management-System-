import { useState } from 'react';
import TextField from './TextField.jsx';
import eyeIcon from '../../assets/icons/eye.svg';

export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className={`shrink-0 rounded-sm transition-opacity hover:opacity-100 ${visible ? 'opacity-100' : 'opacity-80'}`}
        >
          <img src={eyeIcon} alt="" width="18" height="18" className="block" />
        </button>
      }
      {...props}
    />
  );
}
