import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    // 1. Gelen siparişi oku
    const body = await request.json();
    const { imageUrl, modelUrl, type, prompt } = body;

    console.log(`🚀 AI Motoru Tetiklendi! Tür: ${type}`);

    let output;

    // --- SENARYO 1: METİN YAZARI (Llama-3) ---
    if (type === 'copywriter') {
      // Metin yazarlığı için en hızlı ve zeki model
      output = await replicate.run(
        "meta/meta-llama-3-70b-instruct",
        {
          input: {
            prompt: `Sen profesyonel bir moda editörüsün. Şu ürün görseli için Türkçe, satış odaklı, Instagram ve Trendyol uyumlu bir açıklama yaz. Ürün resmi linki: ${imageUrl}. Ton: ${prompt || 'Samimi ve heyecanlı'}. Özellikleri vurgula, emoji kullan.`,
            max_tokens: 500
          }
        }
      );
      // Llama çıktısı genelde array döner, birleştiriyoruz
      if (Array.isArray(output)) output = output.join(""); 
    }

    // --- SENARYO 2: HAYALET MANKEN / DEKUPE (BiRefNet) ---
    else if (type === 'ghost') {
      // Arkaplan silmede şu an en iyi model
      output = await replicate.run(
        "zhengcay/birefnet:7de29c0d9a700da95561a34b4c7302621765c9247d5267a285d92306869be4b3",
        {
          input: {
            image: imageUrl
          }
        }
      );
    } 

    // --- SENARYO 3: SANAL STÜDYO (IDM-VTON) ---
    // En pahalı ve en zor işlem budur.
    else {
      // Manken fotoğrafı (Kullanıcı seçmediyse varsayılan bir manken)
      const human = modelUrl || "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/model.jpg";
      
      output = await replicate.run(
        "cuuupid/idm-vton:c871bb9b0466074280c2a9a73b5d753e763bd3c87429273752e505a74653303d",
        {
          input: {
            garm_img: imageUrl, // Kıyafet (Askıda çekilen)
            human_img: human,   // Manken
            garment_des: "clothing", // Kumaş türü
            crop: false,
            steps: 30
          }
        }
      );
    }

    // Başarılıysa sonucu gönder
    console.log("✅ İşlem Başarılı:", output);
    return NextResponse.json({ success: true, output });

  } catch (error: any) {
    console.error("❌ MOTOR HATASI:", error);
    
    // Eğer bakiye yoksa özel mesaj döndür
    if (error.message.includes("payment") || error.message.includes("402")) {
        return NextResponse.json({ error: "Yetersiz Bakiye! Lütfen Replicate hesabına kredi yükleyin." }, { status: 402 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}