import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, modelUrl, type } = body; // 'type' parametresini de alıyoruz

    console.log(`🚀 Sipariş Geldi! Tür: ${type || 'Standart Manken'}`);

    let output;

    // ---------------------------------------------------------
    // SENARYO 1: HAYALET MANKEN (Ghost)
    // ---------------------------------------------------------
    if (type === 'ghost') {
      // 'rembg' modelini kullanarak arkaplanı (ve mankeni) siliyoruz
      output = await replicate.predictions.create({
        version: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003", // Rembg Modeli
        input: {
          image: imageUrl,
          return_mask: false // Sadece temizlenmiş resmi istiyoruz
        },
      });
    } 
    
    // ---------------------------------------------------------
    // SENARYO 2: AI MANKEN GİYDİRME (Standart)
    // ---------------------------------------------------------
    else {
      // IDM-VTON modelini kullanarak giydirme yapıyoruz
      output = await replicate.predictions.create({
        version: "c871bb9b0466074280c2a9a73b5d753e763bd3c87429273752e505a74653303d", // IDM-VTON Modeli
        input: {
          human_img: modelUrl || "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/model.jpg",
          garm_img: imageUrl,
          garment_des: "clothing",
          seed: 42,
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