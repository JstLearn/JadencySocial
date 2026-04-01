import './ClientTicker.css';

const clients = [
  'Marka 1',
  'Marka 2',
  'Marka 3',
  'Marka 4',
  'Marka 5',
  'Marka 6',
  'Marka 7',
  'Marka 8',
  'Marka 9',
  'Marka 10',
];

export default function ClientTicker() {
  // Duplicate for seamless loop
  const allClients = [...clients, ...clients];

  return (
    <section className="client-ticker">
      <p className="client-ticker-label">Güvenilen Markalar</p>
      <div className="client-ticker-track">
        {allClients.map((client, i) => (
          <span key={i} className="client-ticker-item">
            {client}
          </span>
        ))}
      </div>
    </section>
  );
}
