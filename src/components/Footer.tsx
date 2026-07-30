'use client';

import styles from './components.module.css';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div>
          <div className={styles.footerBrand}>
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.footerLogoIcon}>
              <polygon points="13,6 3,24 23,24" fill="var(--color-primary)" />
              <polygon points="21,11 13,24 29,24" fill="var(--color-white)" />
              <polygon points="13,24 16,19 18,24" fill="var(--color-black)" />
            </svg>
            SUMMIT<span>OUTDOOR</span>
          </div>
          <p className={styles.footerDesc}>
            {t('footer.desc')}
          </p>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>{t('footer.shop')}</h3>
          <ul className={styles.footerList}>
            <li>{t('footer.men')}</li>
            <li>{t('footer.women')}</li>
            <li>{t('footer.trail')}</li>
            <li>{t('footer.hiking')}</li>
            <li>{t('footer.accessories')}</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>{t('footer.support')}</h3>
          <ul className={styles.footerList}>
            <li>{t('footer.track')}</li>
            <li>{t('footer.returns')}</li>
            <li>{t('footer.warranty')}</li>
            <li>{t('footer.contact')}</li>
            <li>{t('footer.faq')}</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.footerColTitle}>{t('footer.discover')}</h3>
          <ul className={styles.footerList}>
            <li>{t('footer.about')}</li>
            <li>{t('footer.events')}</li>
            <li>{t('footer.blog')}</li>
            <li>{t('footer.jobs')}</li>
          </ul>
        </div>
      </div>
      <div className={styles.copyright}>
        <div className="container">
          &copy; {new Date().getFullYear()} {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
