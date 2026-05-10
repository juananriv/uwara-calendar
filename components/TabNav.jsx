'use client';
import {
  IconHome,
  IconCalendarEvent,
  IconRocket,
  IconFileText,
  IconUsers,
} from '@tabler/icons-react';

const TABS = [
  { id: 'inicio', label: 'Inicio', Icon: IconHome },
  { id: 'agenda', label: 'Agenda', Icon: IconCalendarEvent },
  { id: 'proyectos', label: 'Proyectos', Icon: IconRocket },
  { id: 'actas', label: 'Actas', Icon: IconFileText },
  { id: 'nosotros', label: 'Nosotros', Icon: IconUsers },
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="tabs-wrap">
      <div className="tabs">
        {TABS.map(({ id, label, Icon }) => (
          <div
            key={id}
            className={`tab${activeTab === id ? ' active' : ''}`}
            onClick={() => onTabChange(id)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
