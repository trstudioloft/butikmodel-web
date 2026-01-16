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
    if (type === 'copywriter') {
      // Resmi model slug'ı kullanıyoruz (Version ID yerine)
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

    // 3. TÜR: SANAL STÜDYO (IDM-VTON)
    // DÜZELTME BURADA: 'yisol' yerine 'cuuupid' kullanıyoruz.
    else {
      // Eğer kullanıcı manken seçmediyse varsayılan bir manken kullan
      const human = modelUrl || "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/model.jpg";
      const garment = "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/cloth.jpg"; 

      output = await replicate.run(
        "cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4",
        {
          input: {
            human_img: human,
            garm_img: imageUrl.startsWith("http") ? imageUrl : garment,
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
    
    // ÖDEME HATASI (402) - Bunu görürsek işlem tamamdır!
    if (error.toString().includes("402") || error.toString().includes("billable")) {
        return NextResponse.json({ error: "⚠️ Bakiye Yetersiz! Replicate hesabına kredi yüklemen gerekiyor." }, { status: 402 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}