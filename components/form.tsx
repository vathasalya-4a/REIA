"use client";

export default function Form({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
}: {
  title: string;
  description: string;
  helpText?: string;
  inputAttrs: React.InputHTMLAttributes<HTMLInputElement>;
  handleSubmit: (formData: Record<string, string>) => void;
}) {
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    await handleSubmit(formData as Record<string, string>);
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
      <label className="text-lg font-medium">{title}</label>
      <p className="text-sm text-gray-500">{description}</p>
      <input {...inputAttrs} className="border rounded p-2" />
      {helpText && <p className="text-xs text-gray-400">{helpText}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Save
      </button>
    </form>
  );
}
