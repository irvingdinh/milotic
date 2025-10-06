import clsx from "clsx";
import type { ComponentChildren } from "preact";

import { EllipsisIcon } from "./Icons/EllipsisIcon.tsx";

export interface CardProps {
  title: string;
  children: ComponentChildren;
  onClickEllipsis?: () => void;
  className?: string;
}

export const Card = ({
  title,
  children,
  onClickEllipsis,
  className,
}: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-neutral-100 border border-neutral-200 rounded-xl dark:bg-neutral-900 dark:border-neutral-800",
        className,
      )}
    >
      <div className="flex justify-between items-center h-8 px-2">
        <div>
          <p className="text-xs font-medium">{title}</p>
        </div>

        {onClickEllipsis && (
          <div className="flex gap-2">
            <button onClick={onClickEllipsis} aria-label="More options">
              <EllipsisIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-2 dark:bg-black">{children}</div>
    </div>
  );
};
