import React, { ComponentType } from 'react';
import { useKoto } from './Provider';
import { KotoContextValue } from './types';

/**
 * Higher-Order Component for class components
 * Wraps a component and injects translation props
 */
export function withTranslation<P extends object>(
  Component: ComponentType<P & WithTranslationProps>
): ComponentType<Omit<P, keyof WithTranslationProps>> {
  const ComponentWithTranslation = (props: Omit<P, keyof WithTranslationProps>) => {
    const { t, locale, loading, setLocale, translations, error } = useKoto();
    
    return (
      <Component
        {...(props as P)}
        t={t}
        locale={locale}
        loading={loading}
        setLocale={setLocale}
        translations={translations}
        error={error}
      />
    );
  };
  
  ComponentWithTranslation.displayName = `withTranslation(${Component.displayName || Component.name || 'Component'})`;
  
  return ComponentWithTranslation;
}

/**
 * Props injected by withTranslation HOC
 */
export interface WithTranslationProps {
  t: KotoContextValue['t'];
  locale: KotoContextValue['locale'];
  loading: KotoContextValue['loading'];
  setLocale: KotoContextValue['setLocale'];
  translations?: KotoContextValue['translations'];
  error?: KotoContextValue['error'];
}

/**
 * Render prop component for more flexible usage
 */
export interface TranslationProps {
  children: (props: KotoContextValue) => React.ReactNode;
}

export function Translation({ children }: TranslationProps) {
  const kotoContext = useKoto();
  return <>{children(kotoContext)}</>;
}

/**
 * Consumer component for direct context access
 * Useful for class components that need conditional rendering
 */
export class KotoConsumer extends React.Component<TranslationProps> {
  render() {
    return <Translation>{this.props.children}</Translation>;
  }
}