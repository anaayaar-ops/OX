import axios from 'axios';
import fs from 'fs'; // مكتبة النظام لحفظ الملفات

const roomId = 66266; // الرقم الذي تريد فحص صفحته
const url = `https://www.wolf.live/g/${roomId}`;

async function saveFullHTML() {
    console.log(`📡 جاري سحب الصفحة الكاملة للروم: ${roomId}...`);

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            }
        });

        const html = response.data;

        // 1. حفظ الصفحة في ملف لتتمكن من فحصها بدقة
        fs.writeFileSync('room_page.html', html);
        console.log("💾 تم حفظ الصفحة بنجاح في ملف: room_page.html");

        // 2. طباعة الكود في الشاشة (قد يكون طويلاً جداً)
        console.log("\n--- بداية كود HTML ---");
        console.log(html);
        console.log("--- نهاية كود HTML ---\n");

        // 3. فحص سريع لوجود أي أرقام تشبه الآيدي (مكونة من 7-8 أرقام)
        const possibleIds = html.match(/\b\d{7,9}\b/g);
        if (possibleIds) {
            console.log("🧐 أرقام قد تكون آيديات تم العثور عليها:", [...new Set(possibleIds)]);
        }

    } catch (error) {
        console.error("❌ فشل جلب الصفحة:", error.message);
    }
}

saveFullHTML();
