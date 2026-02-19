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

// ذاكرة اللعبة لضمان عدم التكرار
let board = Array(26).fill(true); // من 1 لـ 25

// مصفوفة القوة (الأرقام التي تفتح فرص فوز أكبر)
const strategicMoves = [13, 7, 8, 9, 12, 14, 17, 18, 19, 1, 5, 21, 25];

service.on('ready', async () => {
    console.log(`✅ تم تشغيل الذكاء الاصطناعي: ${service.currentSubscriber.nickname}`);
    resetGame();
    await service.messaging.sendPrivateMessage(settings.xoBotId, settings.startCommand);
});

service.on('message', async (message) => {
    if (!message.isGroup && message.sourceSubscriberId === settings.xoBotId) {
        
        const content = message.body || message.content || "";

        // 1. تحديث الذاكرة: إذا رأينا رقم تم لعبه في الرسالة، نحذفه من المتاح
        const usedNumbers = content.match(/\b([1-9]|1[0-9]|2[0-5])\b/g);
        if (usedNumbers) {
            // ملاحظة: هذا الجزء يحتاج لدقة، سنعتمد على الأرقام المتاحة التي يرسلها البوت
        }

        // 2. معالجة دور اللعب
        if (content.toLowerCase().includes("your turn") || content.includes("دورك")) {
            
            // استخراج الأرقام التي يذكر البوت أنها "متاحة" حصراً
            let available = content.match(/\b([1-9]|1[0-9]|2[0-5])\b/g) || [];
            
            // تحويلها لأرقام فريدة
            available = [...new Set(available)];

            if (available.length > 0) {
                // اختيار أفضل رقم استراتيجي من المتاح فقط
                let move = "";
                
                // البحث عن أول رقم استراتيجي متاح في قائمة الأولوية
                for (let best of strategicMoves) {
                    if (available.includes(best.toString())) {
                        move = best.toString();
                        break;
                    }
                }

                // إذا لم نجد رقم استراتيجي، نأخذ أول رقم متاح
                if (!move) move = available[0];

                console.log(`🧠 ذكاء: الأرقام المتاحة المرصودة [${available}]. اخترت الأقوى: ${move}`);
                
                setTimeout(async () => {
                    await service.messaging.sendPrivateMessage(settings.xoBotId, move);
                }, 2000);
            }
        }

        // 3. إعادة ضبط الذاكرة عند انتهاء اللعبة
        if (content.includes("Winner") || content.includes("فاز") || content.includes("Draw") || content.includes("تعادل")) {
            resetGame();
            setTimeout(async () => {
                await service.messaging.sendPrivateMessage(settings.xoBotId, settings.startCommand);
            }, 10000);
        }
    }
});

function resetGame() {
    board = Array(26).fill(true);
    console.log("🔄 تم إعادة تهيئة ذاكرة اللعبة.");
}

service.login(settings.identity, settings.secret);
