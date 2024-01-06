
import IconButton from '../IconButton/IconButton';
import { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './TextInput.module.scss';

export type TextInputType = 'email' | 'text' | 'password';

export interface TextInput {
  value: string;
  name: string;
  onChange: (value: string) => void;
  validationErrorMessage?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  id?: string;
  label?: string;
  type?: TextInputType,
  placeholder?: string;
  required?: boolean;
  extraClass?: string;
  autoFocus?: boolean;
  autoComplete?: string;
}

export const TextInput: FC<TextInput> = ({
  id,
  label,
  type = 'text',
  value,
  name,
  onChange,
  onKeyDown,
  onBlur,
  placeholder,
  required = false,
  extraClass,
  validationErrorMessage,
  autoFocus,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClasses = classNames(styles.input, {
    [`${extraClass}`]: extraClass,
    [`${styles['input--error']}`]: validationErrorMessage,
  });

  const getInputType = (): TextInputType => {
    if (type === 'password') {
      if (showPassword) return 'text';
      return 'password';
    }
    return type;
  };

  return (
    <div className={styles.inputcontainer}>
      {label
        && (
          <div className={styles.label}>
            {label}
          </div>
        )}
      <input
        id={id}
        className={inputClasses}
        value={value}
        name={name}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        type={getInputType()}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-required={required}
        required={required}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
      />
      {type === 'password' && (
        <div className={styles.showPassword}>
          <IconButton
            src={showPassword ? '/hide.svg' : '/show.svg'}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      )}
      {validationErrorMessage && (
        <div className={styles.validationErrorMessage}>
          {validationErrorMessage}
        </div>
      )}
    </div>
  );
};
