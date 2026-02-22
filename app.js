import axios from 'axios';

// قائمة العضويات (الرومات) التي تريد البحث عنها
const groupIds = [66266, 782837277777];

async function checkGroups() {
    console.log("🔍 جاري فحص الرومات...\n");
    console.log("---------------------------------");

    for (const id of groupIds) {
        const url = `https://www.wolf.live/g/${id}`;
        
        try {
            // نحاول الوصول للرابط
            const response = await axios.get(url, {
                timeout: 5000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            // إذا نجح الرد، يعني الروم موجود
            if (response.status === 200) {
                console.log(`✅ الروم: ${id} | موجود ☑️`);
            }

        } catch (error) {
            // إذا أعطى خطأ 404 أو لم يجد الصفحة، يعني غير موجود
            if (error.response && error.response.status === 404) {
                console.log(`❌ الروم: ${id} | غير موجود`);
            } else {
                // في حال وجود حماية أو خطأ بالاتصال
                console.log(`⚠️ الروم: ${id} | تعذر الفحص (ربما محمي أو خطأ اتصال)`);
            }
        }
    }

    console.log("---------------------------------");
    console.log("✅ انتهى الفحص.");
}

// تشغيل الفحص
checkGroups();
