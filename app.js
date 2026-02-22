import axios from 'axios';

// قائمة العضويات للفحص
const groupIds = [66266, 117372223344, 11500]; 

async function getGroupDetails() {
    console.log("🚀 بدء الفحص المباشر عبر سيرفر البيانات...\n");

    for (const id of groupIds) {
        // استخدام رابط الـ API المباشر للمجموعات
        const apiUrl = `https://www.wolf.live/api/group/${id}`;
        
        try {
            const response = await axios.get(apiUrl, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json'
                },
                timeout: 5000
            });

            const data = response.data;

            // التحقق من أن الاستجابة تحتوي على بيانات مجموعة حقيقية
            if (data && data.id) {
                console.log(`------------------------------------------`);
                console.log(`✅ الروم: ${data.id}`);
                console.log(`📝 الاسم: ${data.name || "بدون اسم"}`);
                console.log(`👑 آيدي المالك: ${data.ownerId || "غير معروف"}`);
                console.log(`👥 الأعضاء: ${data.membersCount || 0}`);
                console.log(`------------------------------------------`);
            } else {
                console.log(`❌ الروم: ${id} | غير موجود (بيانات فارغة)`);
            }

        } catch (error) {
            // إذا كان الخطأ 404 أو 400، فالروم غير موجود
            console.log(`❌ الروم: ${id} | غير موجود`);
        }
    }

    console.log("\n✨ انتهى الفحص.");
}

getGroupDetails();
