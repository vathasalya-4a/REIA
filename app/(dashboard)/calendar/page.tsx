export default function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      {/* Page Heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Booking Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Schedule your meetings effortlessly with our integrated calendar.
        </p>
      </div>

      {/* Embedded Calendar */}
      <div className="w-full max-w-4xl shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <iframe
          src="https://cal.com/priyanka-alugolu"
          className="w-full h-[700px]"
          allowFullScreen
          title="Cal.com Booking Calendar"
        ></iframe>
      </div>

      {/* Footer */}
      <div className="mt-8 text-gray-500 text-sm dark:text-gray-400">
        Powered by{" "}
        <a
          href="https://cal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Cal.com
        </a>
      </div>
    </div>
  );
}
