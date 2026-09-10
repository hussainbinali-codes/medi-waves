/**
 * Medi Waves Inc. — Product Catalog Data
 * Single source of truth for category -> sub-category -> product structure.
 * Consumed by the sub-category listing pages (see assets/js/catalog-render.js)
 * and used as the reference list when generating the mega-menu.
 *
 * All url/image/brochure paths are ROOT-RELATIVE (start with "/") so this file
 * works unmodified no matter how deep the page including it lives, in both
 * local development and production.
 *
 * `sequence` is the source of truth for display order within a sub-category.
 * Items sharing a sequence number are variants of the same catalog line
 * (e.g. two doppler models) and are shown together, in array order.
 */
window.MW_CATALOG = [
  {
    category: "Baby Care Equipment",
    slug: "baby-care-eqiupments",
    subCategories: [
      {
        name: "Infant Care & Delivery Room",
        slug: "infant-care-delivery-room",
        products: [
          { sequence: 1, name: "Radiant Warmer", url: "/infant-care/radiant-warmer-p-001a/", image: "/wp-content/uploads/2023/05/RadiantWarmer_new1.jpg", brochure: "/wp-content/uploads/catalogues/infant radient warmer broucher 2026.pdf" },
          { sequence: 2, name: "Phototherapy Unit", url: "/phototherapy-unit/", image: "/wp-content/uploads/2023/06/PTU-BL70.jpg", brochure: "/wp-content/uploads/2023/06/PTU_EN-BL70-Brochure.pdf" },
          { sequence: 3, name: "Baby Incubator", url: "/infant-incubator-p-002/", image: "/wp-content/uploads/2023/05/Infant-Incubator-P002.jpg", brochure: null },
          { sequence: 4, name: "Suction Units (Electric & Manual)", url: "/mobile-electric-suction/", image: "/wp-content/uploads/2026/09/Mobile-Electric-Suction-New.jpg", brochure: "/wp-content/uploads/catalogues/Electric_Suction_Apparatus.pdf" },
          { sequence: 5, name: "Cardio Toco Graph (BT-300)", url: "/infant-care/fetal-monitor-bt-300/", image: "/wp-content/uploads/2023/06/FetalMonitor_new.jpg", brochure: null },
          { sequence: 6, name: "Foetal Doppler", url: "/digital-fetal-doppler/", image: "/wp-content/uploads/2023/06/Digital-Fetal-Doppler.jpg", brochure: null },
          { sequence: 7, name: "Vacuum Extractor (Electric Portable)", url: "/electric-vacuum-extractor-portable/", image: "/wp-content/uploads/2026/09/Electric-Vacuum-Extractor-New.jpg", brochure: null },
          { sequence: 8, name: "Bilirubinometer (P-004)", url: "/bilirubinometer/", image: "/wp-content/uploads/2026/09/Bilirubinometer-P004.jpg", brochure: "/wp-content/uploads/catalogues/Jaundicemeter_Charger.pdf" },
          { sequence: 9, name: "Oxygen Hood", url: "/oxygen-hoods/", image: "/wp-content/uploads/2023/05/Oxygen-Hood.jpg", brochure: "/wp-content/uploads/catalogues/OxygenHood_Cat.pdf" },
          { sequence: 10, name: "Baby Bassinet (Baby Crib PHB-03)", url: "/pediatric-bed/baby-crib-phb-03/", image: "/wp-content/uploads/2023/05/Baby-Crib-PHB-03.jpg", brochure: "/wp-content/uploads/catalogues/Furniture_Cat.pdf" },
          { sequence: 11, name: "Digital Baby Weighing Scales (P-016)", url: "/digital-baby-weighing-scale-p-016/", image: "/wp-content/uploads/2023/05/Digital-Baby-Weighing-Scale-P-016.jpg", brochure: null },
          { sequence: 12, name: "Infantometer", url: "/infantometer/", image: "/wp-content/uploads/2023/04/Infantometer.jpg", brochure: null },
          { sequence: 13, name: "LED Phototherapy Unit", url: "/infant-care/led-phototherapy-unit-p-003/", image: "/wp-content/uploads/2023/04/LED-Photography-Unit-P003.jpg", brochure: null },
          { sequence: 14, name: "Slow Suction Apparatus", url: "/slow-suction-apparatus/", image: "/wp-content/uploads/2026/09/Slow-Suction-Apparatus-New.jpg", brochure: "/wp-content/uploads/catalogues/SlowSuction.pdf" },
          { sequence: 15, name: "Foot Suction Apparatus", url: "/foot-suction-apparatus/", image: "/wp-content/uploads/2023/05/Double-Bottle.jpg", brochure: null },
          { sequence: 16, name: "Digital Vacuum Regulator", url: "/digital-vacuum-regulator/", image: "/wp-content/uploads/2023/05/Digital-Vacuum-Regulator.jpg", brochure: null },
          { sequence: 17, name: "Deluxe Handy Models", url: "/deluxe-handy-models/", image: "/wp-content/uploads/2023/06/Deluxe-Handy-Models.jpg", brochure: "/wp-content/uploads/catalogues/FetalDoppler_Handy2.pdf" },
          { sequence: 18, name: "Manual Vacuum Extractor", url: "/manual-vacuum-xtractor/", image: "/wp-content/uploads/2026/09/Manual-Vacuum-Extractor-New.jpg", brochure: null },
          { sequence: 19, name: "Digital Baby Weighing Scale (Dual Display)", url: "/digital-baby-weighing-scale-with-dual-digital-display/", image: "/wp-content/uploads/2023/05/Digital-Baby-Weighing-Scale.jpg", brochure: null },
          { sequence: 20, name: "Infant T-Piece Resuscitator", url: "/infant-care/infant-resuscitator-p-023/", image: "/wp-content/uploads/2023/05/Infant-RESP-23.jpg", brochure: "/wp-content/uploads/catalogues/Infant_Resuscitator.pdf" }
        ]
      },
      {
        name: "Child Growth Monitoring",
        slug: "child-growth-monitoring",
        products: [
          { sequence: 1, name: "Child Growth Monitoring System", url: "/child-growth-monitoring-system/", image: "/wp-content/uploads/2025/08/Child-Growth-Monitoring-IMG.jpg", brochure: "/wp-content/uploads/2025/08/Child-Growth-Monitoring.pdf" },
          { sequence: 2, name: "Child Health Monitoring System", url: "/child-health-monitoring-system/", image: "/wp-content/uploads/2025/08/Child-Health-Monitoring-System-IMG.jpg", brochure: "/wp-content/uploads/2025/08/Final-17th-July1.pdf" }
        ]
      }
    ]
  },
  {
    category: "Monitoring Equipments",
    slug: "monitoring-equipments",
    subCategories: [
      {
        name: "Monitoring Equipments",
        slug: "monitoring-equipments",
        products: [
          { sequence: 1, name: "Pulse Oximeter", url: "/pulse-oximeter/", image: "/wp-content/uploads/2026/09/Pulse-Oximeter-New.jpg", brochure: null },
          { sequence: 2, name: "ECG Machine (ECG1201)", url: "/ecg-1201/", image: "/wp-content/uploads/2026/09/ECG1201-New.jpg", brochure: "/wp-content/uploads/catalogues/ECG_12_MWI.pdf" },
          { sequence: 2, name: "ECG Machine (ECG601)", url: "/ecg-601/", image: "/wp-content/uploads/2026/09/ECG601-New.jpg", brochure: "/wp-content/uploads/catalogues/ECG-601.pdf" },
          { sequence: 3, name: "Multi Parameter Patient Monitor PM-5000", url: "/patient-monitor-pm-5000/", image: "/wp-content/uploads/2026/09/PM-5000.jpg", brochure: "/wp-content/uploads/catalogues/Monitor_15inch_PM-5000.pdf" },
          { sequence: 4, name: "Defibrillator", url: "/defibrillator/", image: "/wp-content/uploads/2026/09/Defibrillator-New.jpg", brochure: null }
        ]
      }
    ]
  },
  {
    category: "Infusion Pumps",
    slug: "infusion-pumps",
    subCategories: [
      {
        name: "Infusion Pumps",
        slug: "infusion-pumps",
        products: [
          { sequence: 1, name: "Infusion Pump", url: "/infusion-pump/", image: "/wp-content/uploads/2023/05/Infusion-Pump.jpg", brochure: "/wp-content/uploads/catalogues/VolPump_Mwi.pdf" },
          { sequence: 2, name: "Syringe Pump", url: "/ms-31-syringe-pump-and-mx-infusion-workstation/", image: "/wp-content/uploads/2023/06/MX-Infusion-Workstation.jpg", brochure: "/wp-content/uploads/catalogues/SyringePump.pdf" },
          { sequence: 3, name: "Blood & Infusion Warmer", url: "/blood-infusion-warmer/", image: "/wp-content/uploads/2026/09/Blood-Infusion-Warmer-New.jpg", brochure: null }
        ]
      }
    ]
  },
  {
    category: "Respiratory Care Equipments",
    slug: "respiratory-care-equipments",
    subCategories: [
      {
        name: "Respiratory Care Equipments",
        slug: "respiratory-care-equipments",
        products: [
          { sequence: 1, name: "HFNC Machine", url: "/hfnc-machine/", image: "/wp-content/uploads/2026/09/HFNC-Machine-New.jpg", brochure: null },
          { sequence: 2, name: "Oxygen Concentrator", url: "/oxygen-concentrator/", image: "/wp-content/uploads/2023/07/Oxygen-Concen_Doubleflow.jpg", brochure: "/wp-content/uploads/2023/07/Dyn_Cat1.pdf", brochureAlt: "/wp-content/uploads/2023/07/DynCat2.pdf" },
          { sequence: 2, name: "Portable Oxygen Concentrator", url: "/portable-oxygen-concentrator/", image: "/wp-content/uploads/2025/06/portable-oxygenconcentrator.png", brochure: null },
          { sequence: 3, name: "C-Pap Machine", url: "/c-pap-machine/", image: "/wp-content/uploads/2026/09/CPAP-Machine-New.jpg", brochure: "/wp-content/uploads/2023/07/respiratory-2.pdf" },
          { sequence: 4, name: "Bi-Pap Machine", url: "/bi-pap-machine/", image: "/wp-content/uploads/2026/09/BiPAP-Machine-New.jpg", brochure: "/wp-content/uploads/2023/07/respiratory-2.pdf" }
        ]
      }
    ]
  },
  {
    category: "Electro Surgical Unit",
    slug: "electro-surgical-unit",
    subCategories: [
      {
        name: "Electro Surgical Unit",
        slug: "electro-surgical-unit",
        products: [
          { sequence: 1, name: "Electrosurgical Unit – Zeus Prime", url: "/electrosurgical-unit-zeus-prime/", image: "/wp-content/uploads/elementor/thumbs/ZEUS-Prime-sm-r75iijkxuc6csg16wiprgc3wwjytsmxny5y8lsvh54.jpg", brochure: "/wp-content/uploads/2025/06/Zeus_Prime_MWI.pdf" },
          { sequence: 2, name: "Electrosurgical Unit – Zeus Vision", url: "/electrosurgical-unit-zeus-vision/", image: "/wp-content/uploads/2025/06/Zeus_Vision_MWI-sm.jpg", brochure: "/wp-content/uploads/2025/06/Zeus_Vision_MWI.pdf" },
          { sequence: 3, name: "Electrosurgical Unit – Zeus 400", url: "/electrosurgical-unit-zeus-400/", image: "/wp-content/uploads/2025/06/Cat_ZEUS-400-sm.jpg", brochure: "/wp-content/uploads/2025/06/Cat_ZEUS-400.pdf" }
        ]
      }
    ]
  },
  {
    category: "Blood Pressure Monitor",
    slug: "blood-pressure-monitor",
    subCategories: [
      {
        name: "Blood Pressure Monitor",
        slug: "blood-pressure-monitor",
        products: [
          { sequence: 1, name: "Non-Mercury Blood Pressure Apparatus", url: "/mercury-free-sphygmomanometer/", image: "/wp-content/uploads/2023/05/Sphygmomanometer.jpg", brochure: "/wp-content/uploads/catalogues/BP_Cata_New.pdf" }
        ]
      }
    ]
  }
];
