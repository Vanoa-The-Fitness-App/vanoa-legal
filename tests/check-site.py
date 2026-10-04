#!/usr/bin/env python3
"""Dependency-free static acceptance checks for the unpublished legal site."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'privacy.html', 'terms.html', 'delete-account.html']
# Pages approved for publication. Must match the app's lib/consent.ts TERMS_VERSION and PRIVACY_VERSION (2026-10-04).
PUBLISHED = {'index.html', 'privacy.html', 'terms.html', 'delete-account.html'}
LEGACY = {
    'privacy.html': 'toc infocollect healthconnect infouse legalbases whoshare ai intltransfers inforetain infosafe infominors privacyrights DNT uslaws policyupdates contact request'.split(),
    'terms.html': 'agreement services ip userreps userreg purchases subscriptions software prohibited ugc license reviews mobile sitemanage ppno terms modifications law disputes corrections disclaimer liability indemnification userdata electronic california misc contact'.split(),
}

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.ids, self.urls, self.tags, self.data, self.metas = [], [], [], [], {}
        self.language = None
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append(tag)
        if tag == 'html': self.language = attrs.get('lang')
        if 'id' in attrs: self.ids.append(attrs['id'])
        for attr in ['href', 'src']:
            if attr in attrs: self.urls.append((tag, attr, attrs[attr]))
        if tag == 'meta': self.metas[attrs.get('name')] = attrs.get('content')
    def handle_data(self, data): self.data.append(data)

pages = {name: Page((ROOT/name).read_text()) for name in PAGES}
errors = []
checked_links = 0
for name, page in pages.items():
    source = (ROOT/name).read_text()
    text = ' '.join(page.data)
    if page.language != 'en': errors.append(f'{name}: missing language')
    if page.tags.count('h1') != 1: errors.append(f'{name}: needs one h1')
    if page.tags.count('main') != 1: errors.append(f'{name}: needs one main')
    if 'script' in page.tags or 'iframe' in page.tags or 'form' in page.tags: errors.append(f'{name}: unexpected script/embed/form')
    for id, count in Counter(page.ids).items():
        if count != 1: errors.append(f'{name}: duplicate ID {id}')
    for id in LEGACY.get(name, []):
        if id not in page.ids: errors.append(f'{name}: missing preserved anchor {id}')
    if 'class="draft-banner"' in source or 'Unpublished review draft · not yet in effect' in text:
        errors.append(f'{name}: removed review banner has returned')
    if name in PUBLISHED:
        # Published documents carry an effective date and no draft wording.
        if 'Unpublished review draft' in text or 'not yet in effect' in text: errors.append(f'{name}: published page still shows draft status')
        if 'Effective date: 4 October 2026' not in text: errors.append(f'{name}: missing effective date')
        if page.metas.get('version') != '2026-10-04': errors.append(f'{name}: inconsistent version')
        if page.metas.get('robots'): errors.append(f'{name}: published page must not be noindex')
    else:
        if 'Review version' not in text or 'Not an effective policy date' not in text:
            errors.append(f'{name}: review version disclosure missing')
        if page.metas.get('version') != 'review-2026-10-04': errors.append(f'{name}: inconsistent version')
    for needle in ['[[', '{{', '[Developer/Company name]', 'Vanoa Pro', 'Vanoa LLC', 'Vanoa Inc', 'Vanoa Ltd', 'Google-approved', 'Apple-approved']:
        if needle in source: errors.append(f'{name}: forbidden placeholder/claim {needle}')
    for tag, attr, url in page.urls:
        parts = urlsplit(url)
        if parts.scheme:
            if parts.scheme not in ['https', 'mailto']: errors.append(f'{name}: unexpected scheme {url}')
            if attr == 'src': errors.append(f'{name}: remote asset {url}')
            if parts.scheme == 'mailto' and parts.path != 'support@vanoa.app': errors.append(f'{name}: inconsistent contact')
            continue
        target = parts.path.lstrip('/') or name
        file = (ROOT/unquote(target)).resolve()
        if not file.is_relative_to(ROOT) or not file.is_file(): errors.append(f'{name}: missing/unsafe local target {url}')
        if parts.fragment and target in pages and unquote(parts.fragment) not in pages[target].ids: errors.append(f'{name}: missing fragment {url}')
        checked_links += 1
    for target in PAGES[1:]:
        if not any(url == target for _, _, url in page.urls): errors.append(f'{name}: missing legal link {target}')

if (ROOT/'CNAME').read_text().strip() != 'vanoa.app': errors.append('CNAME changed')
css = (ROOT/'assets/site.css').read_text()
if '@media print' not in css or ':focus-visible' not in css or 'prefers-color-scheme:dark' not in css: errors.append('Missing print/focus/dark styles')
for font in re.findall(r'url\("([^\"]+)"\)', css):
    if not (ROOT/'assets'/font).is_file(): errors.append(f'Missing CSS asset {font}')
config = (ROOT/'_config.yml').read_text()
for name in ['DATA_SAFETY_NOTES.md','APPLE_PRIVACY_NOTES.md','HEALTH_CONNECT_NOTES.md','README.md','tests','CLAUDE.md']:
    if f'  - {name}' not in config: errors.append(f'Notes/test serving exclusion missing: {name}')
result = {'pages':len(pages),'local_links_checked':checked_links,'legacy_anchors_checked':sum(map(len,LEGACY.values())),'errors':errors}
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
