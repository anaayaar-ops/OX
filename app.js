import axios from 'axios';

const groupIds = [66266, 11500, 117372223344];

async function fetchRoomData() {
    console.log("🚀 جاري محاولة استخراج البيانات من سيرفر التطبيق مباشرة...\n");

    for (const id of groupIds) {
        // هذا الرابط هو المسار الفعلي الذي يحتوي على ملفات التعريف (Profile) للمجموعات
        const url = `https://www.wolf.live/api/group/v2/${id}`;
        
        try {
            const response = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': `https://www.wolf.live/g/${id}`
                },
                timeout: 10000
            });

            const data = response.data;

            // إذا نجحنا في جلب الكائن البرمجي
            if (data && data.ownerId) {
                console.log(`------------------------------------------`);
                console.log(`✅ الروم: ${id}`);
                console.log(`📝 الاسم: ${data.name || "غير متوفر"}`);
                console.log(`👑 آيدي المالك: ${data.ownerId} ☑️`);
                console.log(`📍 الحالة: ${data.isPublic ? "عام" : "خاص"}`);
                console.log(`------------------------------------------`);
            } else {
                console.log(`❌ الروم: ${id} | موجود ولكن لا يمكن قراءة بيانات المالك.`);
            }

        } catch (error) {
            // في حال كان الروم غير موجود سيعطي السيرفر خطأ 404 أو 400
            console.log(`❌ الروم: ${id} | غير موجود (Channel not found)`);
        }
    }
    console.log("\n✨ انتهى الفحص.");
}

fetchRoomData();
