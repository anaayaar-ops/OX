import axios from 'axios';

const id = 66266; // الروم الذي سنفحصه كعينة
const url = `https://www.wolf.live/g/${id}`;

async function debugRoom() {
    console.log(`🔎 جاري فحص محتوى الصفحة للروم: ${id}...`);
    
    try {
        const response = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
            }
        });

        console.log("✅ تم استلام رد من السيرفر!");
        console.log(`📡 كود الحالة: ${response.status}`);
        
        const html = response.data;
        
        console.log("\n--- بداية محتوى الصفحة (أول 1000 حرف) ---");
        console.log(html.substring(0, 1000));
        console.log("--- نهاية العينة ---\n");

        // فحص وجود كلمة ownerId في كامل الصفحة
        const hasOwner = html.includes("ownerId");
        console.log(`❓ هل كلمة 'ownerId' موجودة في الصفحة؟ ${hasOwner ? "نعم ✅" : "لا ❌"}`);

    } catch (error) {
        console.error("❌ فشل الطلب:");
        if (error.response) {
            console.log(`خطأ من السيرفر: ${error.response.status}`);
            console.log(error.response.data.substring(0, 500));
        } else {
            console.log(`خطأ في الاتصال: ${error.message}`);
        }
    }
}

debugRoom();
