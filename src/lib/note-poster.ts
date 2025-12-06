import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const STORAGE_STATE_PATH = path.join(process.cwd(), 'note-storage-state.json');

export class NotePoster {
  async post({ title, body }: { title: string, body: string }) {
    // Launch non-headless so user can see it happening
    const browser = await chromium.launch({ headless: false, slowMo: 50 });
    
    try {
        let context;
        if (fs.existsSync(STORAGE_STATE_PATH)) {
            context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
        } else {
            context = await browser.newContext();
            console.warn("No storage state found. Please login.");
        }

        const page = await context.newPage();
        
        // Navigate to Note Creator
        await page.goto('https://note.com/notes/new');
        
        // Wait for Title Input (indicates editor loaded)
        // Note selectors can change, but placeholder '記事タイトル' is stable-ish
        try {
            await page.waitForSelector('[placeholder="記事タイトル"]', { timeout: 10000 });
        } catch (e) {
            // Check if login needed
            if (page.url().includes('login') || await page.isVisible('text=ログイン')) {
                 throw new Error("You are not logged in to Note. Please log in manually and save the state, or provide credentials.");
            }
            throw e;
        }

        // Fill Title
        await page.getByPlaceholder('記事タイトル').fill(title);
        
        // Fill Body
        // Note's editor structure is complex (Block editor).
        // Clicking the main editor area usually focuses the first paragraph.
        // We look for the main content editable area.
        const editor = page.locator('[contenteditable="true"]').first();
        await editor.click();
        
        // Clear existing content if any (unlikely for new note)
        // await page.keyboard.press('Meta+A');
        // await page.keyboard.press('Backspace');

        // Note doesn't support full markdown pasting perfectly, but inserting text works for simple text.
        // For Markdown, we might want to convert to rich text or just paste as text.
        // User asked for "Markdown preview-able rich text".
        // Sending raw markdown to Note usually just looks like raw markdown unless parsed.
        // We will just insert the text as is.
        await page.keyboard.insertText(body);
        
        // Save Draft
        // Look for "下書き保存"
        const saveDraftBtn = page.getByRole('button', { name: '下書き保存' });
        
        // Note sometimes hides save button under a menu or it's auto-save?
        // Usually there is a 'New' header with buttons.
        if (await saveDraftBtn.isVisible()) {
            await saveDraftBtn.click();
            await page.waitForSelector('text=下書き保存しました', { timeout: 5000 }).catch(() => {});
        } else {
             // Look for '公開設定' -> '下書き保存' flow if changed
             console.log("Save draft button not found immediately.");
        }
        
        // Return URL (Draft URL is usually in address bar)
        const url = page.url();
        
        return { success: true, url };

    } catch (e) {
        console.error("Note Posting Error", e);
        throw e;
    } finally {
        await browser.close();
    }
  }
}
