'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import TabNav from '@/components/TabNav';
import Inicio from '@/components/tabs/Inicio';
import Agenda from '@/components/tabs/Agenda';
import Proyectos from '@/components/tabs/Proyectos';
import Actas from '@/components/tabs/Actas';
import Nosotros from '@/components/tabs/Nosotros';
import ProjectDetail from '@/components/ProjectDetail';
import EventDetail from '@/components/EventDetail';
import ActaDetail from '@/components/ActaDetail';
import Lightbox from '@/components/Lightbox';

export default function AppShell({ eventos, proyectos, avisos, actas }) {
  const [activeTab, setActiveTab] = useState('inicio');
  const [openProject, setOpenProject] = useState(null);
  const [openEvent, setOpenEvent] = useState(null);
  const [openActa, setOpenActa] = useState(null);
  const [lightboxSlide, setLightboxSlide] = useState(null);

  // Split avisos into carousel slides and reminder cards once, at the shell level,
  // so both Inicio (Carousel) and Lightbox share the exact same array and indices.
  const carouselSlides = useMemo(
    () => avisos.filter(a => a.tipo?.toLowerCase() !== 'recordatorio'),
    [avisos]
  );
  const reminders = useMemo(
    () => avisos.filter(a => a.tipo?.toLowerCase() === 'recordatorio'),
    [avisos]
  );

  return (
    <div className="screen" id="main-screen">
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'inicio' && (
        <Inicio
          slides={carouselSlides}
          reminders={reminders}
          onOpenLightbox={(idx) => setLightboxSlide(idx)}
          isLightboxOpen={lightboxSlide !== null}
        />
      )}
      {activeTab === 'agenda' && (
        <Agenda eventos={eventos} onOpenEvent={setOpenEvent} />
      )}
      {activeTab === 'proyectos' && (
        <Proyectos proyectos={proyectos} onOpenProject={setOpenProject} />
      )}
      {activeTab === 'actas' && (
        <Actas actas={actas} onOpenActa={setOpenActa} />
      )}
      {activeTab === 'nosotros' && <Nosotros />}

      {openProject && (
        <ProjectDetail
          project={openProject}
          onClose={() => setOpenProject(null)}
        />
      )}
      {openEvent && (
        <EventDetail
          event={openEvent}
          onClose={() => setOpenEvent(null)}
        />
      )}
      {openActa && (
        <ActaDetail
          acta={openActa}
          onClose={() => setOpenActa(null)}
        />
      )}
      {lightboxSlide !== null && (
        <Lightbox
          slides={carouselSlides}
          initialIndex={lightboxSlide}
          onClose={() => setLightboxSlide(null)}
        />
      )}
    </div>
  );
}
