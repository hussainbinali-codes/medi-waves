import os
import shutil

BASE_DIR = r"c:\Users\lenovo\OneDrive\Desktop\Invertio Files\Mediwaves\medi-waves\www.medi-waves.com"
TEMPLATE_FILE = os.path.join(BASE_DIR, "defibrillator", "index.html")

# Copy images to 2026/09 for consistency
uploads_2023 = os.path.join(BASE_DIR, "wp-content", "uploads", "2023", "07")
uploads_2026 = os.path.join(BASE_DIR, "wp-content", "uploads", "2026", "09")

shutil.copyfile(
    os.path.join(uploads_2023, "Respiratory1.jpg"),
    os.path.join(uploads_2026, "CPAP-Machine-New.jpg")
)
shutil.copyfile(
    os.path.join(uploads_2023, "Respiratory2.jpg"),
    os.path.join(uploads_2026, "BiPAP-Machine-New.jpg")
)
print("Copied CPAP and BiPAP images to 2026/09")

with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
    template_html = f.read()

def create_product_page(
    folder_name,
    title,
    meta_desc,
    breadcrumb_name,
    heading_title,
    image_rel_path,
    image_alt,
    desc_html,
    specs_rows_html,
    brochure_url=None,
    brochure_label="Download Brochure"
):
    html = template_html

    # Replace title
    html = html.replace("<title>Defibrillator &#8211; Medi Waves Inc</title>", f"<title>{title} &#8211; Medi Waves Inc</title>")
    # Replace meta description
    html = html.replace(
        'content="Medical Biphasic Defibrillator Monitor by Medi Waves Inc — manufacturer and exporter of medical monitoring and resuscitation equipment since 2000. Request a quote or product specifications today."',
        f'content="{meta_desc}"'
    )
    
    # Replace breadcrumbs: Home > Defibrillator -> Home > Respiratory Care Equipments > {breadcrumb_name}
    old_bc = '<span class="current">Defibrillator</span>'
    new_bc = f'<span><a href="/respiratory-care-equipments/"><span itemprop="title">Respiratory Care Equipments</span></a></span> <span class="divider"><span class="bc-devider"></span></span> <span class="current">{breadcrumb_name}</span>'
    html = html.replace(old_bc, new_bc)

    # Replace image
    old_img_block = '''<a href="/wp-content/uploads/2026/09/Defibrillator-New.jpg" class="fancybox">
										<img class="gem-wrapbox-element img-responsive" src="../wp-content/uploads/2026/09/Defibrillator-New.jpg" alt="Defibrillator" loading="lazy">
										<i aria-hidden="true" class="fas fa-camera"></i>				</a>'''
    
    new_img_block = f'''<a href="{image_rel_path}" class="fancybox">
										<img class="gem-wrapbox-element img-responsive" src="..{image_rel_path}" alt="{image_alt}" loading="lazy">
										<i aria-hidden="true" class="fas fa-camera"></i>				</a>'''
    html = html.replace(old_img_block, new_img_block)

    # Replace heading
    html = html.replace(
        '<h2 class="elementor-heading-title elementor-size-default">Biphasic Defibrillator Monitor</h2>',
        f'<h2 class="elementor-heading-title elementor-size-default">{heading_title}</h2>'
    )

    # Replace description block
    old_desc = '''<div class="elementor-text-editor elementor-clearfix">
						<h4>Description</h4><ul><li>Advanced Biphasic technology with impedance compensation.</li><li>Manual Defibrillation, AED mode, Pacer, and multi-parameter monitoring.</li><li>High resolution 7-inch color TFT screen displaying ECG and vital signs.</li><li>Fast charging — delivers 200 Joules in under 5 seconds.</li><li>Integrated adult and pediatric external paddles.</li><li>Built-in thermal strip recorder for printing rhythm strips and events.</li><li>High-capacity rechargeable lithium-ion battery for mobile resuscitation.</li></ul>							</div>'''
    new_desc = f'''<div class="elementor-text-editor elementor-clearfix">
						<h4>Description</h4>{desc_html}							</div>'''
    html = html.replace(old_desc, new_desc)

    # Replace specs table
    old_table_inner = '''<tr><td colspan="2" width="128" height="20"><strong>Features &amp; Functions</strong></td></tr><tr><td height="20">Defibrillator Type</td><td>Manual, Synchronized, Biphasic Truncated Exponential (BTE)</td></tr><tr><td height="20">Energy Selection</td><td>2 to 360 Joules (or 200J biphasic equivalent)</td></tr><tr><td height="20">Charge Time</td><td>&lt;5 seconds to 200J with fully charged battery</td></tr><tr><td height="20">Operating Modes</td><td>Manual, AED, Monitor, Pacing</td></tr><tr><td height="20">Paddles</td><td>External adult paddles with built-in pediatric electrodes</td></tr><tr><td height="20">ECG Monitoring</td><td>3-lead / 5-lead ECG cable with arrhythmia analysis</td></tr><tr><td height="20">Display</td><td>7-inch high resolution color LCD display</td></tr><tr><td height="20">Recorder</td><td>Built-in 50mm high resolution thermal paper recorder</td></tr><tr><td height="20">Power Supply</td><td>AC 100~240V, 50/60Hz; DC 14.8V rechargeable lithium battery</td></tr>'''
    new_table_inner = f'''<tr><td colspan="2" width="128" height="20"><strong>Features &amp; Functions</strong></td></tr>{specs_rows_html}'''
    html = html.replace(old_table_inner, new_table_inner)

    # Brochure button handling
    if brochure_url:
        brochure_btn_html = f'''<div class="gem-button-container gem-widget-button">
		<a class="gem-button gem-button-size-medium gem-button-text-weight-bold gem-button-style-outline gem-button-border-3" href="{brochure_url}" target="_blank" rel="noopener" download>
		<span class="gem-inner-wrapper-btn">
			<span class="gem-button-icon"><i aria-hidden="true" class="fas fa-file-pdf"></i></span>
			<span class="gem-text-button">{brochure_label}</span>
		</span>
	</a>
</div>'''
        # Replace empty button container
        old_btn_container = '''<div class="gem-button-container gem-widget-button">

		

	
</div>'''
        html = html.replace(old_btn_container, brochure_btn_html)

    target_dir = os.path.join(BASE_DIR, folder_name)
    os.makedirs(target_dir, exist_ok=True)
    target_file = os.path.join(target_dir, "index.html")
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Created {target_file}")

# 1. HFNC Machine
create_product_page(
    folder_name="hfnc-machine",
    title="HFNC Machine",
    meta_desc="High Flow Nasal Cannula (HFNC) Machine by Medi Waves Inc — heated and humidified oxygen therapy system for adult and pediatric respiratory care. Request a quote today.",
    breadcrumb_name="HFNC Machine",
    heading_title="High Flow Nasal Cannula (HFNC) Machine",
    image_rel_path="/wp-content/uploads/2026/09/HFNC-Machine-New.jpg",
    image_alt="HFNC Machine",
    desc_html="""<ul>
<li>Advanced high-flow heated humidified oxygen therapy system for non-invasive respiratory support in ICUs, emergency rooms, and respiratory care units.</li>
<li>Broad flow delivery from 2 to 80 L/min catering to adult, pediatric, and neonatal therapeutic requirements.</li>
<li>Integrated electronic air/oxygen blender providing precision FiO2 titration between 21% and 100%.</li>
<li>Active servo-controlled heated humidification chamber and heated breathing circuit to eliminate rainout condensation.</li>
<li>Vibrant 7-inch digital color touchscreen displaying continuous flow rate, temperature, FiO2, and airway pressure metrics.</li>
<li>Comprehensive audible and visual multi-tier alarm system ensuring patient safety against flow obstruction, circuit leak, or temperature deviation.</li>
<li>Heavy-duty mobile medical trolley with whisper-quiet lockable casters, accessory basket, and IV mounting pole.</li>
</ul>""",
    specs_rows_html="""<tr><td height="20">Flow Rate Range</td><td>Adult Mode: 10 ~ 80 L/min; Pediatric Mode: 2 ~ 25 L/min</td></tr>
<tr><td height="20">Flow Accuracy</td><td>&plusmn;1 L/min or &plusmn;10%</td></tr>
<tr><td height="20">Oxygen Concentration (FiO2)</td><td>21% ~ 100% (Adjustable in 1% increments)</td></tr>
<tr><td height="20">FiO2 Accuracy</td><td>&plusmn;3%</td></tr>
<tr><td height="20">Dew Point Temperature Range</td><td>31&deg;C, 34&deg;C, 37&deg;C (Target Temperature Control)</td></tr>
<tr><td height="20">Display</td><td>7-inch High Resolution Color Touchscreen LCD</td></tr>
<tr><td height="20">Humidifier Chamber</td><td>Auto-feed water chamber with dual float valve mechanism</td></tr>
<tr><td height="20">Breathing Circuit</td><td>Single-limb heated inspiratory tube with integrated temperature sensor</td></tr>
<tr><td height="20">Safety Alarms</td><td>High/low temperature, high/low FiO2, tube occlusion, circuit disconnected, power failure</td></tr>
<tr><td height="20">Operating Noise</td><td>&le; 48 dB(A)</td></tr>
<tr><td height="20">Power Supply</td><td>AC 100~240V, 50/60Hz, Power rating 350VA</td></tr>"""
)

# 2. C-Pap Machine
create_product_page(
    folder_name="c-pap-machine",
    title="C-Pap Machine",
    meta_desc="Continuous Positive Airway Pressure (C-Pap) Machine by Medi Waves Inc — intelligent RESmart CPAP device for sleep apnea therapy. Request a quote today.",
    breadcrumb_name="C-Pap Machine",
    heading_title="Continuous Positive Airway Pressure (CPAP) Machine",
    image_rel_path="/wp-content/uploads/2026/09/CPAP-Machine-New.jpg",
    image_alt="C-Pap Machine",
    desc_html="""<p><strong>Intelligent Positive Airway Pressure Therapy</strong></p>
<p>The RESmart&trade; CPAP System is an intelligent positive airway pressure system engineered for clinical and home therapy of Obstructive Sleep Apnea (OSA). Its advanced algorithmic pressure management improves patient acclimation, ensuring therapeutic efficacy, safety, and acoustic comfort.</p>
<p><strong>Reliable Stability &amp; Advanced Control</strong></p>
<ul>
<li>Specially designed whisper-quiet air pump providing rock-solid 2 to 20 hPa therapeutic airway pressure.</li>
<li>Ramp capabilities allowing 0 to 60 minute settling time with custom initial starting pressure for natural sleep induction.</li>
<li>Inspiration trigger for automatic start-up and automatic shut-off when the mask is removed.</li>
<li>Audible and visual alerts for accidental power interruption and mask/tubing off-line conditions.</li>
<li>Automatic leakage and altitude compensation guarantee treatment precision regardless of location.</li>
<li>Patented delay-off feature protects internal circuitry and blower against humidity hazards.</li>
</ul>
<p><strong>Ergonomic &amp; Patient-Friendly Design</strong></p>
<ul>
<li>High-contrast backlit LCD screen for effortless operation in dark bedrooms and clinical wards.</li>
<li>Illuminated user tactile control buttons with safety lockup functionality.</li>
<li>Integrated InH2&trade; heated humidifier with anti-countercurrent water chamber technology.</li>
<li>Smart heater auto-restart mechanism following brief power pauses.</li>
<li>Ultra-low acoustic noise level below 30 dBA for quiet rest.</li>
</ul>""",
    specs_rows_html="""<tr><td height="20">Therapy Mode</td><td>CPAP (Continuous Positive Airway Pressure)</td></tr>
<tr><td height="20">Pressure Range</td><td>2.0 ~ 20.0 hPa (0.5 hPa increments)</td></tr>
<tr><td height="20">Pressure Stability</td><td>&plusmn;0.5 hPa</td></tr>
<tr><td height="20">Ramp Period</td><td>0 ~ 60 minutes (Adjustable in 5-minute increments)</td></tr>
<tr><td height="20">Sound Level</td><td>&lt; 30 dBA at 10 hPa</td></tr>
<tr><td height="20">Heated Humidifier</td><td>InH2&trade; heated humidifier (Levels 1 ~ 5, max 65&deg;C plate)</td></tr>
<tr><td height="20">Display</td><td>Backlit digital LCD display with key-lock</td></tr>
<tr><td height="20">Auto Functions</td><td>Auto Start (inspiration triggered), Auto Stop (mask removed)</td></tr>
<tr><td height="20">Compensation</td><td>Automatic air leak and altitude compensation</td></tr>
<tr><td height="20">Alarms</td><td>Mask disconnected, high leakage, tube occlusion, power failure</td></tr>
<tr><td height="20">Power Supply</td><td>AC 100~240V, 50/60Hz, 50VA max</td></tr>""",
    brochure_url="/wp-content/uploads/2023/07/respiratory-2.pdf",
    brochure_label="Download Brochure"
)

# 3. Bi-Pap Machine
create_product_page(
    folder_name="bi-pap-machine",
    title="Bi-Pap Machine",
    meta_desc="Bi-level Positive Airway Pressure (Bi-Pap) Machine by Medi Waves Inc — intelligent Bi-level ventilation therapy device for respiratory care and sleep therapy. Request a quote today.",
    breadcrumb_name="Bi-Pap Machine",
    heading_title="Bi-level Positive Airway Pressure (Bi-PAP) Machine",
    image_rel_path="/wp-content/uploads/2026/09/BiPAP-Machine-New.jpg",
    image_alt="Bi-Pap Machine",
    desc_html="""<p><strong>Bi-Level Ventilation &amp; Expiratory Relief</strong></p>
<p>The RESmart&trade; Bi-level (Bi-PAP / APAP) positive airway pressure system incorporates state-of-the-art flow sensor technology and RESlex&trade; expiration pressure release to deliver adaptive dual-pressure support for patients suffering from Obstructive Sleep Apnea (OSA), COPD, and respiratory insufficiency.</p>
<p><strong>Professional Precision &amp; Synchronized Comfort</strong></p>
<ul>
<li>Dual pressure settings (IPAP &amp; EPAP) provide synchronized inspiratory assistance and effortless exhalation.</li>
<li>Innovative tracking technology automatically responds to patient breathing effort and waveform dynamics.</li>
<li>RESlex&trade; expiratory pressure relief minimizes exhalation resistance, vastly enhancing patient compliance.</li>
<li>Customizable sensitivity settings provide individualized therapy algorithms tailored to each patient's pulmonary mechanics.</li>
<li>Automatic start-up on inspiration detection and auto-stop when the mask is taken off.</li>
<li>Automatic leak compensation and barometric altitude adjustment maintain precise target pressures.</li>
</ul>
<p><strong>Ergonomic &amp; Intelligent Architecture</strong></p>
<ul>
<li>Integrated InH2&trade; heated humidifier powered by DC 24V with infrared temperature regulation for warm, moisture-rich air.</li>
<li>Patented anti-countercurrent water tank design prevents fluid backflow into the blower unit.</li>
<li>Internal memory retains nightly raw therapy data, compliance statistics, and long-term treatment records.</li>
<li>Convenient direct compliance report output and data review interface.</li>
</ul>""",
    specs_rows_html="""<tr><td height="20">Therapy Modes</td><td>CPAP, S (Spontaneous Bi-Level), Auto BiPAP</td></tr>
<tr><td height="20">IPAP Range</td><td>4.0 ~ 25.0 hPa (0.5 hPa increments)</td></tr>
<tr><td height="20">EPAP Range</td><td>4.0 ~ 20.0 hPa (0.5 hPa increments)</td></tr>
<tr><td height="20">Pressure Accuracy</td><td>&plusmn;0.5 hPa</td></tr>
<tr><td height="20">Expiratory Relief</td><td>RESlex&trade; technology (Levels 1, 2, 3)</td></tr>
<tr><td height="20">Ramp Period</td><td>0 ~ 60 minutes (Adjustable in 5-minute increments)</td></tr>
<tr><td height="20">Sound Level</td><td>&lt; 30 dBA at 10 hPa</td></tr>
<tr><td height="20">Humidification</td><td>Detachable InH2&trade; heated humidifier (Levels 1 ~ 5)</td></tr>
<tr><td height="20">Display</td><td>High contrast multi-parameter backlit LCD</td></tr>
<tr><td height="20">Data Storage</td><td>365 nights compliance data &amp; multi-year summary records</td></tr>
<tr><td height="20">Safety Alarms</td><td>Low minute ventilation, high leak, apnea alarm, power loss</td></tr>
<tr><td height="20">Power Supply</td><td>AC 100~240V, 50/60Hz, 50VA max</td></tr>""",
    brochure_url="/wp-content/uploads/2023/07/respiratory-2.pdf",
    brochure_label="Download Brochure"
)

# Also create aliases cpap-machine and bipap-machine
for alias, target in [("cpap-machine", "c-pap-machine"), ("bipap-machine", "bi-pap-machine")]:
    alias_dir = os.path.join(BASE_DIR, alias)
    os.makedirs(alias_dir, exist_ok=True)
    target_src = os.path.join(BASE_DIR, target, "index.html")
    alias_dest = os.path.join(alias_dir, "index.html")
    shutil.copyfile(target_src, alias_dest)
    print(f"Created alias {alias_dest} pointing to {target}")

print("All respiratory pages generated successfully!")
