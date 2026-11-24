import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { clients as sampleClients } from '../../../mocks/mockClients.js';

// Holds the client list for all /clients pages, so a client added on "Add Client"
// shows up on the list. Kept in memory only: it resets on page reload,
// until the backend clients API exists.
export default function ClientsLayout() {
  const [clients, setClients] = useState(sampleClients);

  const addClient = (client) => {
    setClients((list) => {
      const id = Math.max(0, ...list.map((c) => c.id)) + 1;
      return [{ ...client, id }, ...list];
    });
  };

  return <Outlet context={{ clients, addClient }} />;
}
