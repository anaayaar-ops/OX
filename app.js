import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    xoBotId: 82727814, // تأكد من أن هذا هو معرف بوت الألعاب الصحيح
    startCommand: "!او خاص بوت 5"
};

const service = new WOLF();

// دالة بسيطة للانتظار
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

service.on('ready', async () => {
    console.log(`✅ بوت XO متصل: ${service.currentSubscriber.nickname}`);
    
    // إرسال أمر بدء اللعبة فور الاتصال
    try {
        await service.messaging.sendPrivateMessage(settings.xoBotId, settings.startCommand);
        console.log(`🎮 تم إرسال أمر بدء اللعبة: ${settings.startCommand}`);
    } catch (err) {
        console.error("❌ فشل إرسال أمر البداية:", err.message);
    }
});

service.on('message', async (message) => {
    // التأكد أن الرسالة خاصة ومن بوت الألعاب
    if (!message.isGroup && message.sourceSubscriberId === settings.xoBotId) {
        
        const content = message.body || message.content || "";
        
        // التحقق مما إذا كان الدور لنا (Your Turn)
        if (content.toLowerCase().includes("your turn") || content.includes("دورك")) {
            
            console.log("🎲 دوري الآن.. جاري التحليل واتخاذ حركة...");

            // استخراج الأرقام المتاحة من النص (إذا كان البوت يرسلها نصياً)
            // في حال كانت صورة فقط، سنعتمد على مصفوفة افتراضية أو منطق ذكي
            const move = getSmartMove(content);

            if (move) {
                // انتظار ثانيتين لمحاكاة سرعة البشر ولتجنب الحظر
                await sleep(2000);
                
                try {
                    await service.messaging.sendPrivateMessage(settings.xoBotId, move.toString());
                    console.log(`🎯 تم لعب الرقم: ${move}`);
                } catch (err) {
                    console.error("❌ فشل إرسال الحركة:", err.message);
                }
            }
        }
        
        // إذا انتهت اللعبة، يمكنك إضافة أمر هنا لإعادة التشغيل تلقائياً بعد فترة
        if (content.includes("فاز") || content.includes("تعادل") || content.includes("Winner")) {
            console.log("🏁 انتهت اللعبة. سأقوم بإعادة التشغيل بعد 10 ثوانٍ...");
            await sleep(10000);
            await service.messaging.sendPrivateMessage(settings.xoBotId, settings.startCommand);
        }
    }
});

/**
 * دالة ذكاء اصطناعي بسيطة لاختيار الحركة
 * يمكنك تطويرها لاحقاً لتقرأ مصفوفة اللعبة بالكامل
 */
function getSmartMove(content) {
    // محاولة استخراج الأرقام المتاحة من نص الرسالة إذا وجدت
    const availableNumbers = content.match(/\d+/g);
    
    if (availableNumbers && availableNumbers.length > 0) {
        // اختيار رقم من الأرقام المتاحة (يفضل اختيار المنتصف أولاً مثل 13)
        if (availableNumbers.includes("13")) return 13;
        return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    }

    // افتراضياً إذا لم نجد أرقاماً، نختار رقماً عشوائياً من 1 لـ 25
    return Math.floor(Math.random() * 25) + 1;
}

service.login(settings.identity, settings.secret);
