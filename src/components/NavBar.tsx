import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Preamble", href: "#preamble" },
  { label: "Database", href: "#database" },
  { label: "Tribunal", href: "#chatbot" },
  { label: "Cases", href: "#cases" },
  { label: "Interpretation", href: "#interpretation" },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="#" className="font-serif text-sm font-semibold text-gradient-gold tracking-wide">
          DIGICODE
        </a>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
