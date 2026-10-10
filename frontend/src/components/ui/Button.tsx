export const Button = ({
  secondary,
  onClick,
  children,
  disabled = false,
}: {
  secondary?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <button
      className={` ${secondary ? "border border-gray-900 hover:bg-gray-900 hover:text-white" : "bg-gray-900 text-white"} disabled:bg-gray-200 disabled:cursor-default rounded-full py-2 px-4  cursor-pointer transition-all`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
