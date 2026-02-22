import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    targetRoomId: 66266 // رقم الروم الخاص بك
};

const service = new WOLF();

service.on('ready', async () => {
    console.log(`✅ البوت يعمل باسم: ${service.currentSubscriber.nickname}`);
    console.log(`🔒 وضع الحماية: يتم مراقبة الروم ${settings.targetRoomId} فقط.`);
});

service.on('message', async (message) => {
    // استخراج معرف الروم بشكل صحيح وتحويله لرقم للمقارنة
    const roomId = message.targetId || message.targetSubscriberId;

    // الفلترة: إذا كان رقم الروم لا يطابق رومك، تجاهل الرسالة فوراً
    if (parseInt(roomId) !== settings.targetRoomId) {
        return; 
    }

    const content = message.body || "";
    console.log(`📩 رسالة من رومك المحددة: ${content}`);

    // فحص محتوى الرسالة (اكتب {الان} بعد مرور X ثانية)
    if (content.includes("اكتب") && (content.includes("الان") || content.includes("الآن"))) {
        
        // استخراج عدد الثواني
        const match = content.match(/(\d+)/);
        const seconds = match ? parseInt(match[0]) : 5;

        console.log(`🎯 هدف مرصود! الانتظار لمدة ${seconds} ثانية...`);

        setTimeout(async () => {
            try {
                // إرسال الكلمة في الروم المحددة فقط
                await service.messaging.sendGroupMessage(settings.targetRoomId, "الان");
                console.log(`🚀 تم الإرسال بنجاح في روم ${settings.targetRoomId}`);
            } catch (err) {
                console.error(`❌ خطأ أثناء الإرسال: ${err.message}`);
            }
        }, seconds * 1000);
    }
});

service.login(settings.identity, settings.secret);
