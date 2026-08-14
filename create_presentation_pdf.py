from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit

ROOT = Path(__file__).parent
OUT = ROOT / "output" / "pdf" / "smart-wms-presentation.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

FONT = r"C:\Windows\Fonts\LeelawUI.ttf"
FONT_BOLD = r"C:\Windows\Fonts\leelawdb.ttf"
pdfmetrics.registerFont(TTFont("Thai", FONT))
pdfmetrics.registerFont(TTFont("ThaiBold", FONT_BOLD))

W, H = 1280, 720
NAVY = HexColor("#102B4E")
BLUE = HexColor("#2563EB")
SKY = HexColor("#EAF1FF")
INK = HexColor("#1E293B")
MUTED = HexColor("#64748B")
LINE = HexColor("#DFE8F3")
BG = HexColor("#F6F9FD")
GREEN = HexColor("#10B981")
ORANGE = HexColor("#F59E0B")
RED = HexColor("#EF4444")

def text(c, value, x, y, size=16, color=INK, bold=False, align="left"):
    c.setFont("ThaiBold" if bold else "Thai", size)
    c.setFillColor(color)
    if align == "center": c.drawCentredString(x, y, value)
    elif align == "right": c.drawRightString(x, y, value)
    else: c.drawString(x, y, value)

def wrapped(c, value, x, y, width, size=14, color=MUTED, leading=None, bold=False):
    leading = leading or size * 1.6
    lines = simpleSplit(value, "ThaiBold" if bold else "Thai", size, width)
    for line in lines:
        text(c, line, x, y, size, color, bold)
        y -= leading
    return y

def round_rect(c, x, y, w, h, fill=white, stroke=None, radius=16):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=bool(stroke))

def pill(c, value, x, y, fill=SKY, color=BLUE):
    c.setFont("ThaiBold", 11)
    width = c.stringWidth(value, "ThaiBold", 11) + 24
    round_rect(c, x, y, width, 25, fill, fill, 12)
    text(c, value, x + 12, y + 7, 11, color, True)
    return width

def header(c, title, subtitle, page):
    c.setFillColor(BG); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(white); c.rect(0, H-76, W, 76, fill=1, stroke=0)
    c.setFillColor(LINE); c.rect(0, H-76, W, 1, fill=1, stroke=0)
    round_rect(c, 48, H-57, 31, 31, BLUE, BLUE, 10)
    text(c, "W", 63.5, H-48, 14, white, True, "center")
    text(c, "SMART WMS", 92, H-49, 15, NAVY, True)
    text(c, title, 48, H-122, 28, NAVY, True)
    text(c, subtitle, 48, H-150, 14, MUTED)
    text(c, f"{page} / 5", W-48, 31, 11, MUTED, False, "right")

def footer(c):
    text(c, "Smart Warehouse Management System - Frontend Prototype", 48, 31, 10, MUTED)

def card(c, x, y, w, h, title, body, accent=BLUE, icon=None):
    round_rect(c, x, y, w, h, white, LINE)
    round_rect(c, x+20, y+h-52, 32, 32, HexColor("#EEF4FF"), HexColor("#EEF4FF"), 10)
    text(c, icon or "•", x+36, y+h-42, 16, accent, True, "center")
    text(c, title, x+20, y+h-78, 16, INK, True)
    wrapped(c, body, x+20, y+h-105, w-40, 12, MUTED, 19)

def cover(c):
    c.setFillColor(NAVY); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(HexColor("#1B579B")); c.circle(W-70, H-65, 250, fill=1, stroke=0)
    c.setFillColor(HexColor("#123963")); c.circle(W-85, H-75, 195, fill=1, stroke=0)
    pill(c, "FRONTEND PROTOTYPE", 78, 575, HexColor("#FFFFFF24"), HexColor("#DCEBFF"))
    text(c, "Smart Warehouse", 78, 502, 43, white, True)
    text(c, "Management System", 78, 450, 43, white, True)
    text(c, "ระบบจำลองสำหรับบริหารสินค้า ควบคุมสต็อก และติดตามการเคลื่อนไหวในคลังสินค้า", 78, 401, 17, HexColor("#D3E3F8"))
    text(c, "จัดทำเพื่อการนำเสนอระบบ", 78, 354, 13, HexColor("#9FC2E7"))
    # warehouse motif
    for i, height in enumerate((142, 196, 118)):
        x = 820 + i * 105
        round_rect(c, x, 125, 76, height, HexColor("#FFFFFF16"), HexColor("#FFFFFF38"), 9)
        for j, col in enumerate((HexColor("#70D5FF"), HexColor("#F6C469"), HexColor("#9FE8C3"))):
            round_rect(c, x+12, 145 + j*45, 52, 24, col, col, 4)
    round_rect(c, 78, 78, 463, 86, HexColor("#FFFFFF10"), HexColor("#FFFFFF1D"), 14)
    text(c, "HTML + Bootstrap 5 + CSS + JavaScript", 100, 124, 16, white, True)
    text(c, "ไม่มี Backend และ Database - ใช้ข้อมูลจำลองใน JavaScript Array", 100, 98, 13, HexColor("#B9D5F2"))
    c.showPage()

def overview(c):
    header(c, "แนวคิดของระบบ", "ลดความซับซ้อนของงานคลัง ให้ทีมเห็นข้อมูลสำคัญในมุมมองเดียว", 2)
    pill(c, "เป้าหมายหลัก", 48, 500)
    text(c, "เปลี่ยนงานบันทึกสต็อกที่กระจัดกระจาย ให้เป็นขั้นตอนที่ชัดเจนและตรวจสอบได้", 48, 457, 23, INK, True)
    cards = [
        ("มองเห็นภาพรวม", "Dashboard สรุปจำนวนสินค้า มูลค่าคงคลัง และรายการที่ต้องสั่งซื้อ", BLUE, "1"),
        ("บันทึกได้รวดเร็ว", "สร้างรายการรับเข้าและจ่ายออกผ่านฟอร์มเดียว พร้อมอัปเดตยอดทันที", GREEN, "2"),
        ("ตัดสินใจจากข้อมูล", "รายงานคงเหลือช่วยวางแผนสั่งซื้อ ลดโอกาสสินค้าขาดคลัง", ORANGE, "3"),
    ]
    for i, (t, b, a, icon) in enumerate(cards): card(c, 48+i*393, 234, 365, 176, t, b, a, icon)
    round_rect(c, 48, 92, 1144, 100, HexColor("#EEF6FF"), HexColor("#D7E8FD"))
    text(c, "กลุ่มผู้ใช้งาน", 72, 157, 14, BLUE, True)
    text(c, "ผู้จัดการคลังสินค้า · เจ้าหน้าที่รับสินค้า · เจ้าหน้าที่จัดส่ง · ผู้บริหาร", 72, 126, 18, INK, True)
    footer(c); c.showPage()

def functions(c):
    header(c, "ฟังก์ชันหลัก", "ออกแบบเป็น 6 หน้าหลักที่สอดคล้องกับลำดับงานคลังสินค้า", 3)
    items = [
        ("Login", "เข้าถึงระบบด้วยบัญชีตัวอย่าง พร้อมหน้าจอเรียบง่าย", BLUE, "01"),
        ("Dashboard", "สรุปสต็อก มูลค่าสินค้า รายการล่าสุด และแจ้งเตือน", GREEN, "02"),
        ("สินค้า", "เพิ่ม ค้นหา แก้ไข และดูสถานะสินค้าคงเหลือ", ORANGE, "03"),
        ("รับสินค้าเข้า", "บันทึกผู้ส่งมอบ สินค้า และจำนวนที่รับเข้าคลัง", BLUE, "04"),
        ("จ่ายสินค้าออก", "บันทึกผู้รับสินค้า พร้อมป้องกันการจ่ายเกินยอดคงเหลือ", RED, "05"),
        ("รายงาน", "สรุปสินค้าคงเหลือ มูลค่ารวม และส่งออกไฟล์ CSV", GREEN, "06"),
    ]
    for i, (t, b, a, no) in enumerate(items):
        col, row = i % 3, i // 3
        x, y = 48 + col*383, 325 - row*210
        card(c, x, y, 355, 178, t, b, a, no)
    footer(c); c.showPage()

def workflow(c):
    header(c, "ลำดับการทำงาน", "ผู้ใช้สามารถเรียนรู้ระบบได้จากเส้นทางการใช้งานที่ตรงไปตรงมา", 4)
    steps = [
        ("1", "เข้าสู่ระบบ", "เริ่มต้นจากบัญชีตัวอย่าง"),
        ("2", "สร้างสินค้า", "กำหนด SKU หมวดหมู่ และจุดสั่งซื้อ"),
        ("3", "รับสินค้าเข้า", "ยอดคงเหลือเพิ่มแบบทันที"),
        ("4", "จ่ายสินค้าออก", "ระบบตรวจสอบยอดก่อนบันทึก"),
        ("5", "ดูรายงาน", "วางแผนการสั่งซื้อจากข้อมูลคงเหลือ"),
    ]
    for i, (no, title, sub) in enumerate(steps):
        x = 54 + i*238
        if i < 4:
            c.setStrokeColor(HexColor("#B8D7FF")); c.setLineWidth(3); c.line(x+160, 375, x+225, 375)
        round_rect(c, x, 300, 180, 150, white, LINE)
        round_rect(c, x+20, 391, 35, 35, BLUE, BLUE, 11)
        text(c, no, x+37.5, 402, 14, white, True, "center")
        text(c, title, x+20, 362, 16, INK, True)
        wrapped(c, sub, x+20, 333, 140, 11, MUTED, 16)
    round_rect(c, 48, 120, 1144, 110, NAVY, NAVY)
    text(c, "แนวคิด UI/UX", 76, 188, 15, HexColor("#8EC5FF"), True)
    text(c, "เมนูชัดเจน · ปุ่มการทำงานหลักเด่น · สถานะสต็อกใช้สีช่วยสื่อความหมาย · รองรับมือถือ", 76, 154, 19, white, True)
    footer(c); c.showPage()

def technology(c):
    header(c, "เทคโนโลยีและจุดเด่น", "Prototype ที่เปิดใช้งานได้ทันทีจากไฟล์เดียว", 5)
    card(c, 48, 338, 355, 166, "Frontend เท่านั้น", "ใช้งานผ่าน index.html ได้ทันที ไม่ต้องติดตั้งเซิร์ฟเวอร์หรือฐานข้อมูล", BLUE, "<>" )
    card(c, 462, 338, 355, 166, "Responsive Design", "Bootstrap 5 ช่วยให้หน้าจอปรับตัวสำหรับ Desktop, Tablet และ Mobile", GREEN, "R" )
    card(c, 876, 338, 316, 166, "ข้อมูลจำลอง", "ใช้ JavaScript Array เพื่อสาธิตการเพิ่มสินค้าและอัปเดตสต็อก", ORANGE, "JS" )
    round_rect(c, 48, 146, 1144, 135, white, LINE)
    text(c, "สาธิตการนำเสนอ", 76, 245, 16, NAVY, True)
    demos = ["1. Login ด้วยบัญชีตัวอย่าง", "2. เปิด Dashboard เพื่อดูภาพรวม", "3. เพิ่มหรือแก้ไขสินค้า", "4. บันทึกรับเข้า / จ่ายออก", "5. Export รายงานเป็น CSV"]
    for i, d in enumerate(demos):
        x = 76 + (i % 3) * 355; y = 210 - (i // 3) * 31
        text(c, "✓", x, y, 14, GREEN, True)
        text(c, d, x+20, y, 13, INK)
    footer(c); c.showPage()

c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
c.setTitle("Smart WMS - Presentation")
c.setAuthor("Smart WMS Prototype")
cover(c); overview(c); functions(c); workflow(c); technology(c)
c.save()
print(OUT)
