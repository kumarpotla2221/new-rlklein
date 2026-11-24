import React, { type ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean; // for dark backgrounds
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left', light, className = '', children }: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align} ${light ? 'section-heading--light' : ''} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backgroundImage?: string;
  dark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PageHero({ eyebrow, title, subtitle, actions, backgroundImage, dark = true, size = 'md' }: PageHeroProps) {
  return (
    <section
      className={`page-hero page-hero--${size} ${dark ? 'page-hero--dark' : ''}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <div className="container">
        <div className="page-hero__content">
          {eyebrow && <p className="eyebrow" style={dark ? { color: 'rgba(255,255,255,0.7)' } : undefined}>{eyebrow}</p>}
          <h1>{title}</h1>
          {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
          {actions && <div className="page-hero__actions">{actions}</div>}
        </div>
      </div>
    </section>
  );
}

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <div className="container">
        <ol className="breadcrumbs__list">
          {items.map((item, i) => (
            <li key={i} className="breadcrumbs__item">
              {item.href && i < items.length - 1 ? (
                <a href={item.href} className="breadcrumbs__link">{item.label}</a>
              ) : (
                <span className="breadcrumbs__current" aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
