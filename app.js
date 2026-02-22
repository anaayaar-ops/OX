import puppeteer from 'puppeteer';

async function getOwnerWithBrowser(roomId) {
    console.log(`🌐 جاري فتح المتصفح لفحص الروم: ${roomId}...`);
    
    // تشغيل متصفح خفي
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    try {
        // الذهاب للرابط والانتظار حتى يتم تحميل الشبكة بالكامل
        await page.goto(`https://www.wolf.live/g/${roomId}`, {
            waitUntil: 'networkidle2', 
            timeout: 60000
        });

        console.log("⏳ جاري تحليل البيانات بعد تشغيل الجافا سكريبت...");

        // استخراج البيانات من داخل "الذاكرة" التي صنعها المتصفح
        const data = await page.evaluate(() => {
            // البحث في كائن التخزين الخاص بالموقع
            return window.__INITIAL_STATE__ || "لم يتم العثور على كائن البيانات";
        });

        // إذا لم نجد الكائن، سنبحث عن أي نص يحتوي على معرف المالك في الصفحة
        const bodyText = await page.content();
        const ownerMatch = bodyText.match(/"ownerId"\s*:\s*(\d+)/);

        if (ownerMatch) {
            console.log(`------------------------------------------`);
            console.log(`✅ تم العثور على الهدف للروم: ${roomId}`);
            console.log(`👑 آيدي المالك: ${ownerMatch[1]}`);
            console.log(`------------------------------------------`);
        } else {
            console.log("❌ تعذر العثور على آيدي المالك. قد يتطلب الموقع تسجيل دخول لرؤية هذه التفاصيل حالياً.");
        }

    } catch (error) {
        console.error("❌ حدث خطأ أثناء التحميل:", error.message);
    } finally {
        await browser.close();
        console.log("      إغلاق المتصفح.");
    }
}

getOwnerWithBrowser(66266);
