import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { servicesData } from '../../data/services';
import type { ServicePackage, ServiceData } from '../../data/services';
import './ServiceModal.css';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceKey: string;
  color: string;
}

export default function ServiceModal({ isOpen, onClose, serviceKey, color }: ServiceModalProps) {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [visiblePackages, setVisiblePackages] = useState<ServicePackage[]>([]);

  const serviceData = servicesData.find((s) => s.key === serviceKey) as ServiceData | undefined;

  useEffect(() => {
    if (serviceData) {
      setActiveTab(0);
      // For video service, show all 4 as individual "packages" (per-video pricing)
      // For others, show as tabs
      setVisiblePackages(serviceData.packages);
    }
  }, [serviceKey, serviceData]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // Animate in
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  const activePackage = visiblePackages[activeTab];

  if (!serviceData) return null;

  const isVideoService = serviceKey === 'video';

  return (
    <div
      ref={overlayRef}
      className={`service-modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className="service-modal"
        style={{ '--modal-color': color } as React.CSSProperties}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button className="service-modal-close" onClick={handleClose} aria-label="Kapat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Header */}
        <div className="service-modal-header">
          <div className="service-modal-icon">
            {serviceData.icon}
          </div>
          <div className="service-modal-title-group">
            <h2 className="service-modal-title">{serviceData.title}</h2>
            <p className="service-modal-desc">{serviceData.desc}</p>
          </div>
        </div>

        <div className="service-modal-divider" />

        {/* Package Tabs */}
        <div className="service-modal-tabs">
          {visiblePackages.map((pkg, i) => (
            <button
              key={i}
              className={`service-modal-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              <span className="tab-name">{isVideoService ? pkg.name : t(`services.packages.${pkg.nameEn.toLowerCase()}`)}</span>
              <span className="tab-price">{pkg.price}</span>
            </button>
          ))}
        </div>

        {/* Package Content */}
        {activePackage && (
          <div className="service-modal-body">
            <div className="package-header">
              <div className="package-info">
                <h3 className="package-name">
                  {isVideoService ? activePackage.name : t(`services.packages.${activePackage.nameEn.toLowerCase()}`)}
                </h3>
                <span className="package-duration">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  {activePackage.duration}
                </span>
              </div>
              <div className="package-price-badge">
                {activePackage.price}
              </div>
            </div>

            <div className="service-modal-divider-small" />

            <div className="deliverables-section">
              <h4 className="deliverables-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                {isVideoService ? 'Neler Dahil?' : 'Pakette Neler Var?'}
              </h4>
              <ul className="deliverables-list">
                {activePackage.deliverables.map((item, i) => (
                  <li key={i} className="deliverable-item">
                    <span className="deliverable-check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="service-modal-divider" />

        {/* Footer */}
        <div className="service-modal-footer">
          <a href="#contact" className="btn-primary" onClick={handleClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            {t('nav.cta')}
          </a>
          <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
