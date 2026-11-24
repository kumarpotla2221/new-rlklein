import React, { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline-white' | 'white' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button'; href?: never; to?: never };
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string; to?: never };
type ButtonAsLink = BaseProps & { as: 'link'; to: string; href?: never } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink;

export function Button({ variant = 'primary', size = 'md', fullWidth, loading, icon, iconPosition = 'left', children, className = '', ...rest }: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    loading ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {icon && iconPosition === 'left' && !loading && <span className="btn-icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && !loading && <span className="btn-icon">{icon}</span>}
    </>
  );

  if (rest.as === 'link') {
    const { as, to, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link to={to} className={classes} {...linkRest as Record<string, unknown>}>
        {content}
      </Link>
    );
  }

  if (rest.as === 'a') {
    const { as, href, ...anchorRest } = rest as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  const { as, ...btnRest } = rest as ButtonAsButton;
  return (
    <button className={classes} disabled={loading} {...btnRest}>
      {content}
    </button>
  );
}
