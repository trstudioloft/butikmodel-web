export default function TermsPage() {
  return (
    <div className="prose prose-lg max-w-none text-gray-600">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Kullanım Koşulları</h1>
      <p className="text-sm text-gray-400 mb-10">Son Güncelleme: 16 Ocak 2026</p>

      <p>
        ButikModel.com hizmetlerini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Lütfen dikkatlice okuyunuz.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Hizmetin Tanımı</h3>
      <p>ButikModel.com, yapay zeka destekli görsel üretim ve düzenleme hizmeti sunan bir SaaS (Software as a Service) platformudur. Kullanıcılar fotoğraf yükleyerek bu fotoğrafları işleyebilir.</p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Yasaklı Kullanım</h3>
      <p>Platform üzerinden aşağıdaki içeriklerin üretilmesi veya yüklenmesi kesinlikle yasaktır:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Yasa dışı, tehditkar, pornografik veya şiddet içeren içerikler.</li>
        <li>Telif hakkı size ait olmayan veya izinsiz kullanılan ticari markalar.</li>
        <li>Deepfake, ünlülerin yüzlerini izinsiz kullanma veya başkalarının kimliğini taklit eden içerikler.</li>
      </ul>
      <p className="mt-2 text-sm italic">Bu kuralların ihlali durumunda hesabınız uyarı yapılmaksızın kapatılabilir.</p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Ödeme ve İadeler</h3>
      <p>Satın alınan krediler "dijital ürün" kapsamındadır ve kural olarak iade edilmez. Ancak sistem kaynaklı teknik bir hata durumunda (işlemin başarısız olması vb.) krediniz iade edilir.</p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Fikri Mülkiyet</h3>
      <p>Platformda ürettiğiniz görsellerin ticari kullanım hakları (CC0 veya Commercial License) size aittir. ButikModel.com bu görseller üzerinde hak iddia etmez.</p>
      
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Sorumluluk Reddi</h3>
      <p>Yapay zeka teknolojisi doğası gereği her zaman %100 mükemmel sonuçlar vermeyebilir. Şirketimiz, dolaylı zararlardan veya veri kaybından sorumlu tutulamaz.</p>
    </div>
  );
}