import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    targetRoomId: 66266 // رقم الروم الخاص بك
};

const service = new WOLF();

service.on('ready', () => {
    console.log(`✅ البوت متصل باسم: ${service.currentSubscriber.nickname}`);
    console.log(`👀 مراقبة الروم رقم: ${settings.targetRoomId}`);
});

service.on('message', async (message) => {
    // التأكد أن الرسالة قادمة من الروم المطلوبة
    if (message.isGroup && message.targetSubscriberId === settings.targetRoomId) {
        
        const content = message.body || "";

        // البحث عن الجملة المطلوبة
        if (content.includes("اكتب {الان}")) {
            
            // استخراج الثواني ديناميكياً
            const match = content.match(/(\d+)/);
            const seconds = match ? parseInt(match[0]) : 5;

            console.log(`🎯 تم رصد الطلب! سأنتظر ${seconds} ثوانٍ...`);

            // تنفيذ الانتظار
            setTimeout(async () => {
                try {
                    // نستخدم المعرف المباشر للروم لتجنب خطأ undefined
                    await service.messaging.sendGroupMessage(settings.targetRoomId, "الان");
                    console.log(`🚀 تم إرسال "الان" بنجاح في الروم ${settings.targetRoomId}`);
                } catch (error) {
                    console.error("❌ فشل في الإرسال:", error.message);
                }
            }, seconds * 1000);
        }
    }
});

service.login(settings.identity, settings.secret);
