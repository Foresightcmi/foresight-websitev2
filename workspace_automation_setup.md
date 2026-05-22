# Foresight Business Engine: Workspace Automation Setup Guide

This guide provides simple, step-by-step instructions to deploy the Google Apps Script engine and connect your Next.js website lead-capture form directly to your Google Workspace account (`inspect@foresightcmi.com`).

---

## 🛠️ Step 1: Set Up the Leads Spreadsheet

1. Log into your Google Workspace account (`inspect@foresightcmi.com`).
2. Go to [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
3. Name the spreadsheet exactly: **`Foresight_Engine_Leads`**.
4. Inside this spreadsheet, rename the active sheet tab at the bottom to **`Leads`**.
5. *Note: The automated script will initialize all headers and cell formats for you on its first run.*

---

## 💻 Step 2: Create the Apps Script Project

1. While inside your new `Foresight_Engine_Leads` spreadsheet, click on **Extensions** in the top menu bar, then select **Apps Script**.
2. A new code editor window will open. Delete any placeholder code (like `function myFunction() {}`) currently visible in the editor.
3. Open the file [ForesightBusinessEngine.gs](file:///C:/Users/fores/.gemini/antigravity/scratch/foresight-website/scripts/ForesightBusinessEngine.gs) in your local code environment.
4. Copy the entire contents of `ForesightBusinessEngine.gs` and paste it into the Apps Script editor.
5. Click the **Save icon (disk)** at the top of the Apps Script editor or press `Ctrl + S`.
6. Name the Apps Script project: **`Foresight Autonomous Engine`**.

---

## 🚀 Step 3: Deploy the Script as a Web Service (Webhook)

To allow the website to forward Captured leads to your spreadsheet and trigger emails, we must deploy the script as a Web App:

1. In the top-right corner of the Apps Script page, click the blue **Deploy** button and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the configuration details exactly as follows:
   - **Description**: `Foresight Lead Webhook V1`
   - **Execute as**: **`Me (inspect@foresightcmi.com)`** *(Crucial: This ensures all emails send from your Workspace inbox!)*
   - **Who has access**: **`Anyone`** *(Crucial: This allows the secure Next.js server route to submit lead data without OAuth popups.)*
4. Click **Deploy**.
5. **Authorize Access**: Google will ask you to authorize permissions. Click **Authorize access**, select your `inspect@foresightcmi.com` account, click **Advanced**, then click **Go to Foresight Autonomous Engine (unsafe)**, and click **Allow**.
6. **Save the Web App URL**: Copy the generated **Web App URL** from the screen. It will look like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## 🔒 Step 4: Link Your Website to Your Webhook

Now you must configure your Next.js server to talk to the new Apps Script URL:

1. Open the `.env.local` file in the root of your Next.js project directory:
   [foresight-website/.env.local](file:///C:/Users/fores/.gemini/antigravity/scratch/foresight-website/.env.local)
2. Add a new line at the bottom, pasting the URL you copied in the previous step:
   ```env
   APPS_SCRIPT_WEBHOOK_URL=your_copied_web_app_url_here
   ```
3. Save the file.
4. When you deploy the website to production (Vercel, AWS, etc.), make sure to add this environment variable `APPS_SCRIPT_WEBHOOK_URL` in your hosting dashboard under Environment Variables!

---

## ⏰ Step 5: Set Up Time-Driven Triggers (Cron Jobs)

We need Google to run our background jobs automatically (monitoring your inbox for bookings and sending email nurtures on Days 2 & 3).

1. In the left panel of the Google Apps Script editor, click on the **alarm clock icon** (Triggers).
2. Click the **+ Add Trigger** button in the bottom-right corner.

### Trigger A: Inbox Monitor (HomeGauge Bookings)
Configure the trigger exactly as follows:
- **Choose which function to run**: `monitorInbox`
- **Choose which deployment to run**: `Head`
- **Select event source**: `Time-driven`
- **Select type of time based trigger**: `Minutes timer`
- **Select minute interval**: `10 minutes` (runs every 10 minutes)
- Click **Save**.

### Trigger B: Daily Nurture Emails (Part 2 & Part 3)
Click **+ Add Trigger** again and configure:
- **Choose which function to run**: `sendNurtureEmails`
- **Choose which deployment to run**: `Head`
- **Select event source**: `Time-driven`
- **Select type of time based trigger**: `Day timer`
- **Select time of day**: `8 AM to 9 AM` (or your preferred morning window)
- Click **Save**.

---

## 📂 Step 6: Create Your Drive Agreement Template

To ensure the HomeGauge booking automation clones your inspection agreement automatically:

1. Go to [Google Drive](https://drive.google.com) using your `inspect@foresightcmi.com` account.
2. In the root directory, create a folder named exactly: **`Active Inspections`**.
3. Inside your Drive, create a new **Google Doc** named exactly: **`Service Agreement Template`**.
4. Open this document and paste your default InterNACHI / Foresight Service Agreement text inside.
5. *Whenever a new booking notification lands in your inbox, the engine will automatically parse the client details, create a project sub-folder inside `/Active Inspections/`, clone your template into it, rename it to `"Service Agreement - [Property Address]"`, and send the warm welcome confirmation email!*

---

> [!TIP]
> **Testing Your Setup**:
> You can test the leads database by opening the chat widget on the website, asking a question (e.g. *"What is radon?"*), clicking **Yes, send it!**, and filling in the contact form. 
> 
> Open your `Foresight_Engine_Leads` Google Sheet—the new lead will instantly appear as a row with status `LEAD_CAPTURED` and Part 1 of the checklist will arrive in the inbox you specified!
