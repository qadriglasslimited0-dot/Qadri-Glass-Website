import json, re, sys
r = json.load(sys.stdin)
for p in (r.get('query', {}).get('pages', {})).values():
    ii = p['imageinfo'][0]; md = ii.get('extmetadata', {})
    lic = md.get('LicenseShortName', {}).get('value', '')
    if not re.search(r'CC0|CC BY|Public domain|PD', lic): continue
    if ii['width'] < 1600 or ii['width'] < ii['height']: continue
    art = re.sub('<[^>]+>', '', md.get('Artist', {}).get('value', ''))[:40]
    print(p['title'], '|', ii['width'], 'x', ii['height'], '|', lic, '|', art)
