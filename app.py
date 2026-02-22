import wolf
import re
import os
from dotenv import load_dotenv

load_dotenv()

client = wolf.Client()
TARGET_BOT_ID = 82727814

# تخزين حالة اللوحة الحالية (محاكاة)
# بما أن البوت الآخر يرسل الأرقام فقط، سنقوم بتحديث مصفوفتنا بناءً على الرسالة
def get_smart_move(content):
    # 1. استخراج المربعات المشغولة والمتاحة
    # سنفترض أن الأرقام من 1-25 هي المتاحة
    available_moves = [int(m) for m in re.findall(r'\b(?:[1-9]|1[0-9]|2[0-5])\b', content)]
    
    if not available_moves:
        return None

    # 2. منطق الأولوية (الدفاع والهجوم)
    # في لوحة 5x5، المربعات الوسطى (مثل 13، 12، 8، 18) هي الأقوى استراتيجياً
    preferred_moves = [13, 12, 14, 8, 18, 7, 9, 17, 19]
    
    # التحقق إذا كان أي من المربعات المفضلة متاحاً
    for move in preferred_moves:
        if move in available_moves:
            return str(move)

    # 3. إذا لم يتوفر مربع استراتيجي، اختر أقرب رقم للمركز
    return str(available_moves[len(available_moves)//2])

@client.on.ready
async def on_ready():
    print(f"✅ البوت الذكي متصل الآن.")

@client.on.message_private
async def handle_private(message):
    if message.author_id == TARGET_BOT_ID:
        content = message.content
        
        # التأكد أن الدور لنا (وجود رمز X أو O في الرسالة)
        if "Your Turn" in content:
            # استراتيجية بسيطة: البحث عن أفضل مربع متاح
            move = get_smart_move(content)
            
            if move:
                # إضافة تأخير بسيط (0.5 ثانية) ليبدو الرد طبيعياً
                import asyncio
                await asyncio.sleep(0.5)
                await client.send_private_message(TARGET_BOT_ID, move)
                print(f"🎯 رد ذكي على المربع: {move}")

    # أمر التشغيل اليدوي
    if message.content == "ابدأ":
        await client.send_private_message(TARGET_BOT_ID, "!او خاص بوت 5")

client.run(os.getenv("U_MAIL"), os.getenv("U_PASS"))
