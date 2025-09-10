import type { ComponentChildren } from "preact";

interface DashboardProps {
  children: ComponentChildren;
}

export const Dashboard = ({ children }: DashboardProps) => {
  return (
    <div class="min-h-screen bg-base-200">
      {/* Header */}
      <header class="bg-base-100 shadow-sm border-b border-base-300">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-base-content">Milotic</h1>
            <div class="text-sm text-base-content/70">
              Developer Tools Dashboard
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main class="container mx-auto px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">{children}</div>
      </main>
    </div>
  );
};
