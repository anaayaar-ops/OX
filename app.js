import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    targetRoomId: 66266 // رقم الروم
};

const service = new WOLF();

service.on('ready', () => {
    console.log(`✅ البوت متصل: ${service.currentSubscriber.nickname}`);
    console.log(`👀 أراقب الروم: ${settings.targetRoomId} الآن...`);
});

service.on('message', async (message) => {
    // التأكد من أن الرسالة في الروم المطلوب
    if (message.targetSubscriberId === settings.targetRoomId) {
        
        // استخراج النص بذكاء (دعم أكثر من صيغة للمكتبة)
        const content = message.body || message.content || (message.embed && message.embed.title) || "";
        
        // عرض ما يراه البوت في الكونسول للتأكد
        if (content.length > 0) {
            console.log(`📩 رسالة جديدة: [${content}]`);
        }

        // التحقق من وجود الكلمة المفتاحية (استخدام RegExp لجعلها أكثر مرونة)
        if (content.includes("اكتب") && content.includes("الان")) {
            
            // استخراج الثواني
            const secondsMatch = content.match(/(\d+)/);
            const seconds = secondsMatch ? parseInt(secondsMatch[0]) : 5;

            console.log(`🎯 تم العثور على المطلوب! الانتظار: ${seconds} ثوانٍ...`);

            setTimeout(async () => {
                try {
                    // إرسال الكلمة
                    await service.messaging.sendGroupMessage(settings.targetRoomId, "الان");
                    console.log(`🚀 تم الإرسال بنجاح!`);
                } catch (err) {
                    console.error(`❌ خطأ أثناء الإرسال: ${err.message}`);
                }
            }, seconds * 1000);
        }
    }
});

service.login(settings.identity, settings.secret);
