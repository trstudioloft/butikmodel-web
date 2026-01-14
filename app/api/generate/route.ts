import { NextResponse } from "next/server";
import Replicate from "replicate";
import { supabase } from "@/lib/supabase";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, modelId, userId } = body;

    console.log("🚀 Sipariş Geldi:", { imageUrl, modelId });

    // 1. Replicate IDM-VTON Modelini Çalıştır
    // (Bu işlem asenkrondur, cevabı hemen döner ama işlem arkada devam eder)
    const prediction = await replicate.predictions.create({
      version: "c871bb9b0466074280c2a9a73b5d753e763bd3c87429273752e505a74653303d", // IDM-VTON Modeli
      input: {
        human_img: "https://replicate.delivery/pbxt/Kqz10aXfQYc1092837/model.jpg", // Temsili manken (Şimdilik sabit, sonra dinamik yapacağız)
        garm_img: imageUrl, // Kullanıcının yüklediği kıyafet
        garment_des: "kıyafet",
      },
    });

    // 2. Takip Numarasını (Prediction ID) Veritabanına Kaydet
    // (Böylece frontend bu ID ile durumunu sorabilecek)
    if (prediction?.id) {
        // En son eklenen siparişi bul ve güncelle
        // Not: Normalde ID'yi frontend'den almak daha sağlamdır ama şimdilik son ekleneni güncelliyoruz.
        
        // Basitlik için: Frontend'e ID'yi dönelim, o kaydetsin.
    }

    return NextResponse.json(prediction, { status: 201 });

  } catch (error: any) {
    console.error("❌ API Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}