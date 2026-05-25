# ⚡ Foresight Business Engine: Streamlined Setup Guide

This guide details how to deploy your Google Workspace automation suite using our **One-Click Script Initialization**. This processes all background trigger creation, Google Drive directory setups, and templates in seconds.

---

## 📋 Step 1: Create a Blank Google Sheet

Since our script is fully automated, it will programmatically build all database tabs, column headers, and color styles for you. All you need is a blank sheet:

1. Log into your Google Workspace account (**`inspect@foresightcmi.com`**).
2. Go to your browser address bar and type **`sheet.new`** (or go to Google Drive and create a new blank Google Sheet).
3. Name your new spreadsheet exactly: **`Foresight_Engine_Leads`**.

---

## ⚡ Step 2: One-Click Initialization

Run our automated setup function once to configure your database tabs, folders, template agreement, and triggers programmatically:

1. Inside your new spreadsheet, click on **Extensions** in the top menu bar, then select **Apps Script**.
2. Erase any placeholder code that is currently in the editor.
3. Open the file **`scripts/ForesightBusinessEngine.gs`** in your website project folder, copy its entire contents, and paste it into the Apps Script editor.
4. Click the **💾 Save** icon (or press `Ctrl + S`).
5. In the toolbar at the top of the editor, select **`initialSetup`** from the function dropdown.
6. Click the **▷ Run** button.
7. **Authorize Permissions**: Google will ask you to authorize access.
   - Click **Review permissions**.
   - Select your `inspect@foresightcmi.com` account.
   - Click **Advanced** (in small text).
   - Click **Go to Foresight Autonomous Engine (unsafe)**.
   - Click **Allow**.
8. Once the script finishes, check the **Execution log** at the bottom. It will confirm that:
   - A new **`Leads`** tab was created in your sheet, formatted with bold red headers!
   - The `/Active Inspections/` folder was successfully created in your Google Drive.
   - The `/Service Agreement Template` Google Doc was placed in your Drive.
   - The 10-minute inbox scanner trigger was scheduled.
   - The daily morning email nurture trigger was scheduled.

---

## 🚀 Step 3: Deploy the Web App (Webhook)

To allow the website to forward Captured leads to your spreadsheet, you must publish the script as a secure Web App:

1. In the top-right corner of the Apps Script editor, click **Deploy** and select **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure the settings exactly as follows:
   - **Description**: `Foresight Lead Webhook V2`
   - **Execute as**: **`Me (inspect@foresightcmi.com)`** *(Ensures emails send from your Workspace inbox!)*
   - **Who has access**: **`Anyone`** *(Allows the Next.js server to securely submit lead details.)*
4. Click **Deploy**.
5. Copy the generated **Web App URL** from the screen. It will look like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## 🔒 Step 4: Link Your Website to Your Webhook

1. Open your website's local environment file:
   👉 [foresight-website/.env.local](file:///C:/Users/fores/.gemini/antigravity/scratch/foresight-website/.env.local)
2. Add the copied Apps Script URL to the bottom:
   ```env
   APPS_SCRIPT_WEBHOOK_URL=your_copied_web_app_url_here
   ```
3. Save the file. *(Note: When deploying the website to production hosting, remember to add this as an environment variable in your dashboard!)*

---

> [!TIP]
> **Testing Your Setup**:
> Open the chat widget on the website, ask a question, click **Yes, send it!**, and fill out the contact form. 
> 
> Open your `Foresight_Engine_Leads` Google Sheet—the lead will immediately appear on the **Leads** tab with status `LEAD_CAPTURED`, and Part 1 of the checklist will arrive in your email inbox!
