import type { ComponentChildren } from "preact";

interface WidgetCardProps {
  title: string;
  children: ComponentChildren;
  class?: string;
}

export const WidgetCard = ({
  title,
  children,
  class: customClass = "",
}: WidgetCardProps) => {
  return (
    <div class={`card bg-base-100 shadow-lg aspect-square ${customClass}`}>
      <div class="card-body h-full flex flex-col p-4">
        <h2 class="card-title text-lg font-semibold mb-3 flex-shrink-0">
          {title}
        </h2>

        {/* Scrollable content area */}
        <div class="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
};
