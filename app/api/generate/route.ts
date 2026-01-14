import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, modelUrl, type } = body;

    console.log(`🚀 Sipariş Geldi! Tür: ${type || 'Standart'}`);

    let output;

    // 1. TÜR: METİN YAZARI (Copywriter)
    if (type === 'copywriter') {
      output = await replicate.predictions.create({
        version: "a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b27369fc46", // LLaVA-13b Modeli
        input: {
          image: imageUrl,
          top_p: 1,
          prompt: "Describe this fashion product for an e-commerce listing. Be professional, catchy and focus on material, style and occasion. Write in Turkish language.", // Türkçe istiyoruz
          max_tokens: 1024,
          temperature: 0.7
        },
      });
    }

    // 2. TÜR: HAYALET MANKEN (Ghost)
    else if (type === 'ghost') {
      output = await replicate.predictions.create({
        version: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003", // Rembg
        input: {
          image: imageUrl,
          return_mask: false
        },
      });
    } 
    
    // 3. TÜR: STANDART MANKEN GİYDİRME (Varsayılan)
    else {
      output = await replicate.predictions.create({
        version: "c871bb9b0466074280c2a9a73b5d753e763bd3c87429273752e505a74653303d", // IDM-VTON
        input: {
          human_img: modelUrl || "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/model.jpg",
          garm_img: imageUrl,
          garment_des: "clothing",
          steps: 30,
        },
      });
    }

    return NextResponse.json(output, { status: 201 });

  } catch (error: any) {
    console.error("❌ API Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}