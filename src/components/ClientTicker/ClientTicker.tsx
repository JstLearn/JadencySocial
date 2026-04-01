import { useTranslation } from 'react-i18next';
import './ClientTicker.css';

const clients = [
  'Brand 1',
  'Brand 2',
  'Brand 3',
  'Brand 4',
  'Brand 5',
  'Brand 6',
  'Brand 7',
  'Brand 8',
  'Brand 9',
  'Brand 10',
];

export default function ClientTicker() {
  const { t } = useTranslation();
  // Duplicate for seamless loop
  const allClients = [...clients, ...clients];

  return (
    <section className="client-ticker">
      <p className="client-ticker-label">{t('clientTicker.label')}</p>
      <div className="client-ticker-track">
        {allClients.map((client, i) => (
          <span key={i} className="client-ticker-item">
            {t(`clientTicker.clients.${i % 10}`)}
          </span>
        ))}
      </div>
    </section>
  );
}
