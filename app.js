import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    targetRoomId: 66266
};

const service = new WOLF();

service.on('ready', () => {
    console.log(`✅ متصل باسم: ${service.currentSubscriber.nickname}`);
    console.log(`🔎 أراقب الروم: ${settings.targetRoomId}`);
});

service.on('message', async (message) => {
    // 1. طباعة المعرفات للتأكد من مطابقة الروم
    // console.log(`Incoming from: ${message.targetSubscriberId}`); 

    if (parseInt(message.targetSubscriberId) === settings.targetRoomId) {
        
        // 2. محاولة استخراج النص من كل الأماكن الممكنة
        let content = "";

        if (message.body) content = message.body;
        else if (message.embed && message.embed.title) content = message.embed.title;
        else if (message.embed && message.embed.description) content = message.embed.description;
        else if (message.attachments && message.attachments.length > 0) {
            // بعض البوتات ترسل النص كمرفق (Attachment)
            content = JSON.stringify(message.attachments);
        }

        // تحويل المحتوى لنص عادي وتجاهل التشكيل والهمزات قدر الإمكان
        const cleanContent = content.toString().toLowerCase();

        console.log(`📩 نص تم رصده: [${cleanContent}]`);

        // 3. فحص الكلمات المفتاحية
        if (cleanContent.includes("اكتب") && (cleanContent.includes("الان") || cleanContent.includes("الآن"))) {
            
            const match = cleanContent.match(/(\d+)/);
            const seconds = match ? parseInt(match[1] || match[0]) : 5;

            console.log(`🚀 هدف مرصود! سأرسل بعد ${seconds} ثوانٍ...`);

            setTimeout(async () => {
                try {
                    await service.messaging.sendGroupMessage(settings.targetRoomId, "الان");
                    console.log(`✅ تم الإرسال بنجاح.`);
                } catch (e) {
                    console.error(`❌ فشل الإرسال: ${e.message}`);
                }
            }, seconds * 1000);
        }
    }
});

service.login(settings.identity, settings.secret);
