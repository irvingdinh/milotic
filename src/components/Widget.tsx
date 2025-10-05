import clsx from "clsx";

export type WidgetProps = {
  size?: "sm" | "md" | "lg";
};

export const Widget = ({ size = "sm" }: WidgetProps) => {
  const sizeToClassName = (size: string): string => {
    if (size === "sm") return "h-24 max-h-24";
    if (size === "md") return "h-32 max-h-32";
    if (size === "lg") return "h-48 max-h-48";
    return "";
  };

  return (
    <div
      className={clsx(
        "card card-border card-sm bg-base-100",
        sizeToClassName(size),
      )}
    >
      <div className="card-body h-full max-h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium">Widget Title</h2>
        </div>

        <div className="relative rounded flex-1 overflow-scroll gap-4 h-full max-h-full">
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
          <p className="bg-base-300 h-16">Hello</p>
        </div>
      </div>
    </div>
  );
};
