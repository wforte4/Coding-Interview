import { FC } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

export enum ButtonTheme {
  DEFAULT = 'default',
}

export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode | string;
  size?: ButtonSize;
  theme?: ButtonTheme;
  extraClass?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: FC<ButtonProps> = ({
  theme = ButtonTheme.DEFAULT,
  size = 'medium',
  onClick,
  extraClass,
  children,
  disabled = false,
  type = 'button',
}) => {
  const buttonClasses = classNames(styles.button, {
    [`${styles[`button--${theme}`]}`]: theme,
    [`${styles[`button--size-${size}`]}`]: size,
    [`${extraClass}`]: extraClass,
  });

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
