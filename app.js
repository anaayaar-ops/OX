import axios from 'axios';

const groupIds = [66266, 11500];

async function fetchAndAnalyze() {
    console.log("🛠️ جاري تحليل هيكلة البيانات للسيرفر...\n");

    for (const id of groupIds) {
        const url = `https://www.wolf.live/api/group/v2/${id}`;
        
        try {
            const response = await axios.get(url, {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Accept': 'application/json'
                }
            });

            const data = response.data;

            if (data) {
                console.log(`✅ تم جلب بيانات الروم: ${id}`);
                
                // استخراج المالك بذكاء من عدة مسارات محتملة
                const ownerId = data.ownerId || 
                                (data.owner && data.owner.id) || 
                                (data.details && data.details.ownerId) || 
                                "غير موجود في هذا المسار";

                const roomName = data.name || (data.details && data.details.name) || "بدون اسم";

                console.log(`📝 الاسم: ${roomName}`);
                console.log(`👑 آيدي المالك المستخرج: ${ownerId}`);
                
                // إذا لم نجد الآيدي، سنطبع مفاتيح الكائن لنعرف أين يختبئ المالك
                if (ownerId === "غير موجود في هذا المسار") {
                    console.log("🔍 المفاتيح المتاحة في البيانات:", Object.keys(data));
                }
                console.log("------------------------------------------");
            }

        } catch (error) {
            console.log(`❌ الروم: ${id} | فشل الطلب بالكامل.`);
        }
    }
}

fetchAndAnalyze();
