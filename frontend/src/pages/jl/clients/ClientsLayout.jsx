import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { clients as sampleClients } from '../../../mocks/mockClients.js';

// Holds the client list for all /clients pages, so a client added or edited
// shows up everywhere. Kept in memory only: it resets on page reload,
// until the backend clients API exists.
export default function ClientsLayout() {
  const [clients, setClients] = useState(sampleClients);

  // `values` comes from ClientForm; the list shows `name`.
  const addClient = (values) => {
    setClients((list) => {
      const id = Math.max(0, ...list.map((c) => c.id)) + 1;
      return [{ ...values, id, name: values.fullName, status: 'Active' }, ...list];
    });
  };

  const updateClient = (id, values) => {
    setClients((list) => list.map((c) => (c.id === id ? { ...c, ...values, name: values.fullName } : c)));
  };

  return <Outlet context={{ clients, addClient, updateClient }} />;
}
