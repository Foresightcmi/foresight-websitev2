import asyncio
import os
import edge_tts

VOICE = "en-US-JennyNeural"

PROMPTS = {
    "receptionist-greeting.mp3": "Hello, and welcome to Foresight Home Inspections! I'm your virtual concierge and receptionist for Christopher Boykin and our inspection team. Are you looking to schedule an inspection, calculate an instant price quote, or do you have questions about a home in Metro Atlanta?",
    "receptionist-goodbye.mp3": "Thank you for visiting Foresight Home Inspections! Have a wonderful day, and Christopher and our team look forward to inspecting your home soon!",
    "receptionist-sunday.mp3": "Foresight Home Inspections is open on Sunday strictly by advance appointment. While our standard schedule runs Monday through Saturday, we are always glad to accommodate Sunday inspections booked in advance. What property address are you looking to have inspected?",
    "receptionist-identity.mp3": "You have reached Foresight Home Inspections. I am the virtual concierge and receptionist for Christopher Boykin, our lead Certified Master Inspector. Our two-inspector team delivers Georgia's most thorough home evaluations, building science diagnostics, and instant quotes. What property or questions can I help you with today?",
    "receptionist-why-two.mp3": "Most discount companies send one solo inspector who gets exhausted after four hours and can easily miss critical defects. Foresight sends two certified inspectors on every single job, led by Certified Master Inspector Christopher Boykin! You get double the scrutiny in half the time, plus up to 35,000 dollars in warranty and guarantee protection. Would you like to check our availability for your property?",
    "receptionist-warranty.mp3": "Every full inspection includes up to 35,000 dollars in combined warranty and guarantee protection: our complimentary 10,000 dollar Master Protection Warranty with zero deductible covering mechanicals, structure, appliances, roofs, and mold after closing, plus InterNACHI's 25,000 dollar Honor Guarantee. Would you like to get your inspection scheduled with our team?",
    "receptionist-competitors.mp3": "National franchises charge 450 to 575 dollars to cover corporate royalties and dispatch hourly junior techs. Solo discount operators charge 325 to 400, but working alone for 4 hours causes fatigue and they offer zero warranty. Missing an 8,000 dollar defect wipes out any 50 dollar upfront saving! Foresight delivers two certified inspectors, up to 35,000 dollars in warranty protection, and free thermal imaging starting from 345 dollars. Shall I calculate an instant quote for you?",
    "receptionist-pricing.mp3": "Our single-family home inspections start at 345 dollars for homes up to 1,500 square feet, 375 for up to 2,000, 405 for up to 2,500, and 440 for up to 3,000 square feet. That includes our two-inspector team, complimentary FLIR thermal imaging, drone scans, and up to 35,000 dollars in warranty protection. What is the approximate square footage of the home?",
    "receptionist-10am.mp3": "10:00 AM works out perfectly for our two-inspector team! What is the property address and your name so I can pencil that in for you?",
    "receptionist-9am.mp3": "9:00 AM works out great for our two-inspector team! What is the property address and your name so I can pencil that in for you?",
    "receptionist-afternoon.mp3": "An afternoon slot around 1:30 PM works out great for our two-inspector team! What is the property address and your name so I can pencil that in for you?",
    "receptionist-morning-afternoon.mp3": "Does a morning slot around 9:00 or 10:00 AM work better for you, or would you prefer the afternoon? What is the address of the home so I can hold that for you?",
    "receptionist-address-confirm.mp3": "Got that property address down! What is your name and the best phone number so Christopher's office can send the confirmation and coordinate access?",
    "receptionist-decline-addon.mp3": "Understood, no problem at all! We will keep your inspection focused strictly on your core evaluation with our two-inspector team. What date or time window works best for you?",
    "receptionist-browsing.mp3": "No problem at all! Feel free to ask me anything about our up to 35,000 dollar warranty protection, pricing, or our two-inspector process whenever you are ready. What questions can I answer for you?",
    "receptionist-payment-policy.mp3": "To solidify all appointments on our master calendar, a 50 percent deposit along with the signed inspection agreements are completed after our office sends your appointment confirmation. The remaining 50 percent balance is due after our on-site walkthrough before your official report is released. Would you like me to hold our next available window for you?",
    "receptionist-drone-thermal.mp3": "Yes, absolutely! We include FLIR infrared thermal imaging to catch hidden leaks behind walls and aerial drone roof scans standard on every single inspection for free. Would you like to reserve an inspection window with our team?",
    "receptionist-process.mp3": "We perform an exhaustive top-to-bottom evaluation following InterNACHI standards. We inspect the roof with 4K aerial drones, check attics, test electrical panels for fire hazards, evaluate plumbing for polybutylene, test HVAC temperature splits, and inspect foundations for red clay pressure. Plus, we include free FLIR thermal imaging to see inside walls. Because we send two certified inspectors, we finish in half the time and deliver your full digital report within 24 hours. What property are you looking to have evaluated?",
    "receptionist-booked.mp3": "Awesome! I have your inspection request logged. Christopher's office will follow up directly within 20 minutes with your official appointment confirmation and inspection agreements to sign. We look forward to working with you!",
    "receptionist-checklist.mp3": "I have recorded your request. Part 1 of our Foresight vs. Hindsight due diligence checklist has been queued for your inbox. What other questions can I answer about your home or our inspection process?",
    "receptionist-upsell-sewer.mp3": "Because older homes frequently have clay or cast iron sewer lines vulnerable to root intrusion or bellies, we often suggest our high-definition sewer scope camera for 450 dollars. Would you like us to include that, or keep it strictly to the standard home inspection?",
    "receptionist-upsell-radon.mp3": "Since the property features a crawlspace or basement and Georgia has high granite bedrock, we frequently recommend our 48-hour continuous radon monitor test for 250 dollars. Would you like to add that to your estimate, or keep it as is?",
    "receptionist-upsell-termite.mp3": "Because Georgia is in the termite belt and most lenders require an official clearance letter, we can bundle your official Georgia termite letter starting at 125 dollars. Would you like that included, or do you already have that covered?"
}

async def generate_all():
    out_dir = os.path.join(os.getcwd(), "public", "audio")
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Synthesizing {len(PROMPTS)} receptionist voice assets using voice: {VOICE}...")
    for filename, text in PROMPTS.items():
        out_path = os.path.join(out_dir, filename)
        print(f" -> Generating {filename}...")
        communicate = edge_tts.Communicate(text, VOICE, rate="-2%", pitch="-1Hz")
        await communicate.save(out_path)
        print(f"    Done ({os.path.getsize(out_path):,} bytes)")
    print("All receptionist audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate_all())
