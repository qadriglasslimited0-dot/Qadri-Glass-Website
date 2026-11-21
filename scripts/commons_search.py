import json, sys, urllib.parse, urllib.request, re
UA = {'User-Agent': 'QadriGlassSiteBuilder/1.0 (site build; contact via project owner)'}
def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({**params, 'format': 'json'})
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
def search(q, n=12):
    r = api({'action': 'query', 'generator': 'search', 'gsrsearch': q + ' filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': n,
             'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 400})
    out = []
    for p in (r.get('query', {}).get('pages', {})).values():
        ii = p['imageinfo'][0]; md = ii.get('extmetadata', {})
        lic = md.get('LicenseShortName', {}).get('value', '')
        if not re.search(r'CC0|CC BY|Public domain|PD', lic): continue
        if ii['width'] < 1600 or ii['width'] < ii['height']: continue
        out.append((p['title'], ii['width'], ii['height'], lic, re.sub('<[^>]+>', '', md.get('Artist', {}).get('value', ''))[:40], ii['url']))
    return out
for q in sys.argv[1:]:
    print('==', q)
    for o in search(q): print(o[:5])
