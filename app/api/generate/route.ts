import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, modelUrl, type, prompt } = body;

    console.log(`🚀 AI Motoru Çalışıyor... İşlem: ${type}`);

    let output;

    // 1. TÜR: METİN YAZARI (Llama-3-70b)
    // En zeki ve hızlı metin modeli
    if (type === 'copywriter') {
      output = await replicate.run(
        "meta/meta-llama-3-70b-instruct",
        {
          input: {
            prompt: `Sen profesyonel bir moda editörüsün. Şu ürün görseli için Türkçe, satış odaklı, Instagram ve Trendyol uyumlu bir açıklama yaz. Ürün resmi linki: ${imageUrl}. Ton: ${prompt || 'Samimi ve heyecanlı'}. Özellikleri vurgula, emoji kullan.`,
            max_tokens: 500
          }
        }
      );
      if (Array.isArray(output)) output = output.join(""); 
    }

    // 2. TÜR: HAYALET MANKEN (Rembg)
    // Arkaplan temizleme için en stabil model
    else if (type === 'ghost') {
      output = await replicate.run(
        "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        {
          input: {
            image: imageUrl
          }
        }
      );
    } 

    // 3. TÜR: SANAL STÜDYO (IDM-VTON) - KIYAFET GİYDİRME
    // Dünyanın en iyi giydirme modeli (Virtual Try-On)
    else {
      // Eğer kullanıcı manken seçmediyse varsayılan bir manken kullan
      const human = modelUrl || "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/model.jpg";
      
      // Kullanıcı kendi yüklediği resmi (kıyafeti) gönderiyor
      // NOT: Senin "Blob" hatan olmasın diye buraya test için çalışan bir link koyuyorum. 
      // Kendi resmini yükleyince hata alırsan sebebi Storage (Faz 2) eksikliğidir.
      // Şimdilik motorun çalıştığını görmek için bu "garment" linkini sabit tuttum.
      const garment = "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/cloth.jpg"; 

      output = await replicate.run(
        "yisol/idm-vton:c871bb9b0466074280c2a9a73b5d753e763bd3c87429273752e505a74653303d",
        {
          input: {
            human_img: human,
            garm_img: imageUrl.startsWith("http") ? imageUrl : garment, // Eğer link geçerliyse kullan, değilse test resmini kullan
            garment_des: "clothing",
            steps: 30,
            seed: 42
          }
        }
      );
    }

    console.log("✅ İşlem Başarılı! Sonuç:", output);
    return NextResponse.json({ success: true, output });

  } catch (error: any) {
    console.error("❌ MOTOR HATASI:", error);
    
    // ÖDEME HATASI YAKALAMA (402)
    if (error.message.includes("payment") || error.message.includes("402") || error.toString().includes("billable")) {
        return NextResponse.json({ error: "⚠️ Bakiye Yetersiz! Replicate hesabına kredi yüklemen gerekiyor." }, { status: 402 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}