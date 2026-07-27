from pathlib import Path

p = Path("src/pages/Admin.tsx")
s = p.read_text()

s = s.replace(
'downloadUrl: "#",\n  featured: false,',
'downloadUrl: "#",\n  badge: "",\n  featured: false,'
)

p.write_text(s)
