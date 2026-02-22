import axios from 'axios';

// قائمة العضويات للفحص
const groupIds = [66266, 117372223344, 11500]; 

async function getGroupDetails() {
    console.log("🔍 جاري فحص الرومات واستخراج بيانات المالك...\n");
    console.log("------------------------------------------");

    for (const id of groupIds) {
        const url = `https://www.wolf.live/g/${id}`;
        
        try {
            const response = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/110.0.0.0 Safari/537.36' 
                }
            });

            const html = response.data;

            // التحقق أولاً من وجود الروم
            if (html.includes("Channel not found") || html.includes("<title>WOLF</title>")) {
                console.log(`❌ الروم: ${id} | غير موجود`);
                continue;
            }

            // استخراج آيدي المالك باستخدام Regex من البيانات المخفية في الصفحة
            // نبحث عن نمط "ownerId":12345
            const ownerMatch = html.match(/"ownerId":\s*(\d+)/);
            const nameMatch = html.match(/"name":\s*"([^"]+)"/);

            const ownerId = ownerMatch ? ownerMatch[1] : "غير معروف";
            const roomName = nameMatch ? nameMatch[1] : "بدون اسم";

            console.log(`✅ الروم: ${id}`);
            console.log(`   📝 الاسم: ${roomName}`);
            console.log(`   👑 آيدي المالك: ${ownerId} ☑️`);
            console.log("------------------------------------------");

        } catch (error) {
            console.log(`❌ الروم: ${id} | غير موجود أو حدث خطأ في الاتصال`);
        }
    }

    console.log("\n✨ انتهى الفحص.");
}

getGroupDetails();
