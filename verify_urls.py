import urllib.request

paths = [
    '/respiratory-care-equipments/',
    '/hfnc-machine/',
    '/c-pap-machine/',
    '/bi-pap-machine/',
    '/cpap-machine/',
    '/bipap-machine/',
    '/wp-content/uploads/2026/09/HFNC-Machine-New.jpg',
    '/wp-content/uploads/2026/09/CPAP-Machine-New.jpg',
    '/wp-content/uploads/2026/09/BiPAP-Machine-New.jpg',
]

for p in paths:
    url = f"http://localhost:8000{p}"
    try:
        res = urllib.request.urlopen(url)
        print(f"[{res.status}] {p}")
    except Exception as e:
        print(f"[ERR] {p} -> {e}")
