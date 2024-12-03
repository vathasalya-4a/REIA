export default function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
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
      <div className="w-full max-w-4xl shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden m-8">
        <iframe
          src="https://cal.com/priyanka-alugolu"
          className="w-full h-[700px]"
          allowFullScreen
          title="Cal.com Booking Calendar"
        ></iframe>
      </div>
      {/* Footer */}
    </div>
  );
}
