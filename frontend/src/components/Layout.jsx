import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow p-6">
        {children}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}