/* Optional browser/HTML checks. Install QA tools outside the served site; see README. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const qa = process.env.QA_NODE_MODULES;
if (!qa || !process.env.CHROMIUM_PATH || !process.env.QA_OUT_DIR) throw new Error('Set QA_NODE_MODULES, CHROMIUM_PATH and QA_OUT_DIR (outside the repo)');
const requireQA = createRequire(path.join(qa, '../package.json'));
const { chromium } = requireQA('playwright');
const { HtmlValidate } = requireQA('html-validate');
const axePath = requireQA.resolve('axe-core/axe.min.js');
const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const output = path.resolve(process.env.QA_OUT_DIR);
assert(!output.startsWith(root + path.sep), 'Keep screenshots and evidence outside public repository');
fs.mkdirSync(output, { recursive: true });
const pages = ['index.html', 'privacy.html', 'terms.html', 'delete-account.html'];
const report = { html: [], browser: [], navigation: [], print: [], serving: [], failures: [] };

(async () => {
  const validator = new HtmlValidate({ extends: ['html-validate:recommended'], rules: { 'no-inline-style': 'error' } });
  for (const file of pages) {
    const result = await validator.validateFile(path.join(root, file));
    const messages = result.results.flatMap(r => r.messages.map(m => ({ rule: m.ruleId, line: m.line, message: m.message })));
    report.html.push({ file, valid: result.valid, messages });
    if (!result.valid) report.failures.push(`HTML: ${file}`);
  }
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });
  try {
    for (const theme of ['light', 'dark']) {
      for (const width of [320, 390, 768, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 844 }, colorScheme: theme, javaScriptEnabled: false, serviceWorkers: 'block' });
        const page = await context.newPage();
        for (const file of pages) {
          const requests = [], errors = [], badResponses = [];
          const onRequest = req => { if (new URL(req.url()).origin !== new URL(base).origin) requests.push(req.url()); };
          const onError = error => errors.push(error.message);
          const onConsole = message => { if (message.type() === 'error') errors.push(message.text()); };
          const onFailed = request => errors.push(`Request failed: ${request.url()}`);
          const onResponse = response => { if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() }); };
          page.on('request', onRequest); page.on('pageerror', onError); page.on('console', onConsole); page.on('requestfailed', onFailed); page.on('response', onResponse);
          const response = await page.goto(`${base}/${file}`, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          const observation = await page.evaluate(() => ({
            title: document.title,
            textLength: document.querySelector('main').innerText.length,
            overflow: document.documentElement.scrollWidth > innerWidth,
            missingImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
            loadedFonts: [...document.fonts].map(f => ({ family: f.family, status: f.status })),
            cardsAboveFold: [...document.querySelectorAll('.legal-card')].every(el => el.getBoundingClientRect().bottom <= innerHeight),
            thirdPartyElements: document.querySelectorAll('script, iframe, embed').length
          }));
          const row = { file, theme, width, status: response.status(), ...observation, thirdPartyRequests: requests, errors, badResponses };
          report.browser.push(row);
          if (response.status() !== 200 || observation.textLength < 500 || observation.overflow || observation.missingImages.length || requests.length || errors.length || badResponses.length || observation.thirdPartyElements) report.failures.push(`Browser: ${file} ${theme} ${width}`);
          if (file === 'index.html' && !observation.cardsAboveFold) report.failures.push(`Homepage links below fold: ${theme} ${width}`);
          if ((width === 390 && theme === 'light') || (width === 1440 && theme === 'dark')) {
            await page.screenshot({ path: path.join(output, `${file.replace('.html', '')}-${theme}-${width}.png`), fullPage: file !== 'privacy.html' });
          }
          page.off('request', onRequest); page.off('pageerror', onError); page.off('console', onConsole); page.off('requestfailed', onFailed); page.off('response', onResponse);
        }
        await context.close();
      }
    }
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    report.accessibility = [];
    for (const theme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: theme });
      for (const file of pages) {
        await page.goto(`${base}/${file}`, { waitUntil: 'networkidle' });
        await page.addScriptTag({ path: axePath });
        const result = await page.evaluate(async () => {
          const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
          return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), incomplete: r.incomplete.map(v => v.id), passes: r.passes.length };
        });
        report.accessibility.push({ file, theme, ...result });
        if (result.violations.length) report.failures.push(`Axe: ${file} ${theme}`);
      }
    }
    for (const file of pages) {
      await page.goto(`${base}/${file}`);
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => document.activeElement.textContent);
      assert.equal(first, 'Skip to content');
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
      report.navigation.push({ file, skipLink: 'passed' });
      for (const target of pages.slice(1)) {
        await page.locator(`.header-nav a[href="${target}"]`).click();
        assert.equal(new URL(page.url()).pathname, `/${target}`);
      }
      await page.goto(`${base}/${file}`);
      const expectedTabStops = await page.locator('a[href]').count();
      const visited = new Set();
      for (let i = 0; i < expectedTabStops + 2; i++) {
        await page.keyboard.press('Tab');
        const focus = await page.evaluate(() => ({ index: [...document.querySelectorAll('a[href]')].indexOf(document.activeElement), outline: getComputedStyle(document.activeElement).outlineStyle }));
        if (focus.index >= 0) {
          visited.add(focus.index);
          assert.equal(focus.outline, 'solid', 'Keyboard link focus must be visible');
        }
      }
      assert.equal(visited.size, expectedTabStops, 'Every link must be keyboard reachable');
      report.navigation.push({ file, keyboardLinksReached: visited.size, visibleFocus: 'passed' });
      await page.goto(`${base}/${file}`);
      const anchors = await page.locator('.contents a[href^="#"]').evaluateAll(as => as.map(a => a.getAttribute('href')));
      for (const anchor of anchors) {
        await page.locator(`.contents a[href="${anchor}"]`).click();
        assert.equal(new URL(page.url()).hash, anchor);
      }
      report.navigation.push({ file, anchorsClicked: anchors.length, primaryLinks: 3 });
      await page.emulateMedia({ media: 'print' });
      const printState = await page.evaluate(() => ({ textLength: document.querySelector('main').innerText.length, bodyWidth: document.body.scrollWidth, width: innerWidth, contentsHidden: [...document.querySelectorAll('.contents')].every(x => getComputedStyle(x).display === 'none') }));
      await page.pdf({ path: path.join(output, file.replace('.html', '-print.pdf')), format: 'A4', printBackground: true, preferCSSPageSize: true });
      if (file === 'privacy.html') await page.screenshot({ path: path.join(output, 'privacy-print-layout.png'), fullPage: false });
      report.print.push({ file, ...printState });
      if (!printState.contentsHidden || printState.bodyWidth > printState.width) report.failures.push(`Print: ${file}`);
      await page.emulateMedia({ media: 'screen' });
    }
    for (const file of ['DATA_SAFETY_NOTES.md', 'CLAUDE.md', '.git/config', 'tests/check-site.py']) {
      const response = await page.request.get(`${base}/${file}`);
      report.serving.push({ file, status: response.status() });
      if (response.status() !== 404) report.failures.push(`Private path served: ${file}`);
    }
    await context.close();
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(output, 'validation.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ htmlPages: report.html.length, noJavaScriptRenders: report.browser.length, axeRuns: report.accessibility?.length, printDocuments: report.print.length, failures: report.failures, output }, null, 2));
  process.exitCode = report.failures.length ? 1 : 0;
})().catch(error => { report.failures.push(error.stack); fs.writeFileSync(path.join(output, 'validation.json'), JSON.stringify(report, null, 2)); console.error(error); process.exitCode = 1; });
