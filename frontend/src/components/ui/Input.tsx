export const Input = ({
  type = "text",
  value = "",
  name,
  onChange,
  placeholder,
}: {
  type: "text" | "email" | "password";
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => {
  return (
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-900 rounded-full py-2 px-4"
    />
  );
};
