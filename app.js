import axios from 'axios';

// قائمة العضويات للفحص
const groupIds = [66266, 117372223344]; 

async function searchGroups() {
    console.log("🚀 بدء عملية البحث الدقيق عن الرومات...\n");

    for (const id of groupIds) {
        const url = `https://www.wolf.live/g/${id}`;
        
        try {
            const response = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
                }
            });

            const html = response.data;

            // الفحص الدقيق: 
            // 1. إذا وجد جملة "Channel not found"
            // 2. أو إذا كان العنوان الافتراضي للصفحة لا يحتوي على اسم الروم
            const isNotFound = html.includes("Channel not found") || 
                               html.includes("<title>WOLF</title>") || 
                               !html.includes("og:title");

            if (isNotFound) {
                console.log(`❌ الروم: ${id} | غير موجود`);
            } else {
                console.log(`✅ الروم: ${id} | موجود ☑️`);
            }

        } catch (error) {
            // إذا أعطى الموقع خطأ 404 مباشرة
            console.log(`❌ الروم: ${id} | غير موجود`);
        }
    }

    console.log("\n✨ انتهى الفحص.");
}

searchGroups();
