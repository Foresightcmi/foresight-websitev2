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
        "pitch_angle": "Dual-Inspector precision on high-value architectural estates with $10K warranty protection.",
        "sample_agent": "Top Producing Luxury Agent"
    },
    {
        "brokerage": "Compass Real Estate Atlanta",
        "office": "Buckhead / Midtown / Alpharetta",
        "target_specialty": "Tech-Driven Buyers & Fast Due Diligence",
        "pitch_angle": "HomeGauge CRL™ instant repair addendum generator + 24-hour turnaround.",
        "sample_agent": "High-Volume Team Lead"
    },
    {
        "brokerage": "Keller Williams Realty First Atlanta",
        "office": "Sandy Springs & Perimeter",
        "target_specialty": "First-Time Buyers & Move-Up Sellers",
        "pitch_angle": "Free VIP Utility Concierge ($150 value) to make agent referrals shine.",
        "sample_agent": "Market Center Top Performer"
    },
    {
        "brokerage": "Atlanta Fine Homes Sotheby's International Realty",
        "office": "Intown & North Metro",
        "target_specialty": "Ultra-Luxury Estates & Historic Properties",
        "pitch_angle": "Certified Master Inspector® leadership (top 1% in North America) + FLIR thermal scans.",
        "sample_agent": "Luxury Collection Specialist"
    },
    {
        "brokerage": "Coldwell Banker Realty Atlanta",
        "office": "Dunwoody, Roswell & East Cobb",
        "target_specialty": "Suburban Family Homes & New Construction",
        "pitch_angle": "3-Phase New Construction Audits + 11-Month Builder Warranty Punch Lists.",
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

SUBJECT: Faster due diligence + $10,000 buyer protection for your {b['office']} clients

Hi [Agent Name],

As an active agent serving {b['target_specialty']} across Metro Atlanta, you know how crucial smooth, fact-based due diligence is to keeping contracts moving forward.

At Foresight Home Inspections, we operate with a strict **Two-Inspector Standard** led by **Christopher Boykin, Certified Master Inspector® (CMI)**:

1. ⚡ **2x Speed On Site (1.5–2.5 hrs)**: Two certified inspectors work simultaneously, cutting client and seller wait times in half.
2. 🛡️ **Complimentary $10,000 Master Warranty ($0 Deductible)**: Every standard buyer inspection includes 90-day mechanical, appliance, roof leak, and mold coverage at no extra charge.
3. 🔌 **Free VIP Utility Concierge ($150 Value)**: White-glove setup for your buyers connecting power, water, gas, and gigabit internet with a single phone call.
4. 🔑 **Active SUPRA eKEY Access**: You never have to drive across town just to unlock doors for an inspection.
5. 📝 **Instant GAR Repair Clause Generator**: One-click HomeGauge CRL™ to build custom repair addendums directly from the inspection findings in under 3 minutes.

Whenever your buyers need bulletproof inspection reporting with guaranteed 24-hour turnaround, we would be honored to serve as your go-to due diligence partner.

Explore our Agent Portal & Instant GAR Clause Generator here:
👉 https://www.fhinspectionsatl.com/realtors

Direct Scheduling: 678-480-2110 | inspect@foresightcmi.com

Best regards,

Christopher Boykin, CMI®
Lead Inspector & Founder | Foresight Home Inspections, LLC
Certified Master Inspector® #MICB-1082 | InterNACHI Certified
"""

packets = []
for b in BROKERAGES:
    packet_text = generate_outreach_packet(b)
    packets.append({
        "brokerage": b["brokerage"],
        "office": b["office"],
        "specialty": b["target_specialty"],
        "outreach_template": packet_text
    })

output_path = os.path.join(data_dir, "realtor-outreach-campaign.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump({
        "last_updated": datetime.now().isoformat(),
        "total_target_brokerages": len(BROKERAGES),
        "campaigns": packets
    }, f, indent=2)

print(f"Realtor Outreach Engine Ready: {output_path}")
print(f"Generated customized campaigns for {len(BROKERAGES)} top Metro Atlanta real estate brokerages!")
