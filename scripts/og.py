from PIL import Image
base = r'C:\Users\Dell\Desktop\AGENT\qadri-glass\client\public\brand'
og = Image.new('RGB', (1200, 630), (244, 250, 246))
logo = Image.open(base + r'\qadri-logo-color.png'); logo.thumbnail((460, 460))
og.paste(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2), logo)
og.save(base + r'\og-image.png', optimize=True)
