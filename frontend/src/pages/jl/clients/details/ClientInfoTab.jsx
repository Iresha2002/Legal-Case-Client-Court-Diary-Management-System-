import Card from '../../../../components/ui/Card.jsx';
import { formatDate } from '../../../../utils/format.js';

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border-default py-3.5">
      <dt className="text-label font-semibold tracking-[0.06em] text-text-secondary uppercase">{label}</dt>
      <dd className="text-body text-text-primary">{value || '—'}</dd>
    </div>
  );
}

// Figma "JL 02.2 Client Details - Information": two columns of label / value pairs.
export default function ClientInfoTab({ client }) {
  const left = [
    ['Full Name', client.name],
    ['Contact No', client.contactNo],
    ['Date of Birth', formatDate(client.dateOfBirth)],
    ['Client Type', client.clientType],
    ['Registered', formatDate(client.registeredOn)],
  ];
  const right = [
    ['Occupation', client.occupation],
    ['Address', client.address],
    ['Gender', client.gender],
    ['Nationality', client.nationality],
    ['Language', client.language],
  ];

  return (
    <Card title="Client Information">
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-border-default">
        <dl className="md:pr-6">
          {left.map(([label, value]) => (
            <InfoItem key={label} label={label} value={value} />
          ))}
        </dl>
        <dl className="md:pl-6">
          {right.map(([label, value]) => (
            <InfoItem key={label} label={label} value={value} />
          ))}
        </dl>
      </div>
    </Card>
  );
}
