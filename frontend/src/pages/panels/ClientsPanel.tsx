import { useState } from "react";
import { ClientsList } from "../../components/clients/ClientsList";
import { ClientModal } from "../../components/modals/ClientModal";
import type { Client } from "../../types/dashboard";
import { Spinner } from "../../utils/Spinner";
import { ErrorModal } from "../../components/modals/ErrorModal";
import { usePanel } from "../../hooks/usePanel";
import { clientsService } from "../../services/clientsService";

export function ClientsPanel() {
  const { data, loading, error, refetch } = usePanel<Client>("clientes");

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(true);

  if (loading) return <Spinner />;

  const handleSave = async (clientData: Omit<Client, "id">, id?: number) => {
    if (id) {
      await clientsService.updateClient(id, clientData);
    } else {
      await clientsService.createClient(clientData);
    }
    await refetch();
  };

  return (
    <div className="space-y-6">

      {/* Panel buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Nuevo Cliente
        </button>
      </div>

      {/* Clients list */}
      <ClientsList
        clientes={data}
        onEdit={(client) => {
          setSelectedClient(client);
          setIsModalOpen(true);
        }}
        onDelete={async (id) => {
          await clientsService.deleteClient(id);
          await refetch();
        }}
      />

      {/* Create / Edit modal */}
      <ClientModal
        isOpen={isModalOpen}
        client={selectedClient ?? undefined}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        onSave={(data) => handleSave(data, selectedClient?.id)}
      />

      {/* Error modal */}
      <ErrorModal
        isOpen={!!error && showError}
        onClose={() => setShowError(false)}
        message={error ?? ""}
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
      />
    </div>
  );
}