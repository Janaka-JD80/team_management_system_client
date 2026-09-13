import { useState } from 'react';
import { Shield, FolderKanban, Users as UsersIcon, Key } from 'lucide-react';
import { ProjectsTab } from './ProjectsTab';
import { UsersTab } from './UsersTab';
import { RolesTab } from './RolesTab';
import { PermissionsTab } from './PermissionsTab';

type Tab = 'projects' | 'users' | 'roles' | 'permissions';

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'permissions', label: 'Permissions', icon: Key },
  ] as const;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col gap-2 border-b pb-6">
        <h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
        <p className="text-muted-foreground text-lg">
          Manage system configurations, access control, and master data.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-border md:pr-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'roles' && <RolesTab />}
          {activeTab === 'permissions' && <PermissionsTab />}
        </div>
      </div>
    </div>
  );
}
