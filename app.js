import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateB: parseInt(process.env.EXIT_P),
    action: "الان",
    // ⬇️ هذا الرقم يخصم 180 مللي ثانية ليعوض تأخير الـ 0.16 التي ظهرت لك
    // يمكنك رفعه قليلاً (مثلاً لـ 200) إذا استمر التأخير بسيطاً
    offset: 160
   
};

const service = new WOLF();

service.on('ready', () => {
    console.log(`✅ بوت المسابقات جاهز: ${service.currentSubscriber.nickname}`);
    console.log(`⏱️ معوض التأخير الحالي: ${settings.offset}ms`);
});

service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    // التحقق من رسالة المسابقة
    if (text.includes("اكتب {الان} بعد مرور") && text.includes("ثانية للفوز!")) {
        
        // استخراج الرقم (مثلاً 5 ثواني)
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 5; 
        
        // حساب الوقت الصافي بدقة: (الثواني * 1000) - معوض التأخير
        const finalWait = (waitSeconds * 1000) - settings.offset;

        console.log(`🎯 رصد المسابقة: ${waitSeconds} ثانية.`);
        console.log(`⏳ جاري الانتظار لمدة: ${finalWait}ms (بعد خصم التأخير)`);

        // تنفيذ الانتظار والحساب
        setTimeout(async () => {
            try {
                // الإرسال فوراً
                await service.messaging.sendGroupMessage(message.targetGroupId, settings.action);
                console.log(`🚀 تم الإرسال الآن!`);
            } catch (err) {
                console.error("❌ فشل الإرسال السريع:", err.message);
            }
        }, finalWait);
    }
});

service.login(settings.identity, settings.secret);
