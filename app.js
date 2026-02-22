import axios from 'axios';

// قائمة العضويات للفحص
const groupIds = [66266, 11500, 117372223344]; 

async function getGroupDetails() {
    console.log("🔍 جاري الفحص واستخراج بيانات المالك (نظام المسح الشامل)...\n");

    for (const id of groupIds) {
        const url = `https://www.wolf.live/g/${id}`;
        
        try {
            const response = await axios.get(url, {
                // منع التوجيه التلقائي لصفحات الخطأ
                maxRedirects: 0,
                validateStatus: (status) => status === 200,
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
                }
            });

            const html = response.data;

            // استخراج البيانات باستخدام Regex يبحث عن الأنماط داخل JSON المدمج في الصفحة
            const ownerMatch = html.match(/"ownerId"\s*:\s*(\d+)/);
            const nameMatch = html.match(/"name"\s*:\s*"([^"]+)"/);

            if (ownerMatch || nameMatch) {
                console.log(`------------------------------------------`);
                console.log(`✅ الروم: ${id}`);
                console.log(`📝 الاسم: ${nameMatch ? nameMatch[1] : "غير متوفر"}`);
                console.log(`👑 آيدي المالك: ${ownerMatch ? ownerMatch[1] : "مخفي أو غير معروف"}`);
                console.log(`------------------------------------------`);
            } else {
                console.log(`❌ الروم: ${id} | موجود ولكن البيانات مشفرة أو مخفية`);
            }

        } catch (error) {
            // إذا أعطى كود 302 أو 404 أو فشل الطلب
            console.log(`❌ الروم: ${id} | غير موجود`);
        }
    }

    console.log("\n✨ انتهى الفحص.");
}

getGroupDetails();
