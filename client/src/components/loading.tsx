const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen" role="status" aria-label="Loading">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white" />
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default Loading;
