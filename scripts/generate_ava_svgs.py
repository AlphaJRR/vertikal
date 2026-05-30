#!/usr/bin/env python3
"""Generate 28 AVA Creator Toolkit brand SVG diagrams."""

from pathlib import Path

BG = "#080808"
WHITE = "#FFFFFF"
RED = "#E8000A"
GRAY = "#888888"
BORDER = "#1C1C1C"

HEADER = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">\n  <rect width="800" height="450" fill="{BG}"/>'
FOOTER = "</svg>"


def wrap(body: str) -> str:
    return f"{HEADER}\n{body}\n{FOOTER}"


DIAGRAMS = {
    "camera/exposure-triangle.svg": wrap("""
  <polygon points="400,80 620,340 180,340" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <line x1="400" y1="80" x2="620" y2="340" stroke="{BORDER}" stroke-width="1" stroke-dasharray="6 6"/>
  <line x1="620" y1="340" x2="180" y2="340" stroke="{BORDER}" stroke-width="1" stroke-dasharray="6 6"/>
  <line x1="180" y1="340" x2="400" y2="80" stroke="{BORDER}" stroke-width="1" stroke-dasharray="6 6"/>
  <circle cx="400" cy="80" r="14" fill="{RED}"/>
  <circle cx="620" cy="340" r="14" fill="{RED}"/>
  <circle cx="180" cy="340" r="14" fill="{RED}"/>
  <circle cx="400" cy="240" r="8" fill="{GRAY}"/>
""".format(WHITE=WHITE, BORDER=BORDER, RED=RED, GRAY=GRAY)),

    "camera/aperture-depth.svg": wrap("""
  <rect x="40" y="60" width="340" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="420" y="60" width="340" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="210" cy="225" r="50" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="210" cy="225" r="8" fill="{RED}"/>
  <rect x="80" y="120" width="60" height="210" fill="{GRAY}" opacity="0.3"/>
  <rect x="280" y="120" width="60" height="210" fill="{GRAY}" opacity="0.3"/>
  <line x1="210" y1="60" x2="210" y2="390" stroke="{RED}" stroke-width="1" stroke-dasharray="4 4"/>
  <circle cx="590" cy="225" r="50" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="590" cy="225" r="8" fill="{RED}"/>
  <rect x="460" y="120" width="60" height="210" fill="{GRAY}" opacity="0.5"/>
  <rect x="660" y="120" width="60" height="210" fill="{GRAY}" opacity="0.5"/>
  <rect x="440" y="180" width="300" height="90" fill="none" stroke="{GRAY}" stroke-width="1"/>
""".format(BORDER=BORDER, WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "camera/shutter-motion.svg": wrap("""
  <rect x="60" y="100" width="200" height="250" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="300" y="100" width="200" height="250" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="540" y="100" width="200" height="250" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="100" y="180" width="120" height="90" fill="{WHITE}" stroke="{WHITE}" stroke-width="2"/>
  <rect x="340" y="180" width="80" height="90" fill="{WHITE}"/>
  <rect x="420" y="180" width="40" height="90" fill="{GRAY}" opacity="0.6"/>
  <rect x="580" y="180" width="30" height="90" fill="{WHITE}"/>
  <rect x="610" y="180" width="30" height="90" fill="{GRAY}" opacity="0.5"/>
  <rect x="640" y="180" width="30" height="90" fill="{GRAY}" opacity="0.3"/>
  <rect x="670" y="180" width="30" height="90" fill="{GRAY}" opacity="0.2"/>
  <line x1="60" y1="380" x2="260" y2="380" stroke="{RED}" stroke-width="2"/>
  <line x1="300" y1="380" x2="500" y2="380" stroke="{GRAY}" stroke-width="1"/>
  <line x1="540" y1="380" x2="740" y2="380" stroke="{GRAY}" stroke-width="1"/>
""".format(BORDER=BORDER, WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "camera/white-balance.svg": wrap("""
  <rect x="80" y="180" width="640" height="80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="80" y="180" width="80" height="80" fill="#FFB347"/>
  <rect x="160" y="180" width="80" height="80" fill="#FFD699"/>
  <rect x="240" y="180" width="80" height="80" fill="#FFF5E0"/>
  <rect x="320" y="180" width="80" height="80" fill="#FFFFFF"/>
  <rect x="400" y="180" width="80" height="80" fill="#E8F4FF"/>
  <rect x="480" y="180" width="80" height="80" fill="#B8D4FF"/>
  <rect x="560" y="180" width="80" height="80" fill="#6BA3FF"/>
  <rect x="640" y="180" width="80" height="80" fill="#3D7AE8"/>
  <line x1="400" y1="160" x2="400" y2="300" stroke="{RED}" stroke-width="2"/>
  <circle cx="400" cy="220" r="10" fill="{RED}"/>
  <line x1="80" y1="320" x2="720" y2="320" stroke="{BORDER}" stroke-width="1"/>
  <line x1="160" y1="310" x2="160" y2="330" stroke="{GRAY}" stroke-width="1"/>
  <line x1="320" y1="310" x2="320" y2="330" stroke="{GRAY}" stroke-width="1"/>
  <line x1="480" y1="310" x2="480" y2="330" stroke="{GRAY}" stroke-width="1"/>
  <line x1="640" y1="310" x2="640" y2="330" stroke="{GRAY}" stroke-width="1"/>
""".format(WHITE=WHITE, RED=RED, BORDER=BORDER, GRAY=GRAY)),

    "camera/frame-rates.svg": wrap("""
  <line x1="60" y1="350" x2="740" y2="350" stroke="{WHITE}" stroke-width="2"/>
  <line x1="60" y1="80" x2="60" y2="350" stroke="{GRAY}" stroke-width="1"/>
  <rect x="80" y="120" width="180" height="230" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="310" y="120" width="180" height="230" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="540" y="120" width="180" height="230" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <line x1="100" y1="350" x2="100" y2="200" stroke="{WHITE}" stroke-width="2"/>
  <line x1="142" y1="350" x2="142" y2="200" stroke="{WHITE}" stroke-width="2"/>
  <line x1="184" y1="350" x2="184" y2="200" stroke="{WHITE}" stroke-width="2"/>
  <line x1="226" y1="350" x2="226" y2="200" stroke="{WHITE}" stroke-width="2"/>
  <line x1="330" y1="350" x2="330" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="360" y1="350" x2="360" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="390" y1="350" x2="390" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="420" y1="350" x2="420" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="450" y1="350" x2="450" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="560" y1="350" x2="560" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="575" y1="350" x2="575" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="590" y1="350" x2="590" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="605" y1="350" x2="605" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="620" y1="350" x2="620" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="635" y1="350" x2="635" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="650" y1="350" x2="650" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="665" y1="350" x2="665" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <line x1="680" y1="350" x2="680" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="100" cy="100" r="8" fill="{RED}"/>
  <circle cx="350" cy="100" r="8" fill="{GRAY}"/>
  <circle cx="620" cy="100" r="8" fill="{GRAY}"/>
""".format(WHITE=WHITE, GRAY=GRAY, BORDER=BORDER, RED=RED)),

    "camera/iso-noise.svg": wrap("""
  <rect x="60" y="80" width="320" height="290" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="420" y="80" width="320" height="290" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="100" y="140" width="240" height="170" fill="{GRAY}" opacity="0.15"/>
  <circle cx="220" cy="225" r="60" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="460" y="140" width="240" height="170" fill="{GRAY}" opacity="0.25"/>
  <circle cx="580" cy="225" r="60" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="470" cy="160" r="2" fill="{GRAY}"/><circle cx="490" cy="170" r="2" fill="{GRAY}"/>
  <circle cx="510" cy="155" r="2" fill="{GRAY}"/><circle cx="530" cy="165" r="2" fill="{GRAY}"/>
  <circle cx="550" cy="175" r="2" fill="{GRAY}"/><circle cx="570" cy="150" r="2" fill="{GRAY}"/>
  <circle cx="590" cy="160" r="2" fill="{GRAY}"/><circle cx="610" cy="170" r="2" fill="{GRAY}"/>
  <circle cx="630" cy="155" r="2" fill="{GRAY}"/><circle cx="650" cy="165" r="2" fill="{GRAY}"/>
  <circle cx="480" cy="200" r="2" fill="{GRAY}"/><circle cx="500" cy="210" r="2" fill="{GRAY}"/>
  <circle cx="520" cy="195" r="2" fill="{GRAY}"/><circle cx="540" cy="220" r="2" fill="{GRAY}"/>
  <circle cx="560" cy="205" r="2" fill="{GRAY}"/><circle cx="580" cy="230" r="2" fill="{GRAY}"/>
  <circle cx="600" cy="215" r="2" fill="{GRAY}"/><circle cx="620" cy="200" r="2" fill="{GRAY}"/>
  <circle cx="640" cy="225" r="2" fill="{GRAY}"/><circle cx="660" cy="210" r="2" fill="{GRAY}"/>
  <circle cx="470" cy="250" r="2" fill="{GRAY}"/><circle cx="490" cy="260" r="2" fill="{GRAY}"/>
  <circle cx="510" cy="245" r="2" fill="{GRAY}"/><circle cx="530" cy="270" r="2" fill="{GRAY}"/>
  <circle cx="550" cy="255" r="2" fill="{GRAY}"/><circle cx="570" cy="280" r="2" fill="{GRAY}"/>
  <circle cx="590" cy="265" r="2" fill="{GRAY}"/><circle cx="610" cy="250" r="2" fill="{GRAY}"/>
  <circle cx="630" cy="275" r="2" fill="{GRAY}"/><circle cx="650" cy="260" r="2" fill="{GRAY}"/>
  <rect x="180" y="390" width="80" height="6" fill="{RED}"/>
  <rect x="540" y="390" width="80" height="6" fill="{GRAY}"/>
""".format(BORDER=BORDER, GRAY=GRAY, WHITE=WHITE, RED=RED)),

    "framing/rule-of-thirds.svg": wrap("""
  <rect x="100" y="50" width="600" height="350" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <line x1="300" y1="50" x2="300" y2="400" stroke="{GRAY}" stroke-width="1"/>
  <line x1="500" y1="50" x2="500" y2="400" stroke="{GRAY}" stroke-width="1"/>
  <line x1="100" y1="167" x2="700" y2="167" stroke="{GRAY}" stroke-width="1"/>
  <line x1="100" y1="283" x2="700" y2="283" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="300" cy="167" r="16" fill="{RED}"/>
  <rect x="320" y="120" width="80" height="120" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="360" cy="140" r="20" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="340" y="170" width="40" height="70" fill="none" stroke="{WHITE}" stroke-width="2"/>
""".format(BORDER=BORDER, GRAY=GRAY, RED=RED, WHITE=WHITE)),

    "framing/leading-lines.svg": wrap("""
  <rect x="100" y="50" width="600" height="350" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <line x1="120" y1="380" x2="400" y2="180" stroke="{WHITE}" stroke-width="2"/>
  <line x1="680" y1="380" x2="400" y2="180" stroke="{WHITE}" stroke-width="2"/>
  <line x1="200" y1="400" x2="400" y2="180" stroke="{GRAY}" stroke-width="1"/>
  <line x1="600" y1="400" x2="400" y2="180" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="400" cy="180" r="30" fill="none" stroke="{RED}" stroke-width="2"/>
  <circle cx="400" cy="160" r="18" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="385" y="190" width="30" height="50" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="400" cy="380" r="6" fill="{RED}"/>
""".format(BORDER=BORDER, WHITE=WHITE, GRAY=GRAY, RED=RED)),

    "framing/dutch-angle.svg": wrap("""
  <g transform="rotate(-12 400 225)">
    <rect x="150" y="75" width="500" height="300" fill="none" stroke="{WHITE}" stroke-width="2"/>
    <line x1="150" y1="225" x2="650" y2="225" stroke="{RED}" stroke-width="2"/>
    <rect x="320" y="140" width="60" height="100" fill="none" stroke="{WHITE}" stroke-width="2"/>
    <circle cx="350" cy="160" r="18" fill="none" stroke="{WHITE}" stroke-width="2"/>
  </g>
  <line x1="60" y1="400" x2="740" y2="400" stroke="{GRAY}" stroke-width="1"/>
  <line x1="60" y1="400" x2="740" y2="380" stroke="{BORDER}" stroke-width="1" stroke-dasharray="8 8"/>
""".format(WHITE=WHITE, RED=RED, GRAY=GRAY, BORDER=BORDER)),

    "framing/high-low-angle.svg": wrap("""
  <rect x="60" y="60" width="320" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="420" y="60" width="320" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <polygon points="220,320 260,280 180,280" fill="{GRAY}"/>
  <line x1="220" y1="280" x2="220" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <rect x="200" y="200" width="40" height="60" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="220" cy="185" r="15" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <polygon points="580,120 620,160 540,160" fill="{GRAY}"/>
  <line x1="580" y1="160" x2="580" y2="240" stroke="{GRAY}" stroke-width="1"/>
  <rect x="560" y="240" width="40" height="60" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="580" cy="310" r="15" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="220" cy="100" r="8" fill="{RED}"/>
  <circle cx="580" cy="340" r="8" fill="{RED}"/>
""".format(BORDER=BORDER, GRAY=GRAY, WHITE=WHITE, RED=RED)),

    "framing/depth-layers.svg": wrap("""
  <rect x="80" y="60" width="640" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="120" y="280" width="80" height="80" fill="{GRAY}" opacity="0.6" stroke="{WHITE}" stroke-width="2"/>
  <rect x="280" y="200" width="100" height="120" fill="{GRAY}" opacity="0.4" stroke="{WHITE}" stroke-width="2"/>
  <rect x="500" y="100" width="140" height="160" fill="{GRAY}" opacity="0.2" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="330" cy="230" r="25" fill="none" stroke="{RED}" stroke-width="2"/>
  <circle cx="330" cy="215" r="15" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="315" y="240" width="30" height="45" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <line x1="80" y1="360" x2="720" y2="360" stroke="{GRAY}" stroke-width="1"/>
  <line x1="200" y1="360" x2="200" y2="340" stroke="{RED}" stroke-width="2"/>
  <line x1="400" y1="360" x2="400" y2="340" stroke="{GRAY}" stroke-width="1"/>
  <line x1="600" y1="360" x2="600" y2="340" stroke="{GRAY}" stroke-width="1"/>
""".format(BORDER=BORDER, GRAY=GRAY, WHITE=WHITE, RED=RED)),

    "framing/headroom-noseroom.svg": wrap("""
  <rect x="200" y="40" width="400" height="370" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="200" y="40" width="400" height="80" fill="none" stroke="{RED}" stroke-width="2" stroke-dasharray="6 4"/>
  <rect x="200" y="320" width="400" height="90" fill="none" stroke="{GRAY}" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="340" y1="200" x2="460" y2="200" stroke="{RED}" stroke-width="2"/>
  <rect x="200" y="120" width="100" height="200" fill="none" stroke="{GRAY}" stroke-width="1" stroke-dasharray="4 4"/>
  <circle cx="380" cy="180" r="35" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="360" y="220" width="40" height="80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <polygon points="380,200 370,215 390,215" fill="{RED}"/>
""".format(WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "lighting/three-point-layout.svg": wrap("""
  <rect x="80" y="60" width="640" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="400" cy="220" r="30" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="385" y="250" width="30" height="60" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <line x1="400" y1="190" x2="400" y2="80" stroke="{RED}" stroke-width="2"/>
  <circle cx="400" cy="70" r="12" fill="{RED}"/>
  <line x1="430" y1="220" x2="600" y2="180" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="610" cy="175" r="10" fill="{GRAY}"/>
  <line x1="370" y1="220" x2="180" y2="280" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="170" cy="285" r="12" fill="{WHITE}"/>
  <line x1="400" y1="250" x2="400" y2="360" stroke="{GRAY}" stroke-width="1" stroke-dasharray="4 4"/>
  <circle cx="400" cy="370" r="8" fill="{GRAY}"/>
""".format(BORDER=BORDER, WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "lighting/hard-soft-light.svg": wrap("""
  <rect x="60" y="80" width="320" height="290" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="420" y="80" width="320" height="290" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="220" cy="200" r="40" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <polygon points="220,160 180,280 260,280" fill="{GRAY}" opacity="0.8"/>
  <circle cx="580" cy="200" r="40" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <ellipse cx="580" cy="280" rx="60" ry="20" fill="{GRAY}" opacity="0.4"/>
  <circle cx="220" cy="100" r="15" fill="{RED}"/>
  <circle cx="580" cy="100" r="15" fill="{GRAY}"/>
  <line x1="220" y1="115" x2="220" y2="160" stroke="{RED}" stroke-width="2"/>
  <line x1="580" y1="115" x2="580" y2="160" stroke="{GRAY}" stroke-width="1"/>
""".format(BORDER=BORDER, WHITE=WHITE, GRAY=GRAY, RED=RED)),

    "lighting/rembrandt-triangle.svg": wrap("""
  <rect x="200" y="60" width="400" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="400" cy="180" r="60" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <polygon points="430,200 450,240 410,240" fill="{RED}"/>
  <line x1="550" y1="120" x2="430" y2="200" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="560" cy="110" r="14" fill="{RED}"/>
  <rect x="380" y="240" width="40" height="80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <path d="M 340 180 Q 360 220 340 260" fill="none" stroke="{GRAY}" stroke-width="1"/>
""".format(BORDER=BORDER, WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "lighting/butterfly-lighting.svg": wrap("""
  <rect x="200" y="60" width="400" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="400" cy="200" r="55" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <ellipse cx="400" cy="230" rx="12" ry="8" fill="{RED}"/>
  <line x1="400" y1="60" x2="400" y2="145" stroke="{RED}" stroke-width="2"/>
  <circle cx="400" cy="50" r="14" fill="{RED}"/>
  <rect x="375" y="255" width="50" height="90" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <line x1="300" y1="200" x2="500" y2="200" stroke="{GRAY}" stroke-width="1" stroke-dasharray="4 4"/>
""".format(BORDER=BORDER, WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "lighting/split-lighting.svg": wrap("""
  <rect x="200" y="60" width="400" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="400" cy="200" r="70" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="400" y="60" width="200" height="330" fill="{GRAY}" opacity="0.35"/>
  <line x1="400" y1="60" x2="400" y2="390" stroke="{RED}" stroke-width="2"/>
  <circle cx="520" cy="120" r="14" fill="{RED}"/>
  <line x1="520" y1="134" x2="450" y2="180" stroke="{RED}" stroke-width="2"/>
  <rect x="375" y="270" width="50" height="90" fill="none" stroke="{WHITE}" stroke-width="2"/>
""".format(BORDER=BORDER, WHITE=WHITE, GRAY=GRAY, RED=RED)),

    "lighting/interview-setup.svg": wrap("""
  <rect x="60" y="80" width="680" height="290" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="250" cy="220" r="25" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="235" y="245" width="30" height="50" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="550" cy="220" r="25" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="535" y="245" width="30" height="50" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="400" cy="100" r="14" fill="{RED}"/>
  <line x1="400" y1="114" x2="250" y2="195" stroke="{RED}" stroke-width="2"/>
  <line x1="400" y1="114" x2="550" y2="195" stroke="{RED}" stroke-width="2"/>
  <circle cx="680" cy="180" r="10" fill="{GRAY}"/>
  <line x1="680" y1="190" x2="570" y2="210" stroke="{GRAY}" stroke-width="1"/>
  <rect x="120" y="300" width="80" height="40" fill="none" stroke="{GRAY}" stroke-width="1"/>
  <rect x="600" y="300" width="80" height="40" fill="none" stroke="{GRAY}" stroke-width="1"/>
""".format(BORDER=BORDER, WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "lighting/outdoor-fill-setup.svg": wrap("""
  <rect x="60" y="80" width="680" height="290" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="650" cy="120" r="40" fill="{GRAY}" opacity="0.5" stroke="{WHITE}" stroke-width="2"/>
  <line x1="610" y1="120" x2="350" y2="200" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="350" cy="220" r="30" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="335" y="250" width="30" height="60" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <polygon points="180,280 220,200 260,280" fill="{GRAY}" opacity="0.4" stroke="{RED}" stroke-width="2"/>
  <line x1="220" y1="200" x2="320" y2="230" stroke="{RED}" stroke-width="2"/>
  <line x1="80" y1="350" x2="720" y2="350" stroke="{GRAY}" stroke-width="1"/>
""".format(BORDER=BORDER, GRAY=GRAY, WHITE=WHITE, RED=RED)),

    "editing/color-wheels-diagram.svg": wrap("""
  <circle cx="200" cy="225" r="80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="400" cy="225" r="80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <circle cx="600" cy="225" r="80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <line x1="200" y1="225" x2="230" y2="195" stroke="{RED}" stroke-width="2"/>
  <circle cx="235" cy="190" r="8" fill="{RED}"/>
  <line x1="400" y1="225" x2="430" y2="255" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="435" cy="260" r="6" fill="{GRAY}"/>
  <line x1="600" y1="225" x2="570" y2="195" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="565" cy="190" r="6" fill="{GRAY}"/>
  <rect x="160" y="330" width="80" height="6" fill="{RED}"/>
  <rect x="360" y="330" width="80" height="6" fill="{GRAY}"/>
  <rect x="560" y="330" width="80" height="6" fill="{GRAY}"/>
""".format(WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "editing/rgb-curves.svg": wrap("""
  <rect x="100" y="60" width="600" height="330" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <line x1="100" y1="390" x2="700" y2="390" stroke="{GRAY}" stroke-width="1"/>
  <line x1="100" y1="60" x2="100" y2="390" stroke="{GRAY}" stroke-width="1"/>
  <polyline points="100,390 250,300 400,220 550,140 700,80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <polyline points="100,390 300,320 500,250 700,180" fill="none" stroke="{RED}" stroke-width="2"/>
  <polyline points="100,390 280,340 460,290 700,200" fill="none" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="400" cy="220" r="6" fill="{WHITE}"/>
  <circle cx="500" cy="250" r="6" fill="{RED}"/>
""".format(BORDER=BORDER, GRAY=GRAY, WHITE=WHITE, RED=RED)),

    "editing/node-workflow.svg": wrap("""
  <rect x="80" y="180" width="100" height="60" fill="none" stroke="{WHITE}" stroke-width="2" rx="4"/>
  <rect x="240" y="180" width="100" height="60" fill="none" stroke="{WHITE}" stroke-width="2" rx="4"/>
  <rect x="400" y="180" width="100" height="60" fill="none" stroke="{RED}" stroke-width="2" rx="4"/>
  <rect x="560" y="180" width="100" height="60" fill="none" stroke="{WHITE}" stroke-width="2" rx="4"/>
  <line x1="180" y1="210" x2="240" y2="210" stroke="{GRAY}" stroke-width="1"/>
  <polygon points="235,210 225,205 225,215" fill="{GRAY}"/>
  <line x1="340" y1="210" x2="400" y2="210" stroke="{GRAY}" stroke-width="1"/>
  <polygon points="395,210 385,205 385,215" fill="{GRAY}"/>
  <line x1="500" y1="210" x2="560" y2="210" stroke="{GRAY}" stroke-width="1"/>
  <polygon points="555,210 545,205 545,215" fill="{GRAY}"/>
  <rect x="400" y="100" width="100" height="50" fill="none" stroke="{GRAY}" stroke-width="1" rx="4"/>
  <line x1="450" y1="150" x2="450" y2="180" stroke="{GRAY}" stroke-width="1"/>
  <rect x="400" y="300" width="100" height="50" fill="none" stroke="{GRAY}" stroke-width="1" rx="4"/>
  <line x1="450" y1="240" x2="450" y2="300" stroke="{GRAY}" stroke-width="1"/>
""".format(WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "editing/log-vs-graded.svg": wrap("""
  <rect x="60" y="80" width="320" height="290" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="420" y="80" width="320" height="290" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="100" y="140" width="240" height="170" fill="{GRAY}" opacity="0.35"/>
  <rect x="460" y="140" width="240" height="170" fill="{GRAY}" opacity="0.15"/>
  <rect x="480" y="160" width="80" height="60" fill="{RED}" opacity="0.3"/>
  <rect x="580" y="180" width="100" height="80" fill="{WHITE}" opacity="0.15"/>
  <circle cx="580" cy="200" r="20" fill="none" stroke="{RED}" stroke-width="2"/>
  <line x1="220" y1="390" x2="220" y2="400" stroke="{GRAY}" stroke-width="2"/>
  <line x1="580" y1="390" x2="580" y2="400" stroke="{RED}" stroke-width="2"/>
""".format(BORDER=BORDER, GRAY=GRAY, RED=RED, WHITE=WHITE)),

    "editing/j-cut-l-cut.svg": wrap("""
  <rect x="80" y="100" width="640" height="250" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <rect x="100" y="140" width="200" height="40" fill="{WHITE}" opacity="0.3" stroke="{WHITE}" stroke-width="2"/>
  <rect x="100" y="200" width="280" height="40" fill="{RED}" opacity="0.4" stroke="{RED}" stroke-width="2"/>
  <rect x="380" y="140" width="200" height="40" fill="{WHITE}" opacity="0.3" stroke="{WHITE}" stroke-width="2"/>
  <rect x="300" y="200" width="280" height="40" fill="{GRAY}" opacity="0.3" stroke="{GRAY}" stroke-width="1"/>
  <line x1="300" y1="120" x2="300" y2="280" stroke="{RED}" stroke-width="2" stroke-dasharray="4 4"/>
  <line x1="380" y1="120" x2="380" y2="280" stroke="{GRAY}" stroke-width="1" stroke-dasharray="4 4"/>
  <polygon points="100,160 90,155 90,165" fill="{WHITE}"/>
  <polygon points="580,220 590,215 590,225" fill="{GRAY}"/>
""".format(BORDER=BORDER, WHITE=WHITE, RED=RED, GRAY=GRAY)),

    "editing/vectorscope-skin-line.svg": wrap("""
  <circle cx="400" cy="225" r="150" fill="none" stroke="{BORDER}" stroke-width="1"/>
  <circle cx="400" cy="225" r="100" fill="none" stroke="{GRAY}" stroke-width="1"/>
  <circle cx="400" cy="225" r="50" fill="none" stroke="{GRAY}" stroke-width="1"/>
  <line x1="400" y1="75" x2="400" y2="375" stroke="{GRAY}" stroke-width="1"/>
  <line x1="250" y1="225" x2="550" y2="225" stroke="{GRAY}" stroke-width="1"/>
  <line x1="320" y1="145" x2="480" y2="305" stroke="{RED}" stroke-width="2"/>
  <circle cx="420" cy="245" r="10" fill="{RED}"/>
  <circle cx="380" cy="205" r="6" fill="{WHITE}"/>
  <circle cx="440" cy="265" r="6" fill="{WHITE}"/>
""".format(BORDER=BORDER, GRAY=GRAY, RED=RED, WHITE=WHITE)),

    "strategy/hook-formula.svg": wrap("""
  <rect x="80" y="180" width="120" height="80" fill="{RED}" opacity="0.5" stroke="{RED}" stroke-width="2"/>
  <rect x="220" y="180" width="120" height="80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="360" y="180" width="200" height="80" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="580" y="180" width="120" height="80" fill="none" stroke="{GRAY}" stroke-width="1"/>
  <line x1="80" y1="300" x2="700" y2="300" stroke="{BORDER}" stroke-width="1"/>
  <line x1="140" y1="300" x2="140" y2="260" stroke="{RED}" stroke-width="2"/>
  <line x1="280" y1="300" x2="280" y2="260" stroke="{GRAY}" stroke-width="1"/>
  <line x1="460" y1="300" x2="460" y2="260" stroke="{GRAY}" stroke-width="1"/>
  <line x1="640" y1="300" x2="640" y2="260" stroke="{GRAY}" stroke-width="1"/>
  <polyline points="140,120 280,140 460,160 640,180" fill="none" stroke="{RED}" stroke-width="2"/>
""".format(RED=RED, WHITE=WHITE, GRAY=GRAY, BORDER=BORDER)),

    "strategy/content-pillars.svg": wrap("""
  <rect x="120" y="80" width="140" height="290" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="330" y="120" width="140" height="250" fill="none" stroke="{RED}" stroke-width="2"/>
  <rect x="540" y="100" width="140" height="270" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <rect x="130" y="90" width="120" height="30" fill="{RED}" opacity="0.4"/>
  <rect x="340" y="130" width="120" height="30" fill="{RED}" opacity="0.4"/>
  <rect x="550" y="110" width="120" height="30" fill="{RED}" opacity="0.4"/>
  <line x1="80" y1="370" x2="720" y2="370" stroke="{BORDER}" stroke-width="1"/>
  <line x1="190" y1="370" x2="190" y2="350" stroke="{GRAY}" stroke-width="1"/>
  <line x1="400" y1="370" x2="400" y2="350" stroke="{RED}" stroke-width="2"/>
  <line x1="610" y1="370" x2="610" y2="350" stroke="{GRAY}" stroke-width="1"/>
""".format(WHITE=WHITE, RED=RED, BORDER=BORDER, GRAY=GRAY)),

    "strategy/batch-shooting-calendar.svg": wrap("""
  <rect x="120" y="60" width="560" height="330" fill="none" stroke="{WHITE}" stroke-width="2"/>
  <line x1="120" y1="120" x2="680" y2="120" stroke="{BORDER}" stroke-width="1"/>
  <line x1="200" y1="60" x2="200" y2="390" stroke="{BORDER}" stroke-width="1"/>
  <line x1="280" y1="60" x2="280" y2="390" stroke="{BORDER}" stroke-width="1"/>
  <line x1="360" y1="60" x2="360" y2="390" stroke="{BORDER}" stroke-width="1"/>
  <line x1="440" y1="60" x2="440" y2="390" stroke="{BORDER}" stroke-width="1"/>
  <line x1="520" y1="60" x2="520" y2="390" stroke="{BORDER}" stroke-width="1"/>
  <line x1="600" y1="60" x2="600" y2="390" stroke="{BORDER}" stroke-width="1"/>
  <line x1="120" y1="180" x2="680" y2="180" stroke="{BORDER}" stroke-width="1"/>
  <line x1="120" y1="240" x2="680" y2="240" stroke="{BORDER}" stroke-width="1"/>
  <line x1="120" y1="300" x2="680" y2="300" stroke="{BORDER}" stroke-width="1"/>
  <line x1="120" y1="360" x2="680" y2="360" stroke="{BORDER}" stroke-width="1"/>
  <rect x="205" y="190" width="65" height="40" fill="{RED}" opacity="0.5"/>
  <rect x="285" y="190" width="65" height="40" fill="{RED}" opacity="0.5"/>
  <rect x="365" y="250" width="65" height="40" fill="{RED}" opacity="0.5"/>
  <rect x="525" y="130" width="65" height="40" fill="{GRAY}" opacity="0.3"/>
  <circle cx="237" cy="210" r="6" fill="{RED}"/>
  <circle cx="317" cy="210" r="6" fill="{RED}"/>
  <circle cx="397" cy="270" r="6" fill="{RED}"/>
""".format(WHITE=WHITE, BORDER=BORDER, RED=RED, GRAY=GRAY)),
}


def main():
    roots = [
        Path("/Users/alphavisualartists/Vertikal-App/assets/ava"),
        Path("/Users/alphavisualartists/alpha-visual-artists-brand/creators-toolkit/assets/ava"),
    ]
    for rel, content in DIAGRAMS.items():
        for root in roots:
            path = root / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
            print(f"wrote {path}")
    print(f"total: {len(DIAGRAMS)} diagrams x {len(roots)} roots")


if __name__ == "__main__":
    main()
