import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { PANEL_CONFIG, getMenuItems, type PanelType } from "../config/panelConfig";
import { ProductModal } from "../components/modals/ProductModal";
import { SaleModal } from "../components/modals/SaleModal";

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelType>("stock");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isSaleOpen, setIsSaleOpen] = useState(false);

  const config = PANEL_CONFIG[activePanel];
  const PanelComponent = config.Component;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        activePanel={activePanel}
        menuItems={getMenuItems()}
        onPanelChange={setActivePanel}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          config={config}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNew={() => setIsNewOpen(true)}
          onSale={() => setIsSaleOpen(true)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <PanelComponent />
        </div>
      </div>

      {/* ===== MODALES GLOBALES ===== */}

      <ProductModal
				isOpen={isNewOpen && activePanel === "stock"}
				onClose={() => setIsNewOpen(false)} onSave={function (): Promise<void> {
					throw new Error("Function not implemented.");
				} }      />

      <SaleModal
				isOpen={isSaleOpen && activePanel === "stock"}
				onClose={() => setIsSaleOpen(false)} onSave={function (): Promise<void> {
					throw new Error("Function not implemented.");
				} } products={[]}      />
    </div>
  );
}
