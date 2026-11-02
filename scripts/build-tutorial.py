"""Builds docs/IPMA-KSA-Admin-Tutorial.pdf from docs/tutorial-screens/*.png (run with Playwright's Chromium)."""
import base64, pathlib, subprocess, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
SC = ROOT / "docs/tutorial-screens"
import io
from PIL import Image
NOSIDE = {"t04-event-top.png","t05-event-mid.png","t06-event-save.png","t07-event-saved.png","t09-status.png","t11-home-edit.png","t13-exam-edit.png","t14-journey-top.png","t15-faq-add.png"}
def img(n):
    if n in NOSIDE:
        im0 = Image.open(SC / n); im = im0.crop((256, 0, im0.width, im0.height)); b = io.BytesIO(); im.save(b, "PNG"); return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
    return "data:image/png;base64," + base64.b64encode((SC / n).read_bytes()).decode()
def font(n): return "data:font/woff2;base64," + base64.b64encode((ROOT / "node_modules/@fontsource-variable/cairo/files" / n).read_bytes()).decode()
logo = "data:image/png;base64," + base64.b64encode((ROOT / "public/images/logo.png").read_bytes()).decode()
logow = "data:image/png;base64," + base64.b64encode((ROOT / "public/images/logo-white.png").read_bytes()).decode()

def shot(n, cap): return f'<figure><img src="{img(n)}"><figcaption>{cap}</figcaption></figure>'
def step(num, title, body, extra=""): return f'<div class="step"><div class="num">{num}</div><div class="sb"><h3>{title}</h3>{body}</div></div>{extra}'
def page(inner, cls=""): return f'<section class="page {cls}"><header class="ph"><img src="{logo}"><span>Admin guide</span></header>{inner}<footer>IPMA KSA website · Admin guide · care@ipmaksa.world</footer></section>'

pages = []
pages.append(f'''<section class="page cover"><div class="band"></div><img class="cl" src="{logow}">
<div class="ct"><div class="rule"></div><h1>Website Admin Guide</h1><p class="sub">How to add a webinar in Project Connect<br>and how to edit the sections of the website</p></div>
<div class="cf">IPMA KSA · Content admin · 2026</div></section>''')

pages.append(page('''<h2>Before you start</h2>
<p class="lead">Everything on the public website is edited from one private place, the <b>content admin</b>. You do not need any technical skills.</p>
<div class="cards">
<div class="card"><h4>Where</h4><p>The admin has its own address, separate from the website, for example <b>admin.ipmaksa.world</b>. Your developer gives you the exact link, your email and your password.</p></div>
<div class="card"><h4>Two languages</h4><p>Almost every field has two boxes: <b>Arabic</b> on the left and <b>English</b> on the right. Fill both. If one is empty the website shows the other language instead.</p></div>
<div class="card"><h4>Save = live</h4><p>When you press <b>Save changes</b> the website is updated straight away. There is no publish step.</p></div>
<div class="card"><h4>Delete is permanent</h4><p>Deleting an item removes it from the website. To hide something without losing it, change its status or untick <b>Published</b>.</p></div>
</div>
<h3 class="mt">What you can manage</h3>
<table><tr><th>Menu in the admin</th><th>What it controls on the website</th></tr>
<tr><td>Home page</td><td>The hero, numbers, sections and call-to-action text of the home page</td></tr>
<tr><td>Pages</td><td>About us, certification levels A–D, recertification, privacy and other text pages</td></tr>
<tr><td>Team</td><td>Team cards: photo, role, LinkedIn</td></tr>
<tr><td>Exam dates</td><td>Upcoming and past exams, with status and dates</td></tr>
<tr><td>How certification works</td><td>The 6-stage cycle table, How to prepare, and the FAQ</td></tr>
<tr><td>Project Connect events</td><td>Webinars and workshops, with poster, link and recording</td></tr>
<tr><td>Membership benefits</td><td>The benefits shown on the Membership page</td></tr>
<tr><td>Badges</td><td>The types of badge you can award to members</td></tr>
<tr><td>News</td><td>News articles</td></tr>
<tr><td>Contact &amp; settings</td><td>Email, phone, social links, footer text</td></tr>
<tr><td>Members &amp; badges</td><td>People who created an account, and the badges you award them</td></tr>
<tr><td>Messages</td><td>Messages sent from the Contact form</td></tr></table>'''))

A = []
A.append(page(f'''<div class="part">Part A</div><h2>Add a webinar to Project Connect</h2>
<p class="lead">Follow these 8 steps. It takes about five minutes.</p>
{step(1,"Sign in","<p>Open the admin link, type your <b>email</b> and <b>password</b> and press <b>Sign in</b>. After five wrong attempts the form pauses for a while, so type carefully.</p>")}
{shot("t01-login.png","Admin sign-in page. 1 Email · 2 Password · 3 Sign in.")}'''))
A.append(page(f'''{step(2,"Open “Project Connect events”","<p>In the menu on the left choose <b>Project Connect events</b>. You will see every webinar and workshop already announced.</p>")}
{shot("t02-dashboard.png","The menu on the left lists everything you can edit. 1 Project Connect events.")}
{step(3,"Press “+ Add new”","<p>The button is at the top right of the list. To <b>change</b> an existing session instead, click its row (2).</p>")}
{shot("t03-events-list.png","1 Add new · 2 an existing session. Click it to edit.")}'''))
A.append(page(f'''{step(4,"Name the session","""<p><b>Address / ID</b>: a short English name with dashes, for example <code>project-connect-ep3</code>. It cannot be changed later.<br>
<b>Title</b>: type the Arabic title on the left and the English title on the right.<br>
<b>Type</b>: Webinar, Workshop or Meetup.</p>""")}
{shot("t04-event-top.png","1 Address / ID · 2 Title (Arabic and English) · 3 Type.")}
{step(5,"Add the details","""<p><b>Description</b>, <b>Speaker(s)</b> and <b>Online / location</b> are written in both languages.</p>""")}'''))
A.append(page(f'''{step(6,"Date, time, link and status","""<p><b>Date</b>: pick it from the calendar (4).<br><b>Time</b>: type it as shown, for example <code>7:00 – 8:00 PM (KSA)</code> (5).<br>
<b>Registration link</b>: the Zoom registration link (6).<br>
<b>Status</b> (7): <b>Open for registration</b> shows a Register button · <b>Coming soon</b> shows the session without registration · <b>Finished / closed</b> moves it to <i>Past sessions</i>.</p>""")}
{shot("t05-event-mid.png","4 Date · 5 Time · 6 Registration link · 7 Status.")}
{step(7,"Upload the poster and save","""<p>Press <b>Upload image</b> (8) and choose the poster (JPG, PNG or WebP, up to 5 MB). Then press <b>Save changes</b> (9). The green message <i>“Saved. The website is updated.”</i> confirms it.</p>""")}'''))
A.append(page(f'''{shot("t06-event-save.png","8 Upload image · 9 Save changes.")}
{shot("t07-event-saved.png","After saving, the address changes and the confirmation appears at the bottom.")}'''))
A.append(page(f'''{step(8,"Check it on the website","""<p>Open the website and go to <b>Project Connect</b>. The new session appears under <b>Upcoming</b> in both Arabic and English.</p>""")}
{shot("t08-public.png","The new webinar on the public Project Connect page, with its Register button.")}
<h3 class="mt">After the session</h3>
{step("✓","Close it and add the recording","""<p>Open the session again, set <b>Status</b> to <b>Finished / closed</b> (1) and paste the YouTube or Zoom link in <b>Recording link</b>. It moves to <b>Past sessions</b> with a “Watch recording” link.</p>""")}
{shot("t09-status.png","1 Status. Set it to Finished / closed after the event.")}'''))
pages += A

pages.append(page('''<h3>Field guide: Project Connect session</h3>
<table><tr><th>Field</th><th>What to write</th><th>Required</th></tr>
<tr><td>Address / ID</td><td>English letters, numbers and dashes. Used internally. Cannot change later.</td><td>Yes</td></tr>
<tr><td>Title</td><td>Arabic and English</td><td>Yes</td></tr>
<tr><td>Type</td><td>Webinar, Workshop or Meetup</td><td>Yes</td></tr>
<tr><td>Description</td><td>2–4 lines in Arabic and English</td><td>Recommended</td></tr>
<tr><td>Date</td><td>Choose from the calendar. Sessions are sorted by date.</td><td>Yes</td></tr>
<tr><td>Time</td><td>Free text, include “(KSA)”</td><td>Recommended</td></tr>
<tr><td>Online / location</td><td>For example “On Zoom” or the venue</td><td>Optional</td></tr>
<tr><td>Speaker(s)</td><td>Names and roles</td><td>Optional</td></tr>
<tr><td>Image</td><td>The poster. Landscape or square works best.</td><td>Recommended</td></tr>
<tr><td>Registration link</td><td>Full address starting with https://</td><td>For “Open”</td></tr>
<tr><td>Status</td><td>Open · Coming soon · Finished</td><td>Yes</td></tr>
<tr><td>Recording link</td><td>Add after the session</td><td>Optional</td></tr></table>
<div class="tip"><b>Tip:</b> for a series, copy the pattern in the address: <code>project-connect-ep3</code>, <code>project-connect-ep4</code>… and keep the same title wording so people recognise it.</div>
<div class="tip warn"><b>Check before saving:</b> the registration link must start with <code>https://</code>. A link that does not will be removed for safety.</div>'''))

B = []
B.append(page(f'''<div class="part">Part B</div><h2>Edit the sections of the website</h2>
<p class="lead">Every section follows the same pattern: <b>choose it in the menu → change the text → Save changes</b>.</p>
{shot("t10-sidebar.png","The menu. 1 Home page · 2 Exam dates · 3 Pages. Each entry opens the matching part of the website.")}
<div class="tip"><b>Which menu edits which page?</b> Home page → the home page. Pages → every text page such as About us and the certification levels. Exam dates → the Exam dates page and the home page cards. How certification works → the cycle table, preparation and FAQ on the home page and on its own page.</div>'''))
B.append(page(f'''<h3>Example 1: change the home page title</h3>
{step(1,"Open Home page","<p>Choose <b>Home page</b> in the menu. The form lists the sections from top to bottom.</p>")}
{step(2,"Edit the text","<p>Change the Arabic (1) and English (2) boxes for <b>Hero – title</b>. Statistics, benefits and other blocks are lower on the same page. Use <b>↑ ↓</b> to reorder items and <b>Remove</b> to delete one.</p>")}
{shot("t11-home-edit.png","1 Arabic and English hero text, 2 the English box.")}
{step(3,"Save changes","<p>Press <b>Save changes</b> at the bottom. Refresh the website to see it.</p>")}'''))
B.append(page(f'''<h3>Example 2: update an exam date</h3>
{step(1,"Open Exam dates","<p>Choose <b>Exam dates</b>. Click the exam you want to change.</p>")}
{shot("t12-exams-list.png","All exams, newest first.")}
{step(2,"Change the date and status","<p>Pick the new <b>Date</b> (1) and set the <b>Status</b> (2): <b>Open</b> while registration is open, <b>Closed</b> when finished. Press <b>Save changes</b>.</p>")}
{shot("t13-exam-edit.png","1 Date · 2 Status.")}'''))
B.append(page(f'''<h3>Example 3: add a frequently asked question</h3>
{step(1,"Open “How certification works”","<p>This menu holds the 6-stage cycle table, the <b>How to prepare</b> text and the <b>FAQ</b>. The first part of the form is the cycle: stages are the columns, roles are the rows, and each role has one action per stage. Leave an action empty if that role is not involved.</p>")}
{shot("t14-journey-top.png","The cycle table editor: titles, then Stage 1, Stage 2…")}
{step(2,"Add the question","<p>Scroll to <b>Frequently asked questions</b> and press <b>+ Add question</b> (1). Write the question and the answer in Arabic and English. The first 4 questions appear on the home page, all of them on the full page.</p>")}
{shot("t15-faq-add.png","1 Add question. Use ↑ ↓ to put the most common questions first.")}'''))
B.append(page(f'''<h3>Example 4: team members</h3>
<p>Open <b>Team</b>, click a person to change the photo, role and LinkedIn link, or press <b>+ Add new</b>. The first five people appear on the home page; the order follows the <b>Order</b> number.</p>
{shot("t16-team.png","The team list.")}
<h3 class="mt">Example 5: members and badges</h3>
<p>People who register on the website appear under <b>Members &amp; badges</b>. Press <b>Manage</b> beside a person, tick the badge (for example <b>Membership</b>), add an optional note and press <b>Save badges</b>. The badge appears on their profile page immediately.</p>
{shot("t17-members.png","Registered members and the Manage link.")}'''))
pages += B

pages.append(page('''<h2>Quick reference</h2>
<div class="cards">
<div class="card"><h4>Add something</h4><p>Menu → the section → <b>+ Add new</b> → fill both languages → <b>Save changes</b>.</p></div>
<div class="card"><h4>Change something</h4><p>Menu → the section → click the item → edit → <b>Save changes</b>.</p></div>
<div class="card"><h4>Hide something</h4><p>Set the status to Closed, or untick <b>Published</b>, then save. It stays in the admin.</p></div>
<div class="card"><h4>Remove something</h4><p>Open the item → <b>Delete</b> → confirm. This cannot be undone.</p></div>
</div>
<h3 class="mt">Good to know</h3>
<ul>
<li><b>Images:</b> JPG, PNG or WebP. Use posters and photos under 2 MB for a fast website.</li>
<li><b>Text formatting:</b> long text boxes accept <code>## Heading</code>, <code>- bullet</code> and <code>**bold**</code>.</li>
<li><b>Order:</b> use the <b>↑ ↓</b> arrows inside lists, or the <b>Order</b> number on team members.</li>
<li><b>Contact messages:</b> read and answer them under <b>Messages</b>. Mark them as read when done.</li>
<li><b>Signing out:</b> use <b>Sign out</b> at the bottom of the menu, especially on a shared computer.</li>
</ul>
<h3 class="mt">If something looks wrong</h3>
<table><tr><th>Problem</th><th>What to do</th></tr>
<tr><td>I saved but the website did not change</td><td>Refresh the page. Check the item status (Closed and unpublished items are hidden or moved).</td></tr>
<tr><td>A new page or news item gives “not found”</td><td>Tick <b>Published</b> and save.</td></tr>
<tr><td>The registration button is missing</td><td>Status must be <b>Open</b> and the link must start with https://</td></tr>
<tr><td>I cannot sign in</td><td>Check the email spelling. After repeated wrong attempts wait 15 minutes. Ask your developer to reset the password.</td></tr>
<tr><td>The image did not upload</td><td>Use JPG, PNG or WebP under 5 MB.</td></tr></table>'''))

CSS = f'''
@font-face{{font-family:Cairo;src:url({font("cairo-latin-wght-normal.woff2")});font-weight:200 1000;unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF,U+2713}}
@font-face{{font-family:Cairo;src:url({font("cairo-arabic-wght-normal.woff2")});font-weight:200 1000;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}}
@page{{size:A4;margin:0}}
:root{{--g9:#10332a;--g8:#17493c;--g7:#1f5a49;--g1:#dbe9e1;--g0:#eef3ef;--gold:#bf9e5f;--gold6:#86692a;--ink:#1d2b26;--cream:#f8f9f7}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:Cairo,sans-serif;color:var(--ink);font-size:10.4pt;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.page{{width:210mm;height:297mm;padding:0 16mm 14mm;position:relative;page-break-after:always;overflow:hidden;background:var(--cream)}}
.ph{{display:flex;justify-content:space-between;align-items:center;height:20mm;margin:0 -16mm 6mm;padding:0 16mm;background:var(--g9);border-bottom:2mm solid transparent;border-image:repeating-linear-gradient(135deg,var(--gold) 0 2mm,transparent 2mm 4mm) 1}}
.ph img{{height:9mm;filter:brightness(0) invert(1)}}
.ph span{{color:#fff;font-weight:700;font-size:9pt;letter-spacing:.08em;text-transform:uppercase;opacity:.85}}
footer{{position:absolute;bottom:6mm;left:16mm;right:16mm;font-size:8pt;color:#6b7a73;border-top:1px solid var(--g1);padding-top:2mm}}
h2{{font-size:20pt;font-weight:800;color:var(--g9);line-height:1.2;margin-bottom:2mm}}
h2::before{{content:"";display:block;width:14mm;height:1.2mm;background:var(--gold);border-radius:2px;margin-bottom:3mm}}
h3{{font-size:12.5pt;font-weight:800;color:var(--g9);margin-bottom:1.5mm}}
h3.mt{{margin-top:5mm}}
h4{{font-size:10.5pt;font-weight:800;color:var(--g7);margin-bottom:1mm}}
.lead{{font-size:11.5pt;color:#3d4d46;margin-bottom:4mm}}
.part{{display:inline-block;background:var(--gold);color:var(--g9);font-weight:800;font-size:9pt;padding:.6mm 3mm;border-radius:99px;margin-bottom:2mm;text-transform:uppercase;letter-spacing:.08em}}
.step{{display:flex;gap:3.5mm;margin:3mm 0 2mm}}
.num{{flex:none;width:9mm;height:9mm;border-radius:50%;background:var(--g7);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:11pt}}
.sb p{{margin-top:.5mm}}
figure{{width:86%;margin:2mm auto 3mm;border-radius:3mm;overflow:hidden;border:1px solid var(--g1);box-shadow:0 1.5mm 4mm #10332a22;background:#fff}}
figure img{{display:block;width:100%}}
figcaption{{font-size:8.5pt;color:#5c6b64;padding:1.5mm 3mm;background:var(--g0)}}
.cards{{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:3mm 0}}
.card{{background:#fff;border:1px solid var(--g1);border-inline-start:1.3mm solid var(--gold);border-radius:2.5mm;padding:3mm 4mm}}
table{{width:100%;border-collapse:collapse;margin:2mm 0;font-size:9.4pt}}
th{{background:var(--g9);color:#fff;text-align:start;padding:1.8mm 3mm;font-weight:700}}
td{{padding:1.6mm 3mm;border-bottom:1px solid var(--g1);vertical-align:top;background:#fff}}
tr:nth-child(even) td{{background:var(--g0)}}
code{{background:var(--g0);border:1px solid var(--g1);border-radius:1mm;padding:0 1.2mm;font-size:9pt}}
ul{{margin:1mm 0 0 5mm}} li{{margin:.8mm 0}}
.tip{{background:#f6efdc;border-inline-start:1.3mm solid var(--gold);border-radius:2mm;padding:2.5mm 4mm;margin:3mm 0;font-size:9.8pt}}
.tip.warn{{background:#fbe9e6;border-color:#c8372d}}
.cover{{background:var(--g9);color:#fff;padding:0}}
.cover .band{{position:absolute;top:0;left:0;right:0;height:14mm;background:repeating-linear-gradient(135deg,var(--gold) 0 3mm,transparent 3mm 6mm);opacity:.6}}
.cover .cl{{position:absolute;top:40mm;left:20mm;height:22mm}}
.cover .ct{{position:absolute;top:110mm;left:20mm;right:20mm}}
.cover .rule{{width:24mm;height:2mm;background:var(--gold);border-radius:2px;margin-bottom:8mm}}
.cover h1{{font-size:38pt;line-height:1.1;font-weight:900}}
.cover .sub{{margin-top:8mm;font-size:15pt;color:#e7efe9;font-weight:500}}
.cover .cf{{position:absolute;bottom:18mm;left:20mm;font-size:10pt;letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}}
'''
html = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(pages)}</body></html>'
out_html = ROOT / "docs/.tutorial.html"; out_html.write_text(html)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); pg.goto(out_html.as_uri()); pg.wait_for_timeout(800)
    pg.pdf(path=str(ROOT / "docs/IPMA-KSA-Admin-Tutorial.pdf"), prefer_css_page_size=True, print_background=True); b.close()
out_html.unlink()
print("ok")
