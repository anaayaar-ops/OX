import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    targetRoomId: 66266
};

const service = new WOLF();

service.on('ready', async () => {
    console.log(`✅ متصل باسم: ${service.currentSubscriber.nickname}`);
    
    // محاولة الانضمام للروم لضمان استقبال الرسائل
    try {
        await service.groups.join(settings.targetRoomId);
        console.log(`📍 البوت الآن متواجد في الروم: ${settings.targetRoomId}`);
    } catch (e) {
        console.log(`⚠️ تنبيه: قد يكون البوت داخل الروم مسبقاً.`);
    }
});

service.on('message', async (message) => {
    // طباعة كل رسالة تصل للتأكد من القراءة (لأغراض الفحص)
    console.log(`📩 رسالة مستلمة من [${message.targetId}]: ${message.body}`);

    // التأكد من أن الرسالة من الروم المطلوب
    if (message.targetId == settings.targetRoomId) {
        
        const content = message.body || "";

        // فحص وجود الكلمات المطلوبة
        if (content.includes("اكتب") && content.includes("الان")) {
            
            // استخراج الثواني
            const match = content.match(/(\d+)/);
            const seconds = match ? parseInt(match[0]) : 5;

            console.log(`🎯 هدف مرصود! سأرسل بعد ${seconds} ثوانٍ...`);

            setTimeout(async () => {
                try {
                    await service.messaging.sendGroupMessage(settings.targetRoomId, "الان");
                    console.log(`🚀 تم إرسال "الان" بنجاح.`);
                } catch (err) {
                    console.error(`❌ فشل الإرسال: ${err.message}`);
                }
            }, seconds * 1000);
        }
    }
});

service.login(settings.identity, settings.secret);
