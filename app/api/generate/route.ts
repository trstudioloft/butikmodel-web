import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, modelUrl, type, prompt } = body;

    console.log(`🚀 AI Motoru: ${type} işlemi başlatıldı.`);

    let output;

    // 1. METİN YAZARI
    if (type === 'copywriter') {
      output = await replicate.run(
        "meta/meta-llama-3-70b-instruct",
        {
          input: {
            prompt: prompt || "Write a sales caption.",
            max_tokens: 500
          }
        }
      );
      if (Array.isArray(output)) output = output.join(""); 
    }

    // 2. HAYALET MANKEN
    else if (type === 'ghost') {
      output = await replicate.run(
        "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        { input: { image: imageUrl } }
      );
    } 

    // 3. ATMOSFER SİHİRBAZI (YENİ EKLENDİ!) 🎨
    // Ürün arkaplanını değiştiren model (Ads Background)
    else if (type === 'background') {
      output = await replicate.run(
        "fofr/ads-background:9f7d639b251954388e404b32231922c2a014902166946002f23f03a60a928956", 
        {
          input: {
            image: imageUrl,
            prompt: prompt, // Kullanıcının girdiği "Paris sokakları" vb.
            negative_prompt: "low quality, distorted, watermark, text, blurry, ugly",
            num_outputs: 1
          }
        }
      );
      // Bu model dizi döndürebilir, ilkini al
      if (Array.isArray(output)) output = output[0];
    }

    // 4. SANAL STÜDYO (Manken Giydirme)
    else {
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

    console.log("✅ İşlem Başarılı:", output);
    return NextResponse.json({ success: true, output });

  } catch (error: any) {
    console.error("❌ MOTOR HATASI:", error);
    
    if (error.toString().includes("402") || error.toString().includes("billable")) {
        return NextResponse.json({ error: "⚠️ Bakiye Yetersiz! Lütfen Replicate hesabına kredi yükleyin." }, { status: 402 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}