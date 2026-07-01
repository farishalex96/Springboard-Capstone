export default function PageContainer({ children, className = '' }) {
  return (
    <main className={`container mx-auto px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </main>
  );
}
