export const Status = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-green-400 " : "bg-gray-300"} transition-colors `}
    />
  );
};
