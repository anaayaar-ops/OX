import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    // معرف الروم التي تريد مراقبتها (اختياري للفلترة)
     targetGroupId: 66266
};

const service = new WOLF();

service.on('ready', () => {
    console.log(`✅ البوت متصل الآن: ${service.currentSubscriber.nickname}`);
    console.log("👀 جاري مراقبة الرومات للبحث عن جملة الفوز...");
});

service.on('message', async (message) => {
    // التأكد أن الرسالة داخل روم (مجموعة)
    if (message.isGroup) {
        
        const content = message.body || "";

        // التحقق من وجود النص المطلوب
        if (content.includes("اكتب {الان}")) {
            
            // استخراج الرقم (الثواني) من نص الرسالة باستخدام Regex
            // يبحث عن أي أرقام موجودة في النص
            const match = content.match(/(\d+)/);
            const seconds = match ? parseInt(match[0]) : 5; // إذا لم يجد رقم سيعتبرها 5 ثوانٍ افتراضياً

            console.log(`🎯 تم رصد الطلب في الروم [${message.targetSubscriberId}]`);
            console.log(`⏳ الانتظار لمدة ${seconds} ثانية...`);

            // تنفيذ الانتظار ثم الإرسال
            setTimeout(async () => {
                try {
                    await service.messaging.sendGroupMessage(message.targetSubscriberId, "الان");
                    console.log(`🚀 تم إرسال "الان" بنجاح في الوقت المحدد.`);
                } catch (error) {
                    console.error("❌ فشل في إرسال الرسالة:", error);
                }
            }, seconds * 1000);
        }
    }
});

service.login(settings.identity, settings.secret);
