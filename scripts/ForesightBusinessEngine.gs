/**
 * Foresight Home Inspections, LLC
 * Autonomous Business Engine (Google Apps Script)
 * 
 * Target Workspace Email: plsinspectnow@gmail.com
 * 
 * Features:
 * 0. Programmatic Initial Setup (initialSetup): Creates the folder tree, template doc, and triggers in one click.
 * 1. Webhook Lead Capture (doPost): Saves website checklist signups to a Google Sheet.
 * 2. 3-Part Nurture Sequence: Immediately fires Part 1, and schedules daily cron follow-ups for Parts 2 & 3.
 * 3. HomeGauge Inbox Monitor (monitorInbox): Time-driven scanning of plsinspectnow@gmail.com for booking notifications,
 *    auto-creating Google Drive folder structures, copying templates, and sending warm client confirmations.
 * 
 * Brand Slogan: "Because hindsight is expensive... Choose Foresight!"
 * Brand Voice: Professional, warm, folksy, Christopher Boykin Certified Master Inspector.
 */

// Global Configuration
var ACTIVE_INSPECTIONS_FOLDER_NAME = "Active Inspections";
var SERVICE_AGREEMENT_TEMPLATE_NAME = "Service Agreement Template";
var BUSINESS_EMAIL = "inspect@foresightcmi.com, plsinspectnow@gmail.com";

/**
 * 0. ONE-CLICK INITIALIZATION ENGINE
 * Run this function once from the editor to set up folders, templates, and background triggers automatically.
 */
function initialSetup() {
  Logger.log("⚡ Starting Foresight Autonomous Engine Initial Setup...");

  try {
    // A. Create or verify "Leads" sheet tab and headers programmatically
    var leadsSheet = getOrCreateLeadsSheet();
    Logger.log("✔ Google Sheet database structure ('Leads' tab and headers) created/verified.");

    // B. Create or verify "Active Inspections" Google Drive Folder
    var folder = getOrCreateDriveFolder(ACTIVE_INSPECTIONS_FOLDER_NAME);
    Logger.log("✔ Folder '" + ACTIVE_INSPECTIONS_FOLDER_NAME + "' verified/created.");

    // B. Create or verify "Service Agreement Template" Google Doc in Drive root
    var templates = DriveApp.getFilesByName(SERVICE_AGREEMENT_TEMPLATE_NAME);
    if (!templates.hasNext()) {
      var doc = DocumentApp.create(SERVICE_AGREEMENT_TEMPLATE_NAME);
      doc.getBody().appendParagraph("FORESIGHT HOME INSPECTIONS, LLC - SERVICE AGREEMENT TEMPLATE\n\n[Please paste your InterNACHI Service Agreement content here]");
      doc.saveAndClose();
      Logger.log("✔ Created placeholder Service Agreement Template in your Google Drive.");
    } else {
      Logger.log("✔ Service Agreement Template already exists in Google Drive.");
    }

    // C. Clear existing triggers for these functions to avoid duplicates
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      var handler = triggers[i].getHandlerFunction();
      if (handler === 'monitorInbox' || handler === 'sendNurtureEmails') {
        ScriptApp.deleteTrigger(triggers[i]);
        Logger.log("🗑 Cleared duplicate trigger for function: " + handler);
      }
    }

    // D. Programmatically build time-driven triggers
    // 1. Inbox Monitor (HomeGauge bookings) - runs every 10 minutes
    ScriptApp.newTrigger('monitorInbox')
             .timeBased()
             .everyMinutes(10)
             .create();
    Logger.log("✔ Created background trigger: monitorInbox (runs every 10 minutes).");

    // 2. Nurture Queue (Day 2 & Day 3 emails) - runs daily between 8 AM and 9 AM
    ScriptApp.newTrigger('sendNurtureEmails')
             .timeBased()
             .everyDays(1)
             .atHour(8)
             .create();
    Logger.log("✔ Created background trigger: sendNurtureEmails (runs daily at 8:00 AM).");

    Logger.log("🎉 Setup Complete! Your Foresight Business Engine is now fully operational.");
    
  } catch (error) {
    Logger.log("❌ Error in initialSetup: " + error.toString());
  }
}

/**
 * 1. WEBHOOK ENDPOINT: doPost(e)
 * Listens for lead capture POST requests from the website.
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'capture_lead') {
      var name = payload.name || 'Valued Client';
      var email = payload.email || 'Not provided';
      var phone = payload.phone || 'Not provided';
      var address = payload.address || 'Pending Address';
      var preferredDate = payload.preferredDate || 'Earliest Available';
      var sqft = payload.sqft ? (payload.sqft + ' sq ft') : 'Pending';
      var propertyType = payload.propertyType || 'Standard Property';
      var serviceType = payload.serviceType || 'Home Inspection';
      var addons = payload.addons || 'None selected';
      var estimatedTotal = payload.estimatedTotal || 'TBD';
      var message = payload.message || payload.notes || 'None';
      var source = payload.source || 'Website Form';
      var notes = payload.notes || '';
      
      // Save the lead to our sheet database
      var sheet = getOrCreateLeadsSheet();
      var timestamp = new Date();
      
      // Notify the business owner immediately (Dual recipient: inspect@foresightcmi.com & plsinspectnow@gmail.com)
      var emailSubject = "🚨 [NEW LEAD / TENTATIVE REQUEST] " + name + " - " + (address !== 'Pending Address' ? address : preferredDate);
      var htmlBody = 
        "<div style='font-family: Arial, sans-serif; padding: 24px; border: 2px solid #b91c1c; border-radius: 8px; background: #ffffff; max-width: 650px;'>" +
          "<div style='background: #b91c1c; color: #ffffff; padding: 14px 18px; border-radius: 6px 6px 0 0; margin: -24px -24px 20px -24px;'>" +
            "<h2 style='margin: 0; font-size: 1.25rem; font-family: Georgia, serif;'>🚨 New Tentative Inspection Request</h2>" +
            "<p style='margin: 4px 0 0; font-size: 0.85rem; opacity: 0.95;'>Source: " + source + " | Status: Pending Office Confirmation</p>" +
          "</div>" +
          
          "<table style='width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 15px;'>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; width: 160px; color: #475569;'>Client Name:</td><td style='padding: 9px 0; font-weight: 600; color: #0f172a;'>" + name + "</td></tr>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; color: #475569;'>Phone Number:</td><td style='padding: 9px 0;'><a href='tel:" + phone + "' style='color: #b91c1c; font-weight: bold; text-decoration: none;'>📞 " + phone + "</a></td></tr>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; color: #475569;'>Email Address:</td><td style='padding: 9px 0;'><a href='mailto:" + email + "' style='color: #0284c7; text-decoration: none; font-weight: 500;'>✉️ " + email + "</a></td></tr>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; color: #475569;'>Property Address:</td><td style='padding: 9px 0; font-weight: 600; color: #0f172a;'>📍 " + address + "</td></tr>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; color: #475569;'>Requested Date:</td><td style='padding: 9px 0; color: #b91c1c; font-weight: bold;'>📅 " + preferredDate + "</td></tr>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; color: #475569;'>Service & Type:</td><td style='padding: 9px 0;'>" + serviceType + " (" + propertyType + ")</td></tr>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; color: #475569;'>Square Footage:</td><td style='padding: 9px 0;'>" + sqft + "</td></tr>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; color: #475569;'>Estimated Total:</td><td style='padding: 9px 0; font-weight: bold; color: #047857; font-size: 1.1rem;'>" + estimatedTotal + "</td></tr>" +
            "<tr style='border-bottom: 1px solid #e2e8f0;'><td style='padding: 9px 0; font-weight: bold; color: #475569;'>Add-on Services:</td><td style='padding: 9px 0;'>" + addons + "</td></tr>" +
            "<tr><td style='padding: 9px 0; font-weight: bold; vertical-align: top; color: #475569;'>Client Note / Message:</td><td style='padding: 9px 0; background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px; line-height: 1.5; color: #334155;'>" + message + "</td></tr>" +
          "</table>" +
          
          "<div style='background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 4px;'>" +
            "<p style='margin: 0; font-size: 0.875rem; color: #991b1b; line-height: 1.4;'>" +
              "<strong>Action Required:</strong> Call or text the client within 20 minutes to confirm arrival time, lock in the appointment, and send inspection agreements. (Sunday is strictly by appointment only)." +
            "</p>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: BUSINESS_EMAIL,
        subject: emailSubject,
        htmlBody: htmlBody
      });
      
      // Check if lead already exists to prevent duplicate nurture fires
      if (!isDuplicateLead(sheet, email)) {
        sheet.appendRow([timestamp, name, email, phone, address, preferredDate, serviceType, estimatedTotal, 'LEAD_CAPTURED', notes || message, timestamp]);
        
        // Fire Part 1 Email immediately to the prospective client!
        if (email && email.indexOf('@') !== -1 && email !== 'Not provided') {
          sendNurtureEmail1(name, email);
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Lead processed successfully.' }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Invalid action.' }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    Logger.log("Error in Webhook doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper: Locate or create the "Leads" Google Sheet
 */
function getOrCreateLeadsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    // Check for "Business Leads & Booking Engine" first, then fallback to "Foresight_Engine_Leads"
    var files = DriveApp.getFilesByName("Business Leads & Booking Engine");
    if (!files.hasNext()) {
      files = DriveApp.getFilesByName("Foresight_Engine_Leads");
    }
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create("Business Leads & Booking Engine");
    }
  }
  
  var sheet = ss.getSheetByName("Leads");
  if (!sheet) {
    // If the active sheet has only 1 tab, check if it's already the leads destination
    if (ss.getSheets().length === 1 && ss.getSheets()[0].getName() !== "Leads") {
      sheet = ss.getSheets()[0];
      sheet.setName("Leads");
    } else {
      sheet = ss.insertSheet("Leads");
    }
    // Write comprehensive headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Address", "PreferredDate", "ServiceType", "EstimatedTotal", "Status", "Notes", "LastSentDate"]);
      sheet.getRange("A1:K1").setFontWeight("bold").setBackground("#d32f2f").setFontColor("white");
    }
  }
  return sheet;
}

/**
 * Helper: Check for duplicate lead emails in the Sheet
 */
function isDuplicateLead(sheet, email) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] && data[i][2].toString().toLowerCase() === email.toLowerCase()) {
      return true;
    }
  }
  return false;
}

/**
 * 2. EMAIL NURTURE SEQUENCES (Parts 1, 2, & 3)
 */

// Part 1: Sent immediately upon website request
function sendNurtureEmail1(name, email) {
  var subject = "Your \"Foresight vs. Hindsight\" Checklist - Part 1: Structural Bones";
  
  var htmlBody = 
    "<div style=\"font-family: Arial, sans-serif; max-width: 600px; color: #1f2937; line-height: 1.6;\">" +
      "<div style=\"background-color: #d32f2f; color: white; padding: 1.5rem; text-align: center;\">" +
        "<h2 style=\"margin: 0; font-family: Georgia, serif;\">Foresight Home Inspections</h2>" +
        "<p style=\"margin: 5px 0 0 0; font-style: italic; font-size: 0.95rem;\">\"Because hindsight is expensive... Choose Foresight!\"</p>" +
      "</div>" +
      "<div style=\"padding: 1.5rem;\">" +
        "<p>Well hello there <strong>" + name + "</strong>,</p>" +
        "<p>I'm Christopher Boykin, founder and Certified Master Inspector here at Foresight Home Inspections. I'm mighty glad you requested our <strong>\"Foresight vs. Hindsight\" Checklist</strong>. My partner and I have spent decades climbing through attics and crawling through Georgia dirt, and let me tell you—what you don't check now will cost you down the road!</p>" +
        "<p>In this first part of our checklist, we are focusing on the very foundation and structural bones of your home:</p>" +
        
        "<div style=\"background: #f3f4f6; border-left: 4px solid #d32f2f; padding: 1rem; margin: 1.5rem 0;\">" +
          "<h4 style=\"margin: 0 0 0.5rem 0; color: #d32f2f;\">🏡 Part 1 Checklist: Foundation & Structural Bones</h4>" +
          "<ul style=\"margin: 0; padding-left: 1.25rem;\">" +
            "<li style=\"margin-bottom: 0.5rem;\"><strong>Check for Brickwork Cracks</strong>: Look closely at exterior brick siding. Stair-step cracking running down mortar joints often implies concrete foundation settling or shifting soil pressure.</li>" +
            "<li style=\"margin-bottom: 0.5rem;\"><strong>Inspect Crawlspace Moisture</strong>: Stick your head under the floorboards. High crawlspace humidity, standing puddles, or soft floor framing indicate hidden drainage issues risking wood rot.</li>" +
            "<li><strong>Analyze Retaining Walls</strong>: Georgia's clay soil is heavy. Horizontal cracks or leaning in basement foundation block walls mean lateral pressure is shifting the structure.</li>" +
          "</ul>" +
        "</div>" +
        
        "<p>Remember, catching a foundation issue early saves you from paying a structural contractor $15,000+ later on. That is why we send <strong>two certified inspectors</strong> on every single property audit we perform—one seasoned Master Inspector and another certified pro—giving you two sets of eyes to ensure nothing gets missed.</p>" +
        "<p>Keep an eye on your inbox tomorrow. I'm going to send you Part 2, which covers water leaks and roof defects. Water is a house's worst enemy, and we'll show you exactly how to spot it before it rots your ceilings!</p>" +
        "<p>If you're already in the middle of a home search and want to get us out there, hop over to our <a href=\"https://www.fhinspectionsatl.com/quote\" style=\"color: #d32f2f; text-decoration: underline; font-weight: bold;\">Instant Quote Calculator</a> to calculate your transparent price and book a spot. Our clients routinely save thousands of dollars at the closing table using our photographic reports!</p>" +
        
        "<p style=\"margin-top: 2rem;\">Take care, and remember:</p>" +
        "<p style=\"font-size: 1.1rem; color: #d32f2f; font-weight: bold; font-style: italic;\">\"Because hindsight is expensive... Choose Foresight!\"</p>" +
        "<p>Warmly,</p>" +
        "<p><strong>Christopher Boykin</strong><br />" +
        "Certified Master Inspector®<br />" +
        "Foresight Home Inspections, LLC<br />" +
        "<a href=\"mailto:plsinspectnow@gmail.com\" style=\"color: #1f2937;\">plsinspectnow@gmail.com</a> | 678-480-2110</p>" +
      "</div>" +
    "</div>";
    
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    replyTo: BUSINESS_EMAIL
  });
}

// Part 2: Sent 24 hours later by daily cron
function sendNurtureEmail2(name, email) {
  var subject = "\"Foresight vs. Hindsight\" Checklist - Part 2: Water & Roof Shields";
  
  var htmlBody = 
    "<div style=\"font-family: Arial, sans-serif; max-width: 600px; color: #1f2937; line-height: 1.6;\">" +
      "<div style=\"background-color: #d32f2f; color: white; padding: 1.5rem; text-align: center;\">" +
        "<h2 style=\"margin: 0; font-family: Georgia, serif;\">Foresight Home Inspections</h2>" +
        "<p style=\"margin: 5px 0 0 0; font-style: italic; font-size: 0.95rem;\">\"Because hindsight is expensive... Choose Foresight!\"</p>" +
      "</div>" +
      "<div style=\"padding: 1.5rem;\">" +
        "<p>Well hello again <strong>" + name + "</strong>,</p>" +
        "<p>Christopher Boykin here with Part 2 of your checklist. Today, we are talking about water and roofs. As I always say on site, water is a house's number one enemy. A tiny, slow drip behind a master shower wall can rot out structural studs and grow toxic mold for months before you ever see a stain on the drywall!</p>" +
        "<p>Here is what you need to check to keep your roof and plumbing systems tight:</p>" +
        
        "<div style=\"background: #f3f4f6; border-left: 4px solid #d32f2f; padding: 1rem; margin: 1.5rem 0;\">" +
          "<h4 style=\"margin: 0 0 0.5rem 0; color: #d32f2f;\">💧 Part 2 Checklist: Water Leaks & Roof Barriers</h4>" +
          "<ul style=\"margin: 0; padding-left: 1.25rem;\">" +
            "<li style=\"margin-bottom: 0.5rem;\"><strong>Look at Vent Pipe Boots</strong>: Roof leaks rarely start on the shingles themselves. Climb up or use binoculars to inspect the rubber boot around plumbing exhaust pipes. Over time, Georgia's baking sun cracks the rubber, letting water run straight down the wood sheathing.</li>" +
            "<li style=\"margin-bottom: 0.5rem;\"><strong>Check Sink Floor Cabinets</strong>: Don't just check for running water. Rub your hands along the base cabinet wood under sinks. Black staining or warping means a slow drain pipe drip is silently active.</li>" +
            "<li><strong>Evaluate Attic Duct condensation</strong>: In hot Georgia summers, humid attic air will sweat against uninsulated metal AC ductwork. If the condensation drip pan or line gets clogged, water overflows, rotting attic framing and collapsing ceilings below.</li>" +
          "</ul>" +
        "</div>" +
        
        "<p>During our physical inspections, we run advanced <strong>FLIR thermal imaging cameras</strong> and electronic moisture meters on every wall and ceiling at no extra cost. This allows us to see temperature anomalies and find hidden leaks behind tiles that the naked eye would miss entirely.</p>" +
        "<p>Tomorrow, I'm going to send you the final part of our checklist covering mechanical safety systems, including electrical panel dangers and the silent threat of Radon gas.</p>" +
        "<p>Remember, a professional home audit isn't an expense—it is designed to save you thousands. If we uncover a $6,000 AC failure or a leaking bathroom wall, we equip you with photographic and video evidence so you can require the seller to correct it before closing, or win significant repair credits.</p>" +
        
        "<p style=\"margin-top: 2rem;\">Keep safe out there, and remember:</p>" +
        "<p style=\"font-size: 1.1rem; color: #d32f2f; font-weight: bold; font-style: italic;\">\"Because hindsight is expensive... Choose Foresight!\"</p>" +
        "<p>Warmly,</p>" +
        "<p><strong>Christopher Boykin</strong><br />" +
        "Certified Master Inspector®<br />" +
        "Foresight Home Inspections, LLC<br />" +
        "<a href=\"mailto:plsinspectnow@gmail.com\" style=\"color: #1f2937;\">plsinspectnow@gmail.com</a> | 678-480-2110</p>" +
      "</div>" +
    "</div>";
    
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    replyTo: BUSINESS_EMAIL
  });
}

// Part 3: Sent 48 hours later by daily cron
function sendNurtureEmail3(name, email) {
  var subject = "\"Foresight vs. Hindsight\" Checklist - Part 3: Mechanical & Radon Shields";
  
  var htmlBody = 
    "<div style=\"font-family: Arial, sans-serif; max-width: 600px; color: #1f2937; line-height: 1.6;\">" +
      "<div style=\"background-color: #d32f2f; color: white; padding: 1.5rem; text-align: center;\">" +
        "<h2 style=\"margin: 0; font-family: Georgia, serif;\">Foresight Home Inspections</h2>" +
        "<p style=\"margin: 5px 0 0 0; font-style: italic; font-size: 0.95rem;\">\"Because hindsight is expensive... Choose Foresight!\"</p>" +
      "</div>" +
      "<div style=\"padding: 1.5rem;\">" +
        "<p>Well hello there <strong>" + name + "</strong>,</p>" +
        "<p>This is Christopher Boykin, and today we are wrapping up our checklist series by looking at the systems that keep your home alive, running, and safe—your electrical work, HVAC units, and the air your family breathes.</p>" +
        "<p>Here is what you need to check to make sure your home's mechanical shield is fully secure:</p>" +
        
        "<div style=\"background: #f3f4f6; border-left: 4px solid #d32f2f; padding: 1rem; margin: 1.5rem 0;\">" +
          "<h4 style=\"margin: 0 0 0.5rem 0; color: #d32f2f;\">⚡ Part 3 Checklist: Mechanical Safety & Silent Gases</h4>" +
          "<ul style=\"margin: 0; padding-left: 1.25rem;\">" +
            "<li style=\"margin-bottom: 0.5rem;\"><strong>Inspect the Panel for Double-Taps</strong>: Pull off the panel door cover (carefully!). If you see two electrical wires crammed into a single circuit breaker slot (a 'double tap'), it causes arcing, overheating, and poses a direct electrical house fire danger.</li>" +
            "<li style=\"margin-bottom: 0.5rem;\"><strong>Understand Radon Gas Risks</strong>: Georgia's granite soils naturally breakdown, venting colorless, radioactive radon gas into crawlspaces and basements. The EPA lists Radon as the second leading cause of lung cancer in the US. Every home purchase should include a 48-hour continuous electronic monitor test.</li>" +
            "<li><strong>Check HVAC Heating Exchanger Rust</strong>: Rust or soot deposits around furnace burners mean fuel is burning incompletely, which can crack the heat exchanger and leak toxic carbon monoxide gas into your breathing air.</li>" +
          "</ul>" +
        "</div>" +
        
        "<p>This completes our three-part checklist! I hope these tips give you the confidence to start looking closely at houses. But remember: nothing replaces a physical on-site audit by two certified professional inspectors.</p>" +
        "<p>When you book with us, we send two inspectors on every job—including myself, a licensed Certified Master Inspector—to ensure you get absolute peace of mind. We include aerial drone roof flights, full panel thermal scans, and mold/moisture tests. Best of all, every inspection includes our <strong>$10,000 Elite Master Inspection Warranty</strong> at no extra cost to protect your budget for 90 days after closing.</p>" +
        "<p>Let us handle the details so you don't face expensive surprises later on.</p>" +
        "<p>📅 Ready to get started? Head over to our <a href=\"https://www.fhinspectionsatl.com/quote\" style=\"color: #d32f2f; text-decoration: underline; font-weight: bold;\">Instant Quote Calculator</a> to calculate your exact fee, or reply directly to this email to ask any questions. We are here to help!</p>" +
        
        "<p style=\"margin-top: 2rem;\">Stay safe, and remember:</p>" +
        "<p style=\"font-size: 1.1rem; color: #d32f2f; font-weight: bold; font-style: italic;\">\"Because hindsight is expensive... Choose Foresight!\"</p>" +
        "<p>Warmly,</p>" +
        "<p><strong>Christopher Boykin</strong><br />" +
        "Certified Master Inspector®<br />" +
        "Foresight Home Inspections, LLC<br />" +
        "<a href=\"mailto:plsinspectnow@gmail.com\" style=\"color: #1f2937;\">plsinspectnow@gmail.com</a> | 678-480-2110</p>" +
      "</div>" +
    "</div>";
    
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    replyTo: BUSINESS_EMAIL
  });
}

/**
 * 3. DAILY CRON TASK: sendNurtureEmails()
 * Trigger this once a day to scan the sheet database and send follow-ups.
 */
function sendNurtureEmails() {
  try {
    var sheet = getOrCreateLeadsSheet();
    var data = sheet.getDataRange().getValues();
    var now = new Date();
    
    // Loop through row data (excluding header)
    for (var i = 1; i < data.length; i++) {
      var rowNum = i + 1;
      var name = data[i][1];
      var email = data[i][2];
      var status = data[i][4];
      var lastSent = new Date(data[i][5]);
      
      // Calculate hours since last email send
      var hoursElapsed = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
      
      if (status === 'LEAD_CAPTURED' && hoursElapsed >= 22) { // 22 hours to allow slight trigger variances
        sendNurtureEmail2(name, email);
        sheet.getRange(rowNum, 5).setValue('EMAIL_2_SENT');
        sheet.getRange(rowNum, 6).setValue(now);
        Logger.log("Sent Nurture Part 2 to: " + email);
      } 
      else if (status === 'EMAIL_2_SENT' && hoursElapsed >= 22) {
        sendNurtureEmail3(name, email);
        sheet.getRange(rowNum, 5).setValue('EMAIL_3_SENT');
        sheet.getRange(rowNum, 6).setValue(now);
        Logger.log("Sent Nurture Part 3 (Final) to: " + email);
      }
    }
  } catch (error) {
    Logger.log("Error in sendNurtureEmails cron: " + error.toString());
  }
}

/**
 * 4. GMAIL INBOX MONITORING ENGINE: monitorInbox()
 * Run this on a 10-minute time-trigger to scan plsinspectnow@gmail.com for HomeGauge bookings.
 */
function monitorInbox() {
  try {
    // Search unread emails from HomeGauge containing booking data
    var threads = GmailApp.search('subject:"HomeGauge Booking" is:unread', 0, 10);
    
    if (threads.length === 0) {
      Logger.log("No new HomeGauge booking notifications found.");
      return;
    }
    
    // Find or create "Active Inspections" root folder
    var activeInspectionsFolder = getOrCreateDriveFolder(ACTIVE_INSPECTIONS_FOLDER_NAME);
    
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      var message = messages[messages.length - 1]; // Process the latest message in thread
      
      var emailBody = message.getBody();
      var emailText = message.getPlainBody();
      
      // Parse Client Name, Email, and Property Address
      var clientName = parseField(emailText, /Client:\s*([^\n\r]+)/i) || 
                       parseField(emailText, /Client Name:\s*([^\n\r]+)/i) || 
                       "Valued Client";
                        
      var propertyAddress = parseField(emailText, /Address:\s*([^\n\r]+)/i) || 
                            parseField(emailText, /Property Address:\s*([^\n\r]+)/i) || 
                            parseField(emailText, /Property:\s*([^\n\r]+)/i) || 
                            "Unknown Property " + new Date().toLocaleDateString();
                            
      var clientEmail = parseField(emailText, /Client Email:\s*([^\n\r]+)/i) || 
                        parseField(emailText, /Email:\s*([^\n\r]+)/i) || 
                        "";
      
      // Clean up property address for folder naming
      propertyAddress = propertyAddress.trim().replace(/[\\\/:*?"<>|]/g, ""); 
      
      Logger.log("Parsing Booking - Client: " + clientName + ", Address: " + propertyAddress + ", Email: " + clientEmail);
      
      // A. Create folder in Google Drive
      var projectFolder = activeInspectionsFolder.createFolder(propertyAddress);
      
      // B. Locate and duplicate the Service Agreement Template
      cloneServiceAgreement(projectFolder, propertyAddress);
      
      // C. Send a warm "Foresight" welcome confirmation email to the client
      if (clientEmail) {
        sendClientWelcomeEmail(clientName, clientEmail, propertyAddress);
      } else {
        Logger.log("Client email not found. Welcome email skipped.");
      }
      
      // D. Mark thread as read and apply processed label
      threads[i].markRead();
      applyProcessedLabel(threads[i]);
      
      Logger.log("Successfully processed booking notification for property: " + propertyAddress);
    }
  } catch (error) {
    Logger.log("Error in monitorInbox: " + error.toString());
  }
}

/**
 * Helper: Regular Expression Field Parser
 */
function parseField(text, regex) {
  var match = text.match(regex);
  return match && match[1] ? match[1].trim() : null;
}

/**
 * Helper: Find or create Google Drive Folder
 */
function getOrCreateDriveFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

/**
 * Helper: Clone Service Agreement Template into new folder
 */
function cloneServiceAgreement(projectFolder, propertyAddress) {
  var templates = DriveApp.getFilesByName(SERVICE_AGREEMENT_TEMPLATE_NAME);
  var templateFile;
  
  if (templates.hasNext()) {
    templateFile = templates.next();
  } else {
    // Create a default placeholder doc if template does not exist
    var doc = DocumentApp.create(SERVICE_AGREEMENT_TEMPLATE_NAME);
    doc.getBody().appendParagraph("FORESIGHT HOME INSPECTIONS, LLC - SERVICE AGREEMENT TEMPLATE\n\n[Please paste your InterNACHI Service Agreement content here]");
    doc.saveAndClose();
    templateFile = DriveApp.getFileById(doc.getId());
    Logger.log("Created placeholder Service Agreement Template.");
  }
  
  // Clone template into property folder
  var newFileName = "Service Agreement - " + propertyAddress;
  templateFile.makeCopy(newFileName, projectFolder);
}

/**
 * Helper: Apply processed label to threads
 */
function applyProcessedLabel(thread) {
  var labelName = "Foresight Engine/Processed";
  var label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
  }
  thread.addLabel(label);
}

/**
 * Send booking welcome confirmation email to client
 */
function sendClientWelcomeEmail(clientName, clientEmail, propertyAddress) {
  var subject = "Confirming Your Booking Request - " + propertyAddress;
  
  var htmlBody = 
    "<div style=\"font-family: Arial, sans-serif; max-width: 600px; color: #1f2937; line-height: 1.6;\">" +
      "<div style=\"background-color: #d32f2f; color: white; padding: 1.5rem; text-align: center;\">" +
        "<h2 style=\"margin: 0; font-family: Georgia, serif;\">Foresight Home Inspections</h2>" +
        "<p style=\"margin: 5px 0 0 0; font-style: italic; font-size: 0.95rem;\">\"Because hindsight is expensive... Choose Foresight!\"</p>" +
      "</div>" +
      "<div style=\"padding: 1.5rem;\">" +
        "<p>Well hello <strong>" + clientName + "</strong>,</p>" +
        "<p>I just received your booking notification from our schedule database for the property at <strong>" + propertyAddress + "</strong>. First off, thank you for trusting us with your home! Buying a house is the biggest financial transaction of your life, and I'm glad you chose Foresight to secure your investment.</p>" +
        "<p>I wanted to reach out and let you know that <strong>I am personally reviewing your booking details right now</strong>. As our client, I want you to know we don't treat this like a routine checklist—I'm getting our files organized, setting up your project folder, and preparing our high-tech equipment (our drone cameras and moisture imaging shields) specifically for your home's unique layout.</p>" +
        "<p><strong>Here is what happens next in our system:</strong></p>" +
        
        "<div style=\"background: #f3f4f6; border-left: 4px solid #d32f2f; padding: 1rem; margin: 1.5rem 0;\">" +
          "<ol style=\"margin: 0; padding-left: 1.25rem;\">" +
            "<li style=\"margin-bottom: 0.5rem;\"><strong>Personal Review</strong>: I review the square footage, age, and foundation type of the property to allocate the perfect inspection window.</li>" +
            "<li style=\"margin-bottom: 0.5rem;\"><strong>Agreement Review</strong>: Our office team is preparing your standard Service Agreement. They will reach out to you shortly with signature details to sign.</li>" +
            "<li><strong>Locking the Schedule</strong>: Once the agreement is signed and your security deposit is confirmed, your appointment is fully locked on our master calendar.</li>" +
          "</ol>" +
        "</div>" +
        
        "<p>Please sit tight and keep an eye out for our office team reaching out with your agreement. We'll make sure everything is completely squared away for your inspection!</p>" +
        "<p>Should you have any questions or need to add Radon continuous gas testing, Sewer Scope camera line runs, or Termite WDO reviews to your order, feel free to reply directly to this email or give me a ring at 678-480-2110.</p>" +
        
        "<p style=\"margin-top: 2rem;\">Take care, and remember:</p>" +
        "<p style=\"font-size: 1.1rem; color: #d32f2f; font-weight: bold; font-style: italic;\">\"Because hindsight is expensive... Choose Foresight!\"</p>" +
        "<p>Warmly,</p>" +
        "<p><strong>Christopher Boykin</strong><br />" +
        "Certified Master Inspector®<br />" +
        "Foresight Home Inspections, LLC<br />" +
        "<a href=\"mailto:plsinspectnow@gmail.com\" style=\"color: #1f2937;\">plsinspectnow@gmail.com</a> | 678-480-2110</p>" +
      "</div>" +
    "</div>";
    
  MailApp.sendEmail({
    to: clientEmail,
    subject: subject,
    htmlBody: htmlBody,
    replyTo: BUSINESS_EMAIL
  });
}
