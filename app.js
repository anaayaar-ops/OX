import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateB: parseInt(process.env.EXIT_P), // رقم الروم المستهدف
    action: "الان" 
};

const service = new WOLF();

service.on('ready', () => {
    console.log(`✅ تم تسجيل الدخول: ${service.currentSubscriber.nickname}`);
});

service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    // الشرط الذي كنت تستخدمه لمراقبة النص
    if (text.includes("اكتب {الان} بعد مرور") && text.includes("ثانية للفوز!")) {
        
        // استخراج الثواني بنفس الطريقة التي استخدمناها يوم الأربعاء
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 5; 
        
        console.log(`🎯 رصد رسالة المسابقة. انتظار ${waitSeconds} ثانية...`);

        // استخدام setTimeout كما في كودك القديم
        setTimeout(async () => {
            try {
                await service.messaging.sendGroupMessage(message.targetGroupId, settings.action);
                console.log(`🚀 تم إرسال [${settings.action}] بعد انتهاء الوقت.`);
            } catch (err) {
                console.error("❌ فشل في الإرسال:", err.message);
            }
        }, waitSeconds * 1000);
    }
});

service.login(settings.identity, settings.secret);
