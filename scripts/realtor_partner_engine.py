import json
import os
from datetime import datetime

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_dir = os.path.join(base_dir, "data")
os.makedirs(data_dir, exist_ok=True)

# Top Metro Atlanta Brokerages for VIP Outreach
BROKERAGES = [
    {
        "brokerage": "Harry Norman, REALTORS®",
        "office": "Buckhead & North Atlanta Offices",
        "target_specialty": "Luxury Residential & Historic Properties",
        "pitch_angle": "Dual-Inspector precision on high-value architectural estates with up to $35K warranty protection.",
        "sample_agent": "Top Producing Luxury Agent"
    },
    {
        "brokerage": "Compass Real Estate Atlanta",
        "office": "Buckhead / Midtown / Alpharetta",
        "target_specialty": "Tech-Driven Buyers & Fast Due Diligence",
        "pitch_angle": "Interactive GAR Form F404 builder + Georgia Due Diligence Calculator + 24-hour turnaround.",
        "sample_agent": "High-Volume Team Lead"
    },
    {
        "brokerage": "Keller Williams Realty First Atlanta",
        "office": "Sandy Springs & Perimeter",
        "target_specialty": "First-Time Buyers & Move-Up Sellers",
        "pitch_angle": "Free VIP Utility Concierge ($150 value) + $35K warranty protection to give buyers confidence.",
        "sample_agent": "Market Center Top Performer"
    },
    {
        "brokerage": "Atlanta Fine Homes Sotheby's International Realty",
        "office": "Intown & North Metro",
        "target_specialty": "Ultra-Luxury Estates & Historic Properties",
        "pitch_angle": "Certified Master Inspector® leadership (top 1% in North America) + FLIR thermal scans on every inspection.",
        "sample_agent": "Luxury Collection Specialist"
    },
    {
        "brokerage": "Coldwell Banker Realty Atlanta",
        "office": "Dunwoody, Roswell & East Cobb",
        "target_specialty": "Suburban Family Homes & New Construction",
        "pitch_angle": "3-Phase New Construction Audits + 11-Month Builder Warranty Punch Lists + 2026 Metro Defect Index.",
        "sample_agent": "Premier Club Agent"
    },
    {
        "brokerage": "Berkshire Hathaway HomeServices Georgia Properties",
        "office": "Gwinnett & North Fulton Offices",
        "target_specialty": "Executive Homes & Golf Communities",
        "pitch_angle": "Active SUPRA eKEY access across all 20 Metro Atlanta counties with zero agent door-unlock hassle.",
        "sample_agent": "Chairman's Circle Agent"
    }
]

def generate_outreach_packet(brokerage_data):
    b = brokerage_data
    return f"""===================================================================
VIP AGENT PARTNERSHIP OUTREACH PACKET: {b['brokerage']}
Target Office: {b['office']} | Focus: {b['target_specialty']}
===================================================================

SUBJECT: Faster due diligence + $35,000 protection for your {b['office']} clients

Hi [Agent Name],

As an active agent serving {b['target_specialty']} across Metro Atlanta, you know how crucial smooth, fact-based due diligence is to keeping contracts moving forward.

At Foresight Home Inspections, we operate with a strict **Two-Inspector Standard** led by **Christopher Boykin, Certified Master Inspector® (CMI)**:

1. ⚡ **2x Speed On Site (1.5–2.5 hrs)**: Two certified inspectors work simultaneously, cutting client and seller wait times in half.
2. 🛡️ **Up to $35,000 in Protection ($0 Deductible)**: Includes our $10,000 Elite Master Inspection Warranty covering appliances, structural, HVAC, plumbing, electrical, mold, and roof leaks, plus InterNACHI's $25,000 Honor Guarantee.
3. 🧮 **Free Interactive Realtor Tools**:
   - **GAR Form F404 Repair Addendum Builder**: Draft custom repair amendments directly from inspection findings in under 3 minutes (https://www.fhinspectionsatl.com/realtors).
   - **Georgia Due Diligence Calculator**: Verify exact contract contingency deadlines per O.C.G.A. § 1-3-1 (https://www.fhinspectionsatl.com/due-diligence).
   - **2026 Metro Atlanta Defect Index**: Real-world field telemetry on top regional building failures (https://www.fhinspectionsatl.com/blog/metro-atlanta-residential-defect-index-building-science-study).
4. 🔌 **Free VIP Utility Concierge ($150 Value)**: White-glove setup connecting power, water, gas, and gigabit internet with a single phone call for your buyers.
5. 🔑 **Active SUPRA eKEY Access**: You never have to drive across town just to unlock doors for an inspection.

Whenever your buyers need bulletproof inspection reporting with guaranteed 24-hour turnaround, we would be honored to serve as your go-to due diligence partner.

Explore our Agent Portal & Interactive Tools:
👉 https://www.fhinspectionsatl.com/realtors

Direct Scheduling: 678-480-2110 | inspect@foresightcmi.com

Best regards,

Christopher Boykin, CMI®
Lead Inspector & Founder | Foresight Home Inspections, LLC
Certified Master Inspector® #MICB-1082 | InterNACHI Certified
"""

packets = []
brief_lines = [
    "# Metro Atlanta VIP Brokerage Outreach Dispatch Brief",
    f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
    "",
    "This brief contains tailored partnership outreach packages for top Metro Atlanta brokerage offices.",
    "Equip their managing brokers, team leaders, and productivity coaches with our free interactive Due Diligence tools and CMI dual-team standard.",
    "",
    "---",
    ""
]

for b in BROKERAGES:
    packet_text = generate_outreach_packet(b)
    packets.append({
        "brokerage": b["brokerage"],
        "office": b["office"],
        "specialty": b["target_specialty"],
        "outreach_template": packet_text
    })
    brief_lines.append(f"## {b['brokerage']} ({b['office']})")
    brief_lines.append(f"**Target Audience**: {b['sample_agent']} | **Focus Area**: {b['target_specialty']}")
    brief_lines.append("```text")
    brief_lines.append(packet_text.strip())
    brief_lines.append("```")
    brief_lines.append("")
    brief_lines.append("---")
    brief_lines.append("")

output_path = os.path.join(data_dir, "realtor-outreach-campaign.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump({
        "last_updated": datetime.now().isoformat(),
        "total_target_brokerages": len(BROKERAGES),
        "campaigns": packets
    }, f, indent=2)

brief_path = os.path.join(data_dir, "realtor-dispatch-brief.md")
with open(brief_path, "w", encoding="utf-8") as f:
    f.write("\n".join(brief_lines))

print(f"Realtor Outreach Engine Ready: {output_path}")
print(f"Dispatch Brief Generated: {brief_path}")
print(f"Generated customized campaigns for {len(BROKERAGES)} top Metro Atlanta real estate brokerages!")
