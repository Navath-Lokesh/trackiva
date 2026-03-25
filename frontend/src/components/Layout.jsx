import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  );
}