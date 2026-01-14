import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, modelUrl } = body; // modelUrl: Seçilen mankenin resmi

    console.log("🚀 Sipariş Geldi!", { imageUrl, modelUrl });

    // IDM-VTON'u seçilen manken ile çalıştır
    const output = await replicate.predictions.create({
      version: "c871bb9b0466074280c2a9a73b5d753e763bd3c87429273752e505a74653303d",
      input: {
        human_img: modelUrl || "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/model.jpg", // Eğer model yoksa yedeği kullan
        garm_img: imageUrl,
        garment_des: "clothing",
        seed: 42,
        steps: 30,
      },
    });

    return NextResponse.json(output, { status: 201 });

  } catch (error: any) {
    console.error("❌ API Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}