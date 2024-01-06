import React from 'react';
import classNames from 'classnames';
import styles from './IconButton.module.scss';

interface IconButtonProps {
  src: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  extraClass?: string;
}

// eslint-disable-next-line func-names
const IconButton = function (props: IconButtonProps, ref: React.LegacyRef<HTMLDivElement> | undefined) {
  const {
    extraClass,
    src,
    style,
    onClick,
  } = props;

  const iconClasses = classNames(styles.iconButton, {
    [`${extraClass}`]: extraClass,
  });

  return (
    <div
      className={iconClasses}
      ref={ref}
      onClick={onClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClick?.();
        }
      }}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt='icon' />
    </div>
  );
};

export default React.forwardRef(IconButton);
