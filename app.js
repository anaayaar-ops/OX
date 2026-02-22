import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    targetRoomId: 66266
};

const client = new WOLF();

client.on('ready', async () => {
    console.log(`✅ متصل باسم: ${client.currentSubscriber.nickname}`);
    
    try {
        // خطوة جوهرية: الاشتراك في الروم لاستقبال أحداث الرسائل
        await client.groups.subscribe(settings.targetRoomId);
        console.log(`📡 تم الاشتراك في الروم ${settings.targetRoomId} لاستقبال الرسائل...`);
    } catch (err) {
        console.error(`❌ فشل الاشتراك في الروم: ${err.message}`);
    }
});

// استخدام event 'groupMessage' مباشرة لضمان الالتقاط
client.on('groupMessage', async (message) => {
    
    // التحقق من رقم الروم
    if (message.targetSubscriberId === settings.targetRoomId) {
        
        // استخراج النص وتوحيده
        const content = (message.body || "").toString();
        console.log(`📩 رسالة من الروم: ${content}`);

        // فحص النص (دعم كل الصيغ المحتملة للكلمة)
        if (content.includes("اكتب") && (content.includes("الان") || content.includes("الآن"))) {
            
            // استخراج الثواني
            const match = content.match(/(\d+)/);
            const seconds = match ? parseInt(match[0]) : 5;

            console.log(`⏳ تم الرصد! سأنتظر ${seconds} ثوانٍ ثم أرسل...`);

            setTimeout(async () => {
                try {
                    await client.messaging.sendGroupMessage(settings.targetRoomId, "الان");
                    console.log(`🚀 تم الإرسال بنجاح!`);
                } catch (error) {
                    console.error(`❌ فشل في الإرسال: ${error.message}`);
                }
            }, seconds * 1000);
        }
    }
});

client.login(settings.identity, settings.secret);
