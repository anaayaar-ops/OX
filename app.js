import axios from 'axios';

// قائمة العضويات التي تريد فحصها
const groupIds = [66266, 117372223344]; 

async function searchGroups() {
    console.log("🚀 بدء عملية البحث عن الرومات...\n");

    for (const id of groupIds) {
        const url = `https://www.wolf.live/g/${id}`;
        
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            // تحويل محتوى الصفحة لنص للبحث بداخله
            const htmlContent = response.data;

            // التحقق إذا كانت الصفحة تحتوي على جملة "Channel not found"
            if (htmlContent.includes("Channel not found") || htmlContent.includes("لم يتم العثور")) {
                console.log(`❌ الروم: ${id} | غير موجود`);
            } else {
                console.log(`✅ الروم: ${id} | موجود ☑️`);
            }

        } catch (error) {
            // في حال كان الرابط معطلاً تماماً
            console.log(`❌ الروم: ${id} | غير موجود (خطأ في الرابط)`);
        }
    }

    console.log("\n✨ انتهى الفحص.");
}

searchGroups();
