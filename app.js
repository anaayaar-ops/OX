import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    xoBotId: 82727814,
    startCommand: "!او خاص بوت 5"
};

const service = new WOLF();

service.on('ready', async () => {
    console.log(`✅ تم تشغيل البوت بنجاح: ${service.currentSubscriber.nickname}`);
    // بدء اللعبة
    await service.messaging.sendPrivateMessage(settings.xoBotId, settings.startCommand);
});

service.on('message', async (message) => {
    // التأكد من أن الرسالة خاصة ومن بوت الألعاب
    if (!message.isGroup && message.sourceSubscriberId === settings.xoBotId) {
        
        const content = message.body || message.content || "";
        
        // التحقق من أن الدور لنا
        if (content.toLowerCase().includes("your turn") || content.includes("دورك")) {
            
            // استخراج الأرقام المتوفرة من 1 إلى 25 من نص الرسالة
            // البوت عادة يرسل الأرقام المتاحة في وصف الصورة أو النص
            const availableMoves = content.match(/\b([1-9]|1[0-9]|2[0-5])\b/g);

            if (availableMoves && availableMoves.length > 0) {
                // استراتيجية بسيطة: اختيار الرقم الأقرب للمنتصف (13) لزيادة فرص الفوز
                const bestMove = availableMoves.includes("13") ? "13" : availableMoves[0];
                
                setTimeout(async () => {
                    await service.messaging.sendPrivateMessage(settings.xoBotId, bestMove);
                    console.log(`🎯 لعبت الرقم: ${bestMove}`);
                }, 3000); // انتظار 3 ثوانٍ ليبدو اللعب طبيعياً
            }
        }

        // إعادة تشغيل اللعبة عند النهاية
        if (content.includes("Winner") || content.includes("فاز") || content.includes("Draw")) {
            console.log("🏁 اللعبة انتهت، إعادة التشغيل...");
            setTimeout(async () => {
                await service.messaging.sendPrivateMessage(settings.xoBotId, settings.startCommand);
            }, 10000);
        }
    }
});

service.login(settings.identity, settings.secret);
