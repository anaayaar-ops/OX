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

// مصفوفة أولويات (الذكاء الاصطناعي البسيط)
// الأرقام في المنتصف (مثل 13) والزوايا لها قيمة أعلى للفوز في 5x5
const moveWeights = {
    13: 10, // المركز (أهم رقم)
    7: 8, 8: 8, 9: 8, 12: 8, 14: 8, 17: 8, 18: 8, 19: 8, // المربع الداخلي
    1: 5, 5: 5, 21: 5, 25: 5, // الزوايا
};

service.on('ready', async () => {
    console.log(`✅ البوت الذكي متصل: ${service.currentSubscriber.nickname}`);
    await service.messaging.sendPrivateMessage(settings.xoBotId, settings.startCommand);
});

service.on('message', async (message) => {
    if (!message.isGroup && message.sourceSubscriberId === settings.xoBotId) {
        
        const content = message.body || message.content || "";

        if (content.toLowerCase().includes("your turn") || content.includes("دورك")) {
            
            // 1. استخراج الأرقام المتاحة من النص (التي لم تُستخدم بعد)
            const availableMoves = content.match(/\b([1-9]|1[0-9]|2[0-5])\b/g);

            if (availableMoves && availableMoves.length > 0) {
                // 2. تحليل واختيار "أفضل حركة" بناءً على الأوزان
                const bestMove = availableMoves.reduce((prev, curr) => {
                    const prevWeight = moveWeights[prev] || 1;
                    const currWeight = moveWeights[curr] || 1;
                    return (currWeight > prevWeight) ? curr : prev;
                });

                console.log(`🧠 تحليل الذكاء: الأرقام المتاحة [${availableMoves.length}]. اخترت الأفضل استراتيجياً: ${bestMove}`);
                
                setTimeout(async () => {
                    await service.messaging.sendPrivateMessage(settings.xoBotId, bestMove);
                }, 2500);
            }
        }

        // إعادة التشغيل عند النهاية
        if (content.includes("Winner") || content.includes("فاز") || content.includes("Draw") || content.includes("تعادل")) {
            console.log("🏁 انتهت اللعبة. إعادة التشغيل بعد قليل...");
            setTimeout(async () => {
                await service.messaging.sendPrivateMessage(settings.xoBotId, settings.startCommand);
            }, 8000);
        }
    }
});

service.login(settings.identity, settings.secret);
