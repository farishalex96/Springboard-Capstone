import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(6,95,70,0.12),_transparent_20%),linear-gradient(180deg,#f4fbf6_0%,#e1f2e8_45%,#eefbf6_100%)] transition-colors duration-500 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(6,95,70,0.18),_transparent_15%),linear-gradient(180deg,#020617_0%,#0a1926_40%,#07101b_100%)]">
      <Navbar />
      <Outlet />
    </div>
  );
}
