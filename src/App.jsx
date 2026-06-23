import { useState } from 'react';
import { MarketingProvider } from './context/MarketingContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Planeamiento } from './components/Planeamiento';
import { CalendarioContenido } from './components/CalendarioContenido';
import { ProduccionAudiovisual } from './components/ProduccionAudiovisual';
import { PublicidadDigital } from './components/PublicidadDigital';
import { ActivosDigitales } from './components/ActivosDigitales';
import { PersonalMarketing } from './components/PersonalMarketing';
import { Informes } from './components/Informes';
import { KPIs } from './components/KPIs';
import { Configuracion } from './components/Configuracion';
import './App.css';

const ViewMap = {
  dashboard: Dashboard,
  planeamiento: Planeamiento,
  calendario: CalendarioContenido,
  produccion: ProduccionAudiovisual,
  publicidad: PublicidadDigital,
  activos: ActivosDigitales,
  personal: PersonalMarketing,
  informes: Informes,
  kpis: KPIs,
  configuracion: Configuracion
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const ActiveView = ViewMap[activeTab] || Dashboard;

  return (
    <MarketingProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <ActiveView />
      </Layout>
    </MarketingProvider>
  );
}

export default App;
